doc/brief.md 기준으로 doc/proposal.md를 작성해라.

수행:
1) 문제 정의
2) 변경 제안
3) 테스트 계획
4) 승인 게이트 상태 확인(PENDING 유지)

완료 시 context 갱신:
- workflow_state=PROPOSED
- last_command=propose
- next_command_candidate=approve
