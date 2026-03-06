현재 문서 상태를 읽고 다음 command를 결정해라.

입력:
- doc/context.md
- doc/workflow.md
- doc/proposal.md
- doc/tasks.md

출력:
NEXT_COMMAND: <command>
REASON: <reason>
CURRENT_STATE: <state>

우선순위:
1) context.workflow_state
2) proposal 상태
3) tasks 상태

매핑:
- DRAFT -> kickoff
- PROPOSED -> propose
- APPROVED -> approve
- TASKS_READY -> implement
- IMPLEMENTED -> review
- REVIEWED -> qa
- QA_VERIFIED -> update-context

CONTEXT_UPDATED:
- next_command_candidate=NONE -> NEXT_COMMAND: WAIT
  REASON: context updated and no next candidate
  CURRENT_STATE: CONTEXT_UPDATED
- next_command_candidate!=NONE -> NEXT_COMMAND: <next_command_candidate>
  REASON: context updated with queued next candidate
  CURRENT_STATE: CONTEXT_UPDATED

UNVERIFIED:
- next_command_candidate 필드 누락
- 필드 파싱 실패
- 상태 문서 충돌
