import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

function fail(message){throw new Error(message);}
function object(value,keys,at){
  if(!value||typeof value!=='object'||Array.isArray(value))fail(at+' must be an object');
  for(const k of Object.keys(value))if(!keys.includes(k))fail(at+': unknown field '+k);
  for(const k of keys)if(!Object.hasOwn(value,k))fail(at+': missing '+k);
}
function text(value,at){if(typeof value!=='string'||!value.trim()||value.length>20000)fail(at+' must be nonempty text (max 20000 characters)');}
function nullable(value,at){if(value!==null)text(value,at);}
function array(value,at,nonempty=false){if(!Array.isArray(value)||(nonempty&&!value.length))fail(at+' must be '+(nonempty?'a nonempty':'an')+' array');}
function strings(value,at,nonempty=false){array(value,at,nonempty);value.forEach((v,i)=>text(v,at+'['+i+']'));}
function unique(values,at){const seen=new Set();for(const v of values){text(v.id,at+'.id');if(seen.has(v.id))fail('Duplicate '+at+' id '+v.id);seen.add(v.id);}return seen;}
function refs(values,ids,at,nonempty=true){strings(values,at,nonempty);for(const id of values)if(!ids.has(id))fail('Unknown '+at+' '+id);}
export function validateReport(r){
  object(r,['schemaVersion','kind','scope','execution','evidence','checks','oracleRisks','nextTests','verdict'],'report');
  if(r.schemaVersion!==1||r.kind!=='port-contract-audit')fail('Expected port-contract-audit schemaVersion 1');
  object(r.scope,['baseline','candidate','surfaces','excluded'],'scope');
  nullable(r.scope.baseline,'scope.baseline');text(r.scope.candidate,'scope.candidate');strings(r.scope.surfaces,'scope.surfaces',true);strings(r.scope.excluded,'scope.excluded');
  object(r.execution,['mode','commands'],'execution');strings(r.execution.commands,'execution.commands');
  if(!['analysis-only','executed-in-task'].includes(r.execution.mode))fail('Invalid execution.mode');
  if(r.execution.mode==='analysis-only'&&r.execution.commands.length)fail('analysis-only cannot claim executed commands');
  if(r.execution.mode==='executed-in-task'&&!r.execution.commands.length)fail('executed-in-task requires actual commands');
  array(r.evidence,'evidence');array(r.checks,'checks',true);array(r.oracleRisks,'oracleRisks');array(r.nextTests,'nextTests');
  const evidenceIds=unique(r.evidence,'evidence'),checkIds=unique(r.checks,'check');unique(r.oracleRisks,'oracle risk');unique(r.nextTests,'next test');
  const kinds=['contract','baseline-observation','candidate-observation','test-report','approval','performance','comment'];
  for(const e of r.evidence){object(e,['id','kind','source','snapshot','summary'],'evidence');if(!kinds.includes(e.kind))fail('Invalid evidence kind');text(e.source,'evidence.source');nullable(e.snapshot,'evidence.snapshot');text(e.summary,'evidence.summary');}
  const byId=new Map(r.evidence.map(e=>[e.id,e]));
  for(const c of r.checks){
    object(c,['id','surface','contract','baseline','candidate','status','evidenceIds','approvalIds'],'check');
    for(const key of ['surface','contract'])text(c[key],'check.'+key);
    nullable(c.baseline,'check.baseline');nullable(c.candidate,'check.candidate');
    if(!['match','mismatch','unknown','approved-change'].includes(c.status))fail('Invalid check.status');
    refs(c.evidenceIds,evidenceIds,'evidence');refs(c.approvalIds,evidenceIds,'approval',false);
    if(c.status==='approved-change'){if(!c.approvalIds.length||c.approvalIds.some(id=>byId.get(id).kind!=='approval'))fail('approved-change requires approval evidence');}
    else if(c.approvalIds.length)fail('approvalIds must be empty unless approved-change');
    if(c.status!=='unknown'){
      if(r.scope.baseline===null)fail('Confirmed checks require a baseline identifier');
      text(c.baseline,'check.baseline');text(c.candidate,'check.candidate');
      const items=c.evidenceIds.map(id=>byId.get(id));
      if(!items.some(e=>(e.kind==='contract'&&(e.snapshot===null||e.snapshot===r.scope.baseline))||(e.kind==='baseline-observation'&&e.snapshot===r.scope.baseline)))fail('Confirmed check requires an independent baseline oracle');
      if(!items.some(e=>e.kind==='candidate-observation'&&e.snapshot===r.scope.candidate))fail('Confirmed check requires a current candidate observation');
    }
  }
  for(const risk of r.oracleRisks){object(risk,['id','evidenceIds','reason'],'oracleRisk');refs(risk.evidenceIds,evidenceIds,'evidence');text(risk.reason,'oracleRisk.reason');}
  for(const t of r.nextTests){object(t,['id','checkIds','action','command','expected'],'nextTest');refs(t.checkIds,checkIds,'check');text(t.action,'nextTest.action');nullable(t.command,'nextTest.command');text(t.expected,'nextTest.expected');}
  object(r.verdict,['status','reason'],'verdict');text(r.verdict.reason,'verdict.reason');
  const statuses=r.checks.map(c=>c.status);
  const expected=statuses.includes('mismatch')?'incompatible':statuses.includes('unknown')||r.oracleRisks.length?'unverified':statuses.includes('approved-change')?'intentional-delta':'consistent-with-reviewed-evidence';
  if(r.verdict.status!==expected)fail('verdict.status must be '+expected);
  return r;
}
const help='Validate a Port Contract Audit report (structure, evidence links and status consistency only).\n\nnode scripts/validate-report.mjs --report examples/expected-report.json\ncat report.json | node scripts/validate-report.mjs --report - --json\n\n--report PATH  JSON report path, or - for stdin\n--json         Machine-readable success output\n-h, --help     Show help\n\nExit 0 valid; 1 invalid report; 2 invalid arguments. Does not verify evidence authenticity or approval scope.\nSupport: https://github.com/Sevaschan/port-contract-audit/issues';
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.includes('--help')||args.includes('-h'))console.log(help);
  else{
    let options;
    try{options=parseArgs({args,options:{report:{type:'string'},json:{type:'boolean'}},allowPositionals:false}).values;if(!options.report)fail('Missing --report. Use --help for examples.');}
    catch(e){options=null;console.error(e.message);process.exitCode=2;}
    if(options){try{const r=validateReport(JSON.parse(readFileSync(options.report==='-'?0:options.report,'utf8')));console.log(options.json?JSON.stringify({valid:true,status:r.verdict.status,checks:r.checks.length}):'Valid report: '+r.verdict.status+' ('+r.checks.length+' checks).');}catch(e){console.error('Invalid report: '+e.message);process.exitCode=1;}}
  }
}
