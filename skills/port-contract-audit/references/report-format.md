# Report contract

Produce JSON plus a Markdown rendering of the same decisions. Use schemaVersion 1 and kind port-contract-audit. All listed fields are required. Do not add fields; put explanations in the existing text fields. Strings must be nonempty except where null is explicitly allowed.

## Root fields

- scope: baseline (snapshot or contract revision string, or null if unavailable), candidate (current snapshot string), surfaces (nonempty string array), excluded (string array).
- execution: mode (analysis-only or executed-in-task), commands (array of commands actually executed in this task). For analysis-only commands must be empty. Supplied logs and proposed commands do not belong here. executed-in-task requires at least one actual command.
- evidence: array of evidence objects described below.
- checks: nonempty array of observable behavior checks.
- oracleRisks: array of comparison weaknesses.
- nextTests: array of proposed follow-up checks.
- verdict: status and reason.

A baseline can identify a stable specification rather than runnable old code. When it is unavailable, do not manufacture a snapshot name. Preserve candidate identity even when its observations are missing.

## Evidence objects

Each has id, kind, source, snapshot, summary.

- id: unique short stable identifier.
- kind: contract, baseline-observation, candidate-observation, test-report, approval, performance or comment.
- source: exact file/section, supplied packet item or URL identifying the material; never invent line numbers.
- snapshot: exact relevant revision string or null if not established/applicable. Do not relabel an old candidate log to the reviewed candidate.
- summary: what the item establishes, including relevant conditions or gaps.

Preserve input evidence IDs where practical. A typed approval still requires human review of its scope; a comment about idiomatic code is not an approval. A performance result is not compatibility evidence.

## Checks

Each has id, surface, contract, baseline, candidate, status, evidenceIds, approvalIds.

- id is unique among checks; surface names the boundary.
- contract states the observable requirement, or clearly describes what is missing.
- baseline and candidate summarize observations/behavior; each may be null only for unknown checks.
- status: match, mismatch, unknown, approved-change.
- evidenceIds references nonempty evidence IDs supporting the reasoning.
- approvalIds is empty except for approved-change; then it contains at least one ID of kind approval.

match, mismatch and approved-change require a known baseline identifier, a relevant independent oracle (contract at the baseline revision or with snapshot null, or baseline-observation at that revision), and candidate-observation at scope.candidate. A code-only suspicion or candidate-only suite pass stays unknown until enough behavioral evidence is available. Describe the suspected issue and the next discriminating test.

An approved-change needs both the observed difference and a scoped approval. Do not hide it as match. Approval links alone do not prove that the approval applies to this check.

## Oracle risks

Each has id, evidenceIds (nonempty known IDs), reason. Examples include a comparator that removes meaningful duplicates or regenerates expected values from the candidate.

A known mismatch remains a mismatch even when the test harness is unsound. Risk-free claims should not silently drop supplied evidence of a bad comparator.

## Next tests

Each has id, checkIds (nonempty known check IDs), action, command, expected.

command is a known reproducible command string or null when the repository configuration does not establish one. These are proposals, not execution evidence. expected describes the behavior and oracle, not just “tests pass”. Use execution.commands only for checks actually run.

## Verdict precedence

1. Any mismatch → incompatible.
2. Otherwise any unknown or any oracleRisk → unverified.
3. Otherwise any approved-change → intentional-delta.
4. Otherwise → consistent-with-reviewed-evidence.

reason explains the scoped conclusion. None of these statuses grants permission to release. Do not turn consistent-with-reviewed-evidence into “the migration is proven equivalent”.

## Markdown

Include reviewed snapshots/surfaces, a compact per-check comparison with evidence IDs and status, the actual execution mode, oracle risks, scoped approvals, next tests and exclusions. Keep performance claims bounded and separate. Match the user's preferred language; identifiers and JSON enum values stay as defined.

## Example interpretation

If timeout omission used to inherit 1200 ms but the candidate disables it, record mismatch when the same fixture and independent contract establish that distinction. An approval to emit a diagnostic debugLabel as null does not apply to timeout.

If only candidate snapshots and a passing rewritten suite exist, record unknown and unverified. Ask for a baseline contract or captured old output rather than endorsing compatibility.
