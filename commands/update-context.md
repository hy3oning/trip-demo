doc/context.md를 최신화해라.

필수 반영:
- workflow_state
- last_command
- next_command_candidate
- resume_steps

규칙:
- next_command_candidate=NONE이면 정상 대기 상태
- 종료로 단정하지 말 것
