# 워크플로우 (Advanced)

## 상태 단일 소스
- `doc/context.md`의 `Resume Pointer.workflow_state`

## 상태 매핑
- DRAFT -> kickoff
- PROPOSED -> propose
- APPROVED -> approve
- TASKS_READY -> implement
- IMPLEMENTED -> review
- REVIEWED -> qa
- QA_VERIFIED -> update-context

## CONTEXT_UPDATED
- 루프 경계/대기 상태
- next_command_candidate=NONE -> 대기(WAIT)
