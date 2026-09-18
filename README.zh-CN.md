# 迁移行为核对 · Port Contract Audit

[English](README.md) · [安装包与版本](https://github.com/Sevaschan/port-contract-audit/releases) · MIT

在软件跨语言、跨运行时迁移时，核对外部可观察的行为是否发生变化。这个 AI Skill 会对照你提供的约定与观测，区分已批准的变更、行为回归和证据不足，并生成可追溯的 JSON 报告及便于阅读的 Markdown 报告。

支持在 [iPolloWork](https://github.com/Devin-AXIS/iPolloWork) 中使用。`.ipollowork-plugin` 安装包包含一个 Skill 及报告格式参考文件，不包含 MCP 服务、应用界面、后台服务或可执行钩子；同时提供独立 Skill ZIP。

## 可以核对什么

- **序列化行为：** 字段缺省与 `null`、零值、false、默认值、错误结构与成功空值的区别。
- **集合行为：** 有意义的顺序与重复项，避免排序和去重掩盖差异。
- **生命周期轨迹：** 请求与调用标识、结果完成、取消行为；依据协议约定判断，不擅自要求所有请求共享一种全局事件顺序。
- **证据质量：** 过期版本的日志、由候选实现反向生成的预期值，以及抹掉待测行为的归一化逻辑。
- **有意变更：** 将明确批准的内容限制到相应字段、行为和候选版本。

适合 AI 辅助的 TypeScript → Rust 迁移、SDK 重写或运行时替换，帮助审查“重写后的测试全绿”能否支撑行为兼容结论。不直接连接 GitHub Copilot，也不要求安装 Rust 或 TypeScript 工具链。

## 输入与产出

准备一份迁移资料：基线和候选版本标识、独立的旧行为约定或测试样例、两个版本的观测、相关测试细节，以及明确的变更批准记录。写清核对范围和排除项；代码片段和日志应注明来源及版本。

| 文件 | 用途 |
| --- | --- |
| `port-contract-report.json` | 证据编号、逐项检查、判定依据风险、建议补测及限定范围的结论 |
| `port-contract-report.md` | 面向人的发现说明、支持证据、信息缺口及下一步 |

检查状态为 `match`（一致）、`mismatch`（不一致）、`unknown`（未知）或 `approved-change`（已批准变更）。总体结论为 `incompatible`、`unverified`、`intentional-delta` 或 `consistent-with-reviewed-evidence`，只覆盖审阅到的证据，不等于全系统等价认证或发布批准。

## 在 iPolloWork 中安装和使用

1. 在 [Releases](https://github.com/Sevaschan/port-contract-audit/releases) 下载 `port-contract-audit-1.0.0.ipollowork-plugin`。如需校验，下载三个归档和 `SHA256SUMS.txt` 后，在同一下载目录执行 `shasum -a 256 -c SHA256SUMS.txt`。
2. 打开 iPolloWork → **扩展** → **添加** → **选择文件**，选择安装包，确认预览包含一个 Skill，再安装。保持插件与 Skill 启用。
3. 在包含迁移资料的本地项目中新建任务。若旧任务看不到新技能，重新加载窗口后再新建任务。
4. 明确要求使用技能及随包参考文件，例如：

   > 使用已安装的 `port-contract-audit` 技能，读取它的 `references/report-format.md`。仅依据 `migration-packet.md` 中的资料审阅迁移，在本项目生成 `port-contract-report.json` 和 `port-contract-report.md`。不要执行测试或修改源代码。

5. 在处理过程确认已加载指定 Skill 并读取参考文件。在项目的产出/文件面板或本地目录打开两个报告，再复制到评审资料或附到拉取请求。
6. 更新时走相同文件导入流程，选择**更新**。保持包标识和发布者标识一致，重新加载后再使用新指令。

模型和文件工具由宿主提供，可能需要配置模型账号并联网。安装包不提供额外工具或凭据。只有确实希望执行命令时才要求宿主执行；默认流程只审阅资料，不运行示例中的测试。

若使用本地 Skill 导入，解压 `port-contract-audit-1.0.0-skill.zip`，在 iPolloWork 的本地技能导入入口选择**直接包含 `SKILL.md` 的 `port-contract-audit` 文件夹**，保留 `references` 子目录。已验收的分发路线是文件安装包导入，原始 GitHub 仓库链接不能替代这个安装流程。

## 用示例试一次

将 [examples/port-packet.md](examples/port-packet.md) 放入 iPollo 项目，把上面提示词的文件名替换为它。这个合成样例包含：

| 提供的观测 | 应有判断 |
| --- | --- |
| 缺省 timeout 变成 `null`，没有继承 1200 毫秒默认值 | 行为不一致 |
| 取消后的工具调用在请求结束前没有对应结果 | 生命周期不一致 |
| `oak, pine, oak` 变成 `pine, oak` | 顺序与重复项未保留 |
| `NOT_FOUND` 错误变成成功的空值 | 错误约定不一致 |
| 无效配置日志来自旧候选版本，且缺少旧行为约定 | 未知，需要当前版本与独立基线证据 |

预期总体结论为 `incompatible`。[expected-report.json](examples/expected-report.json) 是人工编写的格式示例，不是 iPollo 实际运行记录。检查项的分组和措辞可以不同，例如顺序与重复项可以合并，也可以分别报告。

另外两个小样例验证边界：[approved-change.md](examples/approved-change.md) 对局部已批准的序列化差异给出 `intentional-delta`，同时接受合法的跨请求交错；[missing-oracle.md](examples/missing-oracle.md) 在没有独立旧行为依据时给出 `unverified`。

## 报告校验与开发

使用 Skill 本身不需要 Node.js。仓库开发工具要求 Node.js 22+ 与系统 `zip` 命令，没有 npm 依赖：

```sh
npm test
npm run package
node scripts/validate-report.mjs --report examples/expected-report.json
node scripts/validate-report.mjs --report /path/to/port-contract-report.json --json
```

校验器检查结构、证据引用、版本关联要求和总体状态一致性，无法证明证据真实、约定语义充分或批准范围确实覆盖变更。退出码为 `0` 有效、`1` 报告无效、`2` 参数错误。`--report -` 从标准输入读取，`--help` 显示用法。

打包使用全新临时目录和固定文件元数据，完整包含 Skill 文件夹。安装归档仅有清单、`SKILL.md` 和参考文件；源码归档用于开发，不能直接当安装包。详见[报告格式](skills/port-contract-audit/references/report-format.md)、[验证记录](docs/validation.md)和[桌面验收](docs/desktop-acceptance.md)。

## 使用范围与限制

报告质量取决于宿主模型及输入证据。技能不会补造缺失日志、把语言习惯当成变更批准、把速度提升当成正确性证据，也不自动修复代码或执行迁移。结构校验通过不代表模型结论已获得独立审查；用于决策前仍需核对引用、版本与批准范围。

遇到问题，可在 [Issues](https://github.com/Sevaschan/port-contract-audit/issues) 提交脱敏资料、包版本、预期结果与实际结果，不要附带凭据或私有生产数据。
