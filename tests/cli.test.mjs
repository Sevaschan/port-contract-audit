import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const run=(args,input)=>spawnSync(process.execPath,['scripts/validate-report.mjs',...args],{cwd:root,encoding:'utf8',input});
test('missing input exits 2 with one actionable argument error',()=>{const r=run([]);assert.equal(r.status,2);assert.match(r.stderr,/Missing --report/);assert.doesNotMatch(r.stderr,/Invalid report/);});
test('help succeeds and valid JSON input is machine readable',()=>{assert.equal(run(['--help']).status,0);const r=run(['--report','examples/expected-report.json','--json']);assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).valid,true);});
test('stdin invalid report exits 1 without a stack trace',()=>{const r=run(['--report','-'],'{"schemaVersion":1}');assert.equal(r.status,1);assert.match(r.stderr,/Invalid report/);assert.doesNotMatch(r.stderr,/at Module/);});
