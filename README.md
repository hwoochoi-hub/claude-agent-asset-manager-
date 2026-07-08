# Claude 자산관리 에이전트

이 저장소는 Claude Desktop / Claude Code의 맞춤형 에이전트(자산관리)용입니다.

## 연결된 서비스
- GitHub
- Gmail  
- Notion

## 사용 방법 1: 언제든 원하는 자산 분석 (권장)

Claude Desktop에서 "레포 선택..." → 이 저장소 선택 후, 대화창에 아래처럼 입력하면 됩니다.

```
/analyze-asset 비트코인
/analyze-asset 삼성전자(005930)
/analyze-asset 테슬라(TSLA) + 엔비디아(NVDA) 포트폴리오
```

`/analyze-asset` 슬래시 커맨드(`.claude/commands/analyze-asset.md`)가 리서치 → 기술적 분석 → 보고서 →
총괄 검증(CoT·ToT·RAG·Self-Refine) 4단계 파이프라인을 실행하고, 웹 검색으로 실제 최신 데이터를 확인해
최종 보고서를 만들어 줍니다. 자산명만 바꿔서 몇 번이든 다시 호출할 수 있습니다.

## 사용 방법 2: claude.ai Artifact로 시각화된 UI 사용

`artifacts/asset_management_agents.jsx`는 claude.ai(웹/데스크탑) 대화창의 "Artifact" 기능 전용 React
컴포넌트입니다. claude.ai 대화에 이 코드를 붙여넣거나 아티팩트를 요청하면, 입력창 + 프리셋 버튼 + 진행
단계 UI가 있는 화면이 뜨고 그 안에서 자산을 바꿔가며 반복 실행할 수 있습니다. (이 파일 안의
`fetch("https://api.anthropic.com/...")` 호출은 claude.ai 대화창 밖에서는 인증되지 않아 동작하지 않습니다.)
