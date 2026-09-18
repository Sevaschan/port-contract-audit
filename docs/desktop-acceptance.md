# Desktop acceptance / 桌面验收

**Passed for 1.0.0 / 1.0.0 已通过。** Environment: iPolloWork 0.50.12, macOS arm64, OpenCode engine, GPT-5.5 with balanced reasoning. Synthetic migration packets only. The host model reviewed supplied observations; it did not run a TypeScript/Rust migration or the example tests.

环境：iPolloWork 0.50.12、macOS arm64、OpenCode 引擎、GPT-5.5 均衡推理。仅使用合成迁移资料；宿主模型分析已有观测，没有执行 TypeScript/Rust 迁移或样例测试。

| Check / 检查 | Observed result / 实际结果 |
| --- | --- |
| Preview file import / 预览版文件导入 | 1.0.0-beta.1 passed the native declarative package preview and installed one enabled Skill. / 原生导入预览通过声明式检查，安装并启用一个 Skill。 |
| Preview invocation / 预览版调用 | Task loaded `port-contract-audit` through the Skill mechanism, read its bundled reference, and wrote JSON and Markdown. Main verdict: `incompatible`; four mismatch groups and one unknown. / 任务实际加载技能及参考文件，生成两种报告，识别四类差异和一个未知项。 |
| Upgrade / 升级 | Imported 1.0.0 through the same native file flow; selected Update; details displayed v1.0.0 and both enable switches on. / 同一文件入口升级，详情显示 v1.0.0，插件与技能均启用。 |
| Window reload / 窗口重载 | Used View → Reload after upgrade, then created a fresh acceptance task. / 升级后重新加载窗口并创建新验收任务。 |
| Stable invocation / 正式版调用 | The fresh task loaded the installed Skill and reference, read three raw packets and generated six report files without reading expected reports. / 新任务加载已安装技能与参考文件，读取三个原始样例，生成六份报告，未读取预期报告。 |
| Main packet / 主样例 | `incompatible`: all four mismatch groups identified; stale invalid-config evidence remained unknown. / 四类差异均识别，过期日志对应项保留为未知。 |
| Scoped approval / 局部批准 | `intentional-delta`: debugLabel change approved; valid per-request traces with different interleaving accepted. / 仅批准 debugLabel 差异，合法的跨请求交错未被误报。 |
| Missing oracle / 缺少独立依据 | `unverified`: no invented old behavior; regenerated tests and unsupported performance claim did not prove parity. / 未补造旧行为，未把重生成测试或无依据性能声明当成兼容性证明。 |
| Uninstall/reinstall / 卸载重装 | Removed only this plugin; it disappeared from installed extensions. Reimported the identical stable package; v1.0.0 and both enable switches were present. / 仅卸载本项目并确认消失，再导入同一稳定包，版本与启用状态正常。 |
| Export preservation / 产物保留 | All eight beta/stable project report files retained identical SHA-256 values after uninstall and reinstall. / 八份预览版及正式版项目报告在卸载重装后哈希保持一致。 |

## Actual outputs / 实际产物

| Input / 输入 | Actual JSON / 实际 JSON | Actual Markdown / 实际 Markdown |
| --- | --- | --- |
| Main / 主样例 | [main.json](../examples/desktop/main.json) | [main.md](../examples/desktop/main.md) |
| Approved / 已批准变更 | [approved.json](../examples/desktop/approved.json) | [approved.md](../examples/desktop/approved.md) |
| Missing oracle / 缺少依据 | [unknown.json](../examples/desktop/unknown.json) | [unknown.md](../examples/desktop/unknown.md) |

These are the installed stable Skill's actual model-generated files. JSON contents are unchanged. Markdown replaces the personal absolute project prefix with `<project>/`; no findings were rewritten. Raw fixture copies were named `port-port-packet.md`, `port-approved-change.md` and `port-missing-oracle.md` in the acceptance workspace. Their contents match the corresponding repository examples. All three JSON reports passed the validator and their substantive conclusions were manually checked.

这些文件由正式安装后的技能实际调用生成，JSON 内容未改动。Markdown 只把个人绝对项目路径替换为 `<project>/`，没有重写结论。验收工作区的原始样例文件名分别为 `port-port-packet.md`、`port-approved-change.md` 和 `port-missing-oracle.md`，内容与仓库对应样例一致。三份 JSON 均通过校验，并人工复核了实质判断。

## Issues resolved before acceptance / 验收前修复

The upstream strict manifest parser rejected an uppercase publisher ID and a top-level compatibility field. The accepted packages use lowercase `sevaschan`, stable update ID `sevaschan/port-contract-audit`, and compatibility under `package`. No invalid build was installed or published.

上游严格清单解析器拒绝了大写发布者标识和放在顶层的兼容性字段。实际验收包使用小写 `sevaschan`、稳定更新标识 `sevaschan/port-contract-audit`，兼容性声明放在 `package` 中；无效构建未被安装或发布。

A missing CLI report argument initially produced two errors and the wrong exit code. A failing regression check reproduced it; the fixed validator prints one actionable error and exits 2. The complete 19-check suite passed afterward.

校验器曾在缺少报告参数时输出两条错误并返回错误退出码；先用失败检查复现，再修复为一条可操作提示并返回 2，随后全部 19 项检查通过。

## Tested scope / 实测范围

Manifest schemaVersion 2 validation and Skill frontmatter validation passed. Reports were checked both structurally and for their evidence-based conclusions. Window reload refers to the observed reload operation, not a full application process restart. Other host versions, operating systems, engines, model configurations and real migrations remain untested. The manifest pins the observed host version; it is not an official certification.

清单 schemaVersion 2 与技能 frontmatter 校验通过；报告同时核对结构和有证据支持的结论。窗口重载不等于完整进程重启。其他宿主版本、系统、引擎、模型配置和真实迁移未验证，清单按实测宿主版本声明兼容，不代表官方认证。
