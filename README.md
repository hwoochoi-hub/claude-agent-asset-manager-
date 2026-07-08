# 나의 자산관리 웹앱

Claude로 만든 개인용 자산관리 웹앱입니다. 내 자산/부채 현황을 한눈에 점검하고,
관심 있는 투자 자산에 대해 AI 정성 분석을 받아볼 수 있습니다.

## 주요 기능

- **대시보드**: 총자산 / 총부채 / 순자산 요약, 카테고리별 자산 배분 도넛 차트
- **자산 관리**: 현금·예금·주식·펀드·부동산·암호화폐·부채 등 항목 추가/삭제
- **투자 분석**: 관심 종목/자산을 입력하면 Claude API가 강점·리스크·체크포인트·결론 형태로 정성 분석 제공 (분석 히스토리 저장)

데이터(자산/부채, 분석 히스토리)는 서버가 아니라 **브라우저 로컬 저장소(localStorage)** 에만 저장됩니다.
브라우저/기기를 바꾸면 데이터가 유지되지 않으니 참고하세요.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 입력 (투자 분석 기능에 필요)
npm run dev
```

`http://localhost:3000` 접속. `ANTHROPIC_API_KEY`는 [console.anthropic.com](https://console.anthropic.com)에서 발급받을 수 있습니다.
API 키가 없어도 대시보드/자산 관리 기능은 정상 동작하며, 투자 분석 요청 시에만 키가 필요합니다.

## 배포 (Vercel)

1. 이 저장소를 [Vercel](https://vercel.com)에 Import (Framework Preset: Next.js가 자동 인식됩니다)
2. 프로젝트 Settings → Environment Variables에 `ANTHROPIC_API_KEY` 추가
3. Deploy

배포 후에도 자산 데이터는 각 방문자의 브라우저에만 저장되므로, 로그인 없는 개인용 페이지로 그대로 사용할 수 있습니다.
(나만 접근하게 하려면 Vercel의 Password Protection/Deployment Protection 기능을 함께 켜는 것을 권장합니다.)

## 기술 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Claude API (`claude-sonnet-5`) — 투자 분석 생성

## 주의사항

투자 분석 결과는 참고용 정성 분석이며 실시간 시세·최신 공시를 반영하지 못할 수 있습니다.
투자 조언이 아니며 최종 투자 판단과 책임은 본인에게 있습니다.
