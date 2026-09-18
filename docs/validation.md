# Validation / 验证记录

The repository's 19 automated checks cover report shape, evidence linkage, stale candidate evidence, required approvals, verdict precedence, execution claims, CLI argument/error behavior, complete archives, deterministic packaging and symlink rejection. Run `npm test` to reproduce them. No product dependency needs installation.

仓库的 19 项自动检查覆盖报告结构、证据关联、过期候选证据、批准要求、结论优先级、执行声明、命令行参数与错误行为、归档完整性、可重复打包和符号链接拒绝。执行 `npm test` 可复现，无需安装项目依赖。

## Independent Skill exercises / 独立技能试用

An independent model first reviewed the main packet without this Skill. It already identified the core mismatches and evidence limitations. This is not evidence of an accuracy improvement from the Skill, and no such improvement is claimed.

A separate model then read only the Skill, bundled reference and three raw packets, without the authored expected report, tests, earlier response or parent conclusions. Its reports passed the repository validator. Manual inspection confirmed:

| Packet | Observed result |
| --- | --- |
| Main | `incompatible`; timeout, cancellation, ordering, duplicates and error behavior identified; stale invalid-config result kept unknown |
| Approved change | `intentional-delta`; approval limited to debugLabel; valid cross-request interleaving accepted |
| Missing oracle | `unverified`; no invented old behavior or test command |

独立模型先在不读取技能的情况下审阅主样例，已识别主要差异和证据局限，因此不能据此宣称技能提升了准确率。另一个独立模型仅阅读技能、参考格式和三个原始样例，不接触预期报告、测试或先前答案；三个报告均通过校验，人工复核也确认了上表中的判断。这里验证的是可重复的报告流程，不是量化性能评测。

Reports may split collection order and duplicate preservation into separate findings. Validation compares the substance, not a fixed check count or exact wording. Synthetic examples do not measure behavior on a real migration or guarantee future model results. See [desktop acceptance](desktop-acceptance.md) for the separate native iPolloWork run.

集合顺序与重复项可以分为两条发现；验收核对实质，不要求检查数量或措辞完全相同。合成样例不能替代真实迁移评测，也不保证后续模型输出。实际 iPolloWork 调用另见[桌面验收](desktop-acceptance.md)。
