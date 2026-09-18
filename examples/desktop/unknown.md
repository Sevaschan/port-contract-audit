# Port Contract Audit — port-missing-oracle.md

已加载路径：
- Skill: `<project>/.opencode/skills/port-contract-audit/SKILL.md`
- Reference: `<project>/.opencode/skills/port-contract-audit/references/report-format.md`

## 范围

- Baseline: `ts-old`
- Candidate: `rs-new`
- Surfaces: timeout JSON behavior; candidate suite parity claim; performance claim
- Excluded: old implementation behavior; baseline contracts; old fixtures; baseline observations; approved product changes; reproducible benchmark workload

## Execution

- mode: `analysis-only`
- commands: none

## Checks

| Check | Surface | Status | Evidence | 结论 |
| --- | --- | --- | --- | --- |
| `CHK-timeout-json` | timeout JSON behavior | `unknown` | `N1`, `G1` | 只有 rs-new 对 request `{}` 产生 `{"timeout":null}` 的 candidate-only 观察；没有 ts-old contract 或 baseline observation，无法判断 match/mismatch。 |
| `CHK-suite-parity` | candidate suite parity claim | `unknown` | `T1`, `G1` | 90 tests passed 但 expectations 从 rs-new 再生成，不能证明 old-versus-new parity。 |
| `CHK-performance-claim` | performance claim | `unknown` | `P1`, `G1` | “twice as fast” 缺少 machine、workload、baseline measurement 和可复现条件；性能也不替代正确性证据。 |

## Oracle risks

- `RISK-regenerated-expectations` (`T1`): passing suite 的 expectations 来自 candidate，自身不是独立 oracle。

## Scoped approvals

无。输入明确没有 approvals。

## Performance

- `P1` 仅为不可复现性能声明，缺少机器和工作负载细节；不作为兼容性证据。

## Next tests

- `NEXT-timeout-oracle`: 提供 ts-old timeout contract 或同条件 captured ts-old run，再与 rs-new 同条件观察比较。Command: `null`。
- `NEXT-independent-suite`: 恢复 ts-old expected outputs 或从 baseline oracle 生成 expected，而不是从 rs-new 生成。Command: `null`。
- `NEXT-reproducible-performance`: 定义 benchmark workload、machine/environment、sample size 和 baseline measurement；性能结果与正确性 parity 分开记录。Command: `null`。

## Verdict

`unverified` — 该包只有 candidate-side evidence、regenerated expectations 和不可复现性能声明；没有独立 baseline oracle 或 scoped approval，因此 parity 未被建立。
