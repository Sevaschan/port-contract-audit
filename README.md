# Port Contract Audit

[简体中文](README.zh-CN.md) · [Install / releases](https://github.com/Sevaschan/port-contract-audit/releases) · MIT

Review what changed when software moves between languages or runtimes. Port Contract Audit is a reusable AI Skill that compares supplied contracts and observations, separates approved changes from regressions, and produces a traceable JSON report with a readable Markdown companion.

Built for [iPolloWork](https://github.com/Devin-AXIS/iPolloWork). The `.ipollowork-plugin` package installs one Skill, including its report-format reference. It contains no MCP server, application UI, background service, or executable hook. The standalone Skill ZIP is also available.

## What you can review

- **Serialization:** absent fields versus `null`, zero, false, defaults, error envelopes and successful empty values.
- **Collections:** meaningful ordering and duplicates that sorting or deduplication can hide.
- **Lifecycle traces:** request/call identity, result completion and cancellation, using the supplied protocol contract rather than assuming a global event order.
- **Evidence quality:** stale snapshots, candidate-generated expectations and normalizers that erase the behavior being tested.
- **Intentional changes:** explicit approval tied to the exact field, behavior and candidate version it covers.

Use it during an AI-assisted TypeScript-to-Rust port, an SDK rewrite, or a runtime replacement. It is useful before accepting a green rewritten test suite as evidence of compatibility. It does not connect to GitHub Copilot or require a Rust or TypeScript toolchain.

## Input and output

Provide a short migration packet with the baseline and candidate identifiers, independent old contracts or fixtures, observations from each version, relevant test details, and any explicit approvals. Name the surfaces to review and what is excluded. Source fragments and log excerpts should include their provenance and snapshot.

The Skill writes:

| File | Purpose |
| --- | --- |
| `port-contract-report.json` | Evidence IDs, per-surface checks, oracle risks, proposed next tests and a scoped verdict |
| `port-contract-report.md` | Human-readable findings, supporting evidence, missing information and next steps |

Checks are `match`, `mismatch`, `unknown`, or `approved-change`. The report verdict is `incompatible`, `unverified`, `intentional-delta`, or `consistent-with-reviewed-evidence`. These describe the reviewed evidence only; none certifies whole-system equivalence or authorizes a release.

## Install and use in iPolloWork

1. Download `port-contract-audit-1.0.0.ipollowork-plugin` from [Releases](https://github.com/Sevaschan/port-contract-audit/releases). Optionally verify it against `SHA256SUMS.txt` with `shasum -a 256 -c SHA256SUMS.txt` in the download folder after downloading all three archives.
2. Open iPolloWork → **Extensions / 扩展** → **Add / 添加** → **Choose file / 选择文件**. Select the package, review the one-Skill preview, and install it. Keep the plugin and Skill enabled.
3. Open a task in a local project containing your migration packet. Reload the window if the newly installed Skill is not available in an existing task, then start a new task.
4. Ask explicitly for the Skill and its bundled reference:

   > Use the installed `port-contract-audit` Skill and read its `references/report-format.md`. Review `migration-packet.md` using only the supplied evidence. Write `port-contract-report.json` and `port-contract-report.md` in this project. Do not execute tests or modify source code.

5. Check that the task loads the named Skill and reads the reference. Open both generated files in the project's output/files panel or local folder. Copy them to your review or attach them to a pull request.
6. For updates, import the newer package through the same file flow and choose **Update / 更新**. Keep the publisher and package identity unchanged. Reload before using updated instructions.

The host supplies the model and file tools; it may require a configured model account and network access. This package adds no tools or credentials. Only ask the host to run commands when you intend actual execution. The default workflow reviews supplied evidence without running example tests.

For local Skill import, extract `port-contract-audit-1.0.0-skill.zip` and select the **`port-contract-audit` folder directly containing `SKILL.md`**, including its `references` subfolder, in iPolloWork's local Skill import. File-package installation is the tested distribution route. A raw GitHub URL is not a substitute for this package installation flow.

## Try the supplied examples

Place [examples/port-packet.md](examples/port-packet.md) in your iPollo project and use the prompt above with that filename. This synthetic packet includes:

| Supplied observation | Expected interpretation |
| --- | --- |
| An omitted timeout becomes `null` instead of inheriting 1200 ms | Behavior mismatch |
| A cancelled tool call has no result before request completion | Lifecycle mismatch |
| `oak, pine, oak` becomes `pine, oak` | Ordering and duplicate preservation mismatch |
| `NOT_FOUND` becomes a successful null value | Error contract mismatch |
| An invalid-config log is from an older candidate and lacks an old contract | Unknown; request current, independent evidence |

The expected verdict is `incompatible`. [expected-report.json](examples/expected-report.json) is an authored format example, not an iPollo execution transcript. Check grouping and wording can vary: order and multiplicity may be separate checks while expressing the same finding.

Two smaller packets exercise boundaries: [approved-change.md](examples/approved-change.md) expects `intentional-delta` for one narrowly approved serialization change while accepting valid cross-request interleaving; [missing-oracle.md](examples/missing-oracle.md) expects `unverified` when no independent old behavior is supplied.

## Report validation and development

The Skill itself needs no Node.js installation. Repository development utilities use Node.js 22+ and the system `zip` command, with no npm dependencies:

```sh
npm test
npm run package
node scripts/validate-report.mjs --report examples/expected-report.json
node scripts/validate-report.mjs --report /path/to/port-contract-report.json --json
```

The validator checks schema, evidence links, snapshot requirements and verdict consistency. It cannot establish the truth of evidence, the semantic adequacy of a contract, or whether approval really covers a change. Exit codes: `0` valid, `1` invalid report, `2` invalid arguments. Use `--report -` to read JSON from stdin and `--help` for usage.

Packaging uses fresh staging, stable file metadata and a complete Skill folder. The install archive contains only the manifest, `SKILL.md` and its reference. The source archive contains the repository sources; it is for development, not direct installation. See [report format](skills/port-contract-audit/references/report-format.md), [validation notes](docs/validation.md), and [desktop acceptance](docs/desktop-acceptance.md).

## Scope and limitations

Outputs depend on the host model and the quality of supplied evidence. The Skill does not reconstruct absent logs, infer approval from language conventions, treat speed improvements as correctness evidence, automatically repair code, or run a migration. A passing structure validator is not an independent review of the model's conclusions. Inspect citations, snapshot identities and approval scope before using the report in a decision.

Report reproducible issues with a redacted packet, package version and expected versus actual behavior in [Issues](https://github.com/Sevaschan/port-contract-audit/issues). Do not include credentials or private production data.
