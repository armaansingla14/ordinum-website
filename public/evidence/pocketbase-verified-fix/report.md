# Ordinum verify: FIX_VERIFIED

**every confirmed violation FIXED on the declared fixed build, and no violation found in the fixed build's own campaign** (exit 0)

- configured build {"realtime": true, "steps": 40, "variant": "pc_stale_read_cache"}: 2 confirmed violation(s)
- fixed build {"variant": "safe"}: FIXED for these case(s) and no violation found in its own campaign of 100 executions

> **NOTE** exercise is adapter-declared (the target's exercise hook): a count is only as good as that declaration

## What was tested

| | |
|---|---|
| target | `ordinum.targets.pocketbase.target:PocketBaseTarget` build `pocketbase@0.40.6:sha256:a632f8779884c9335c3c2716:pc_stale_read_cache`, config hash `cfg_38da749fbf64` |
| target params | `{"realtime": true, "steps": 40, "variant": "pc_stale_read_cache"}` |
| config | `<repo>/examples/pocketbase/ordinum.pc.toml` |
| properties | read_authz, write_authz, stale_token_rejected, ack_consistency, realtime_authz, restart_durability, model_agreement, no_lost_update |
| not checked | no_lost_update_docs, no_lost_update_users, no_lost_update_rules, rules_enforced_as_stored, no_refused_write_applied, write_authz_under_rule_change |
| faults | role_change, member_change, rule_change, revoke, restart, concurrent (up to 6 per scenario) |
| scope | arm feedback_full, campaign seed 1, budget 100 executions (ran 100 in 97.165 s), up to 6 fault(s) per scenario from ['role_change', 'member_change', 'rule_change', 'revoke', 'restart', 'concurrent'], oracle v1, stochastic target (seed semantics nondeterministic) |
| inconclusive allowed | none (per property) |
| fixed build | {"variant": "safe"} |
| exercise required | read_authz, model_agreement (--require-exercise) |

## Campaign (configured build)

- 100 executions (FAIL 100); INFRA_ERROR 0; 0 execution(s) inconclusive for a tested property
- read_authz violated in 6 of 100 judged executions out of 100 (0 inconclusive)
- no violation of write_authz in 100 judged executions out of 100 (0 inconclusive)
- no violation of stale_token_rejected in 100 judged executions out of 100 (0 inconclusive)
- no violation of ack_consistency in 100 judged executions out of 100 (0 inconclusive)
- no violation of realtime_authz in 100 judged executions out of 100 (0 inconclusive)
- no violation of restart_durability in 100 judged executions out of 100 (0 inconclusive)
- model_agreement violated in 100 of 100 judged executions out of 100 (0 inconclusive)
- no violation of no_lost_update in 100 judged executions out of 100 (0 inconclusive)
- classes found: model_agreement, read_authz; confirmed (minimize + fixed-input replay): model_agreement, read_authz

## Campaign (fixed build, same arm / budget / seed)

- 100 executions (PASS 100); INFRA_ERROR 0; 0 execution(s) inconclusive for a tested property
- no violation of read_authz in 100 judged executions out of 100 (0 inconclusive)
- no violation of write_authz in 100 judged executions out of 100 (0 inconclusive)
- no violation of stale_token_rejected in 100 judged executions out of 100 (0 inconclusive)
- no violation of ack_consistency in 100 judged executions out of 100 (0 inconclusive)
- no violation of realtime_authz in 100 judged executions out of 100 (0 inconclusive)
- no violation of restart_durability in 100 judged executions out of 100 (0 inconclusive)
- no violation of model_agreement in 100 judged executions out of 100 (0 inconclusive)
- no violation of no_lost_update in 100 judged executions out of 100 (0 inconclusive)
- classes found: none; confirmed: none

## Evidence

- EvidenceContract: declared (completion: {"event": "harness:end", "statuses": ["DONE"], "summary": {}})
- scope: completeness and audit_trace evaluated on the witness trace(s) only; campaign executions are judged per property by the trusted interpreter

## Per property

'exercised E/N (C with complete evidence)': of N executions, E exercised the property (its precondition occurred, as the target's exercise hook declares: adapter-declared), C of them with complete evidence; 'evidence c/i/u': executions with complete / incomplete / unavailable evidence for it. 'Complete' means a conclusive judgement by the trusted interpreter; it is backed by the target's EvidenceContract only where a property says 'completeness = EvidenceContract-backed'.

| property | outcome | reachability | evidence (complete/incomplete/unavailable) | findings | artifacts |
|---|---|---|---|---|---|
| `read_authz` (exercise required) | **FIX_VERIFIED**: affected build violated it; the fixed build passed the comparison and its own campaign, and exercised it | configured: exercised 100/100 (100 with complete evidence)<br>fixed: exercised 100/100 (100 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | fail_a862e75a4fbb | fail_a862e75a4fbb (configured build, FIXED); witness trace data/runs/run_b22f36dfbfcd.jsonl; minimized 1 -> 1 fault(s); case <repo>/data/campaigns/m14_pocketbase_pc/cases/fail_a862e75a4fbb.json |
| `write_authz` | **EXERCISED_PASS**: no violation in executions that exercised it with complete evidence | configured: exercised 100/100 (100 with complete evidence)<br>fixed: exercised 100/100 (100 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | - | - |
| `stale_token_rejected` | **EXERCISED_PASS**: no violation in executions that exercised it with complete evidence | configured: exercised 26/100 (26 with complete evidence)<br>fixed: exercised 26/100 (26 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | - | - |
| `ack_consistency` | **EXERCISED_PASS**: no violation in executions that exercised it with complete evidence | configured: exercised 100/100 (100 with complete evidence)<br>fixed: exercised 100/100 (100 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | - | - |
| `realtime_authz` | **EXERCISED_PASS**: no violation in executions that exercised it with complete evidence | configured: exercised 100/100 (100 with complete evidence)<br>fixed: exercised 100/100 (100 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | - | - |
| `restart_durability` | **EXERCISED_PASS**: no violation in executions that exercised it with complete evidence | configured: exercised 22/100 (22 with complete evidence)<br>fixed: exercised 22/100 (22 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | - | - |
| `model_agreement` (exercise required) | **FIX_VERIFIED**: affected build violated it; the fixed build passed the comparison and its own campaign, and exercised it | configured: exercised 100/100 (100 with complete evidence)<br>fixed: exercised 100/100 (100 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | fail_76e6d79bb741 | fail_76e6d79bb741 (configured build, FIXED); witness trace data/runs/run_cab843784bd7.jsonl; minimized 0 -> 0 fault(s); case <repo>/data/campaigns/m14_pocketbase_pc/cases/fail_76e6d79bb741.json |
| `no_lost_update` | **EXERCISED_PASS**: no violation in executions that exercised it with complete evidence | configured: exercised 1/100 (1 with complete evidence)<br>fixed: exercised 1/100 (1 with complete evidence) | configured: 100/0/0<br>fixed: 100/0/0<br>(completeness = EvidenceContract-backed (require_complete or strict evidence)) | - | - |

Outcomes: `EXERCISED_PASS` exercised and passed with complete evidence; `NOT_EXERCISED` never exercised: a pass is vacuous; `INCOMPLETE_EVIDENCE` inconclusive (UNRESOLVED / incomplete evidence, or not confirmed); `CONFIRMED_VIOLATION` confirmed violation; `FIX_VERIFIED` affected build fails, fixed build passes and exercises it, and the run's verdict is FIX_VERIFIED; `FIXED_UNVERIFIED` the comparison says FIXED and the fixed build exercised it, but the run's verdict is not FIX_VERIFIED: the fix is not verified, no fix-verification case written (the open-bug case gates the bug); `EXERCISE_UNKNOWN` passed; exercise unknown (no exercise declared).

## Result

### Finding 1: `fail_76e6d79bb741`

| | |
|---|---|
| build | configured {"realtime": true, "steps": 40, "variant": "pc_stale_read_cache"} |
| property | model_agreement [low]: An operation the stored rule allows is not refused (over-restriction; low severity: usually a reference-model gap, not a security defect). |
| observed | list by ucarol000000000 omitted allowed ['dnew00000000020', 'dnew00000000024'] (status 200) (onset t=25) |
| scenario | 0 fault(s), base_seed 1, exec_seed 1: no faults |
| components | violation established by db:state, harness:req (EvidenceContract) |
| evidence | truth (harness-recorded, not the system's own reports) [witness trace only]: 114 truth events, trace status DONE; completeness COMPLETE; audit_trace 0 finding(s); outcome counts admin_refused:a_member=2, pc_cache_hit=5, reach:read=14, reach:rt_event_judged=19, reach:write_allowed=8, reach:write_forbidden=10 |
| reproduction | CONFIRMED 5/5 (repeated trials of the same scenario (stochastic)) |
| minimized | 0 -> 0 fault(s), 1-minimal verified (3 executions) |
| affected/fixed | FIXED: affected {"variant": "pc_stale_read_cache"} 10/10 violated (0 inconclusive), fixed {"variant": "safe"} 0/10 (0 inconclusive) over 10 shared seeds, one-sided Fisher p=5.41e-06 |
| regression case | <repo>/data/campaigns/m14_pocketbase_pc/cases/fail_76e6d79bb741.json (fix verification: CI re-runs the affected and the fixed build; PASS while the fix holds) |
| status | FIXED on the declared fixed build |

### Finding 2: `fail_a862e75a4fbb`

| | |
|---|---|
| build | configured {"realtime": true, "steps": 40, "variant": "pc_stale_read_cache"} |
| property | read_authz [critical]: A list/view response with a valid token contains only records the stored list/view rule allows that user to see in the committed state. |
| observed | list by ualice000000000 (valid token) returned ['dinit0000000002', 'dnew00000000004'], not allowed by the stored listRule (onset t=26) |
| scenario | 1 fault(s), base_seed 1, exec_seed 290706733: t=12 rule_change@policy(which=1) |
| components | faults on policy; violation established by db:state, harness:req (EvidenceContract) |
| evidence | truth (harness-recorded, not the system's own reports) [witness trace only]: 112 truth events, trace status DONE; completeness COMPLETE; audit_trace 0 finding(s); outcome counts admin_refused:a_member=2, pc_cache_hit=5, reach:read=14, reach:rt_event_judged=13, reach:write_allowed=8, reach:write_forbidden=10 |
| reproduction | CONFIRMED 5/5 (repeated trials of the same scenario (stochastic)) |
| minimized | 1 -> 1 fault(s), 1-minimal verified (11 executions) |
| affected/fixed | FIXED: affected {"variant": "pc_stale_read_cache"} 10/10 violated (0 inconclusive), fixed {"variant": "safe"} 0/10 (0 inconclusive) over 10 shared seeds, one-sided Fisher p=5.41e-06 |
| regression case | <repo>/data/campaigns/m14_pocketbase_pc/cases/fail_a862e75a4fbb.json (fix verification: CI re-runs the affected and the fixed build; PASS while the fix holds) |
| status | FIXED on the declared fixed build |


## Regression cases

- `<repo>/data/campaigns/m14_pocketbase_pc/cases/fail_76e6d79bb741.json`
- `<repo>/data/campaigns/m14_pocketbase_pc/cases/fail_a862e75a4fbb.json`

commit the case(s) and gate CI on them: ordinum --target-config <repo>/examples/pocketbase/ordinum.pc.toml ci
