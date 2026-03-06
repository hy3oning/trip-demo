승인된 tasks 범위만 구현해라.

수행:
1) tasks 상태를 IN_PROGRESS 또는 DONE으로 갱신
2) 최소 Evidence 반영
3) review/qa 관점 검증 포인트 기록

완료 시 context 갱신:
- workflow_state=IMPLEMENTED
- last_command=implement
- next_command_candidate=update-context
