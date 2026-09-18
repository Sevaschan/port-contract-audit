# Scoped approved change

Synthetic adapter baseline a17; candidate b28. Analysis only; no commands, websites, source edits or publication.

C1 api-contract@a17: omitted diagnostic debugLabel is omitted from JSON. C2: emitted request/call pairs each have one result before that request's done; cross-request interleaving is not specified.
A1 approved ticket UX-42 explicitly changes only absent debugLabel to serialized null in b28.
O1 baseline a17, fixture absent-debug: response {}.
N1 candidate b28, same fixture: {"debugLabel":null}.
O2 baseline a17, two-request fixture: r1/c1 call; r2/c2 call; r1/c1 result; r1 done; r2/c2 result; r2 done.
N2 candidate b28, same fixture: r2/c2 call; r1/c1 call; r2/c2 result; r2 done; r1/c1 result; r1 done.
No test-oracle changes or performance results are claimed. Every captured event is listed above. Scope is only debugLabel and these per-request traces. Exclude other JSON fields, timeouts, memory/FFI, persistent data and unobserved platforms.

Review compatibility for this explicitly changed scope and propose follow-up checks. The approved change must remain visible in the report rather than being called an exact match.
