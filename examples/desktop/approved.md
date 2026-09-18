# Port Contract Audit — port-approved-change.md

已加载路径：
- Skill: `<project>/.opencode/skills/port-contract-audit/SKILL.md`
- Reference: `<project>/.opencode/skills/port-contract-audit/references/report-format.md`

## 范围

- Baseline: `a17`
- Candidate: `b28`
- Surfaces: diagnostic debugLabel JSON serialization; per-request request/call event trace ordering
- Excluded: other JSON fields; timeouts; memory/FFI; persistent data; unobserved platforms

## Execution

- mode: `analysis-only`
- commands: none

## Checks

| Check | Surface | Status | Evidence | 结论 |
| --- | --- | --- | --- | --- |
| `CHK-debugLabel-absent` | diagnostic debugLabel JSON serialization | `approved-change` | `C1`, `A1`, `O1`, `N1` | a17 absent-debug response 为 `{}`；b28 为 `{"debugLabel":null}`。`A1` 明确批准且仅批准 absent `debugLabel` 的该变化，因此作为 visible approved change 记录，而不是 match。 |
| `CHK-per-request-trace` | per-request request/call event trace ordering | `match` | `C2`, `O2`, `N2` | baseline 和 candidate 都满足每个 request/call pair 在该 request 的 `done` 前有一个 result。candidate 改变了跨 request interleaving，但契约明确不规定 cross-request order。 |

## Oracle risks

无。输入声明没有 test-oracle changes 或 performance results。

## Scoped approvals

- `A1`: UX-42 仅将 absent `debugLabel` 改为在 b28 中序列化为 `null`。不扩展到其他 JSON 字段。

## Next tests

- `NEXT-debugLabel-scope`: 增加 scoped regression，确保只有 absent diagnostic `debugLabel` 被序列化为 `null`，其他 absent JSON fields 不被该批准覆盖。Command: `null`。
- `NEXT-trace-multiplicity`: 使用多个并发 request 和不同 call IDs，验证每个 emitted request/call pair 在该 request 的 `done` 前恰有一个 matching result，同时允许 cross-request interleaving。Command: `null`。

## Verdict

`intentional-delta` — 唯一观察到的行为变化是 absent `debugLabel` 从省略变为 `null`，且有明确 scoped approval；per-request trace 满足契约。该结论仅限供应证据和范围，不是发布批准。
