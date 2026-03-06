proposal 승인 후 실행한다.

수행:
1) doc/proposal.md 상태를 APPROVED로 반영
2) doc/tasks.md에 승인 범위 작업 확정
3) tasks 상태를 READY로 반영

완료 시 context 갱신:
- workflow_state=TASKS_READY
- last_command=approve
- next_command_candidate=implement

구현 금지.
