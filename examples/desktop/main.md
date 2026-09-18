# Port Contract Audit — port-port-packet.md

已加载路径：
- Skill: `<project>/.opencode/skills/port-contract-audit/SKILL.md`
- Reference: `<project>/.opencode/skills/port-contract-audit/references/report-format.md`

## 范围

- Baseline: `adapter-ts@a17`
- Candidate: `adapter-rs@b28`
- Surfaces: JSON adapter timeout semantics; tool_call/tool_result event protocol; list result ordering and multiplicity; missing-record error response; invalid-config behavior
- Excluded: authentication; persistence; real tools; other platforms; FFI memory ownership; tests unavailable outside the supplied packet

## Execution

- mode: `analysis-only`
- commands: none

## Checks

| Check | Surface | Status | Evidence | 结论 |
| --- | --- | --- | --- | --- |
| `CHK-timeout-omitted` | JSON adapter timeout semantics | `mismatch` | `C1`, `O1`, `N1`, `A1` | 旧契约和 a17 观察显示省略 timeout 应继承 session default 1200；b28 同 fixture 得到 `null`。`A1` 只批准 `debugLabel`，不覆盖 timeout。 |
| `CHK-cancel-result` | tool_call/tool_result event protocol | `mismatch` | `C2`, `O2`, `N2` | a17 cancellation trace 在 `done` 前有匹配 `CANCELLED` tool_result；b28 对已发出的 `r1/t1` call 直接 `done`，缺少 result。 |
| `CHK-list-repeat` | list result ordering and multiplicity | `mismatch` | `C3`, `O3`, `N3` | 契约要求保留顺序和重复；a17 为 `["oak","pine","oak"]`，b28 为 `["pine","oak"]`。 |
| `CHK-missing-record` | missing-record error response | `mismatch` | `C4`, `O4`, `N4`, `A2` | a17 返回结构化 `NOT_FOUND` error；b28 返回 success `{value:null}`。`A2` 是惯用法评论，不是产品批准。 |
| `CHK-invalid-config` | invalid-config behavior | `unknown` | `N5` | 只有旧 candidate `b27` 的观察；没有 b28 观察，也没有 old behavior/config contract。 |

## Oracle risks

- `RISK-regenerated-expected` (`T1`, `T4`): expected snapshots 和 timeout 测试从候选输出再生成，不能作为独立 baseline oracle。
- `RISK-list-normalization` (`T2`, `C3`): comparator 使用 `sort(unique())`，掩盖契约要求保留的顺序和重复。
- `RISK-dropped-error-results` (`T3`, `C2`): trace comparator 丢弃 error tool_result，掩盖 cancellation result 缺失。

## Scoped approvals

- `A1`: 仅批准 omitted diagnostic `debugLabel` 序列化为 `null`；不适用于 timeout 或 result values。
- `A2`: reviewer comment，不是 scoped product approval。

## Performance

- `P1`: synthetic happy path 50 requests，同机器 median a17=85 ms、b28=31 ms；未覆盖 cancellation。该性能信息不作为兼容性证据。

## Next tests

- `NEXT-timeout-omitted`: 恢复独立 fixture，断言 request `{}` 且 session default 1200 时 b28 应得到 `effectiveTimeoutMs=1200`；显式 `null` 才禁用 timeout。Command: `null`。
- `NEXT-cancel-result`: 不丢弃 error result，按 requestId/callId 比较 cancellation traces。期望每个已发出的 cancelled call 在 request done 前有且仅有一个匹配 `CANCELLED` result。Command: `null`。
- `NEXT-list-repeat`: 将 `sort(unique())` 替换为 exact sequence comparison。期望保留 `["oak","pine","oak"]`。Command: `null`。
- `NEXT-missing-record`: 断言 missing record 返回 `{code:"NOT_FOUND",id:"x"}` error，除非有明确 scoped approval。Command: `null`。
- `NEXT-invalid-config`: 获取 a17 contract/baseline observation 与当前 b28 observation 后再分类。Command: `null`。

## Verdict

`incompatible` — 已审证据显示 timeout omission、cancellation results、list ordering/multiplicity、missing-record error 均存在 mismatch；candidate suite 还有 oracle risks；invalid-config 仍 unknown。这是限定范围的证据审查，不是发布批准。
