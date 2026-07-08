import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ANTHROPIC_MODEL = "claude-sonnet-5";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY가 설정되어 있지 않습니다. .env.local 또는 배포 환경 변수에 키를 추가해주세요.",
      },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const target = typeof body?.target === "string" ? body.target.trim() : "";
  const note = typeof body?.note === "string" ? body.note.trim() : "";
  const portfolioContext =
    typeof body?.portfolioContext === "string" ? body.portfolioContext.trim() : "";

  if (!target) {
    return NextResponse.json({ error: "분석할 자산/종목명을 입력해주세요." }, { status: 400 });
  }

  const userPrompt = [
    `분석 대상: ${target}`,
    note && `추가 메모/궁금한 점: ${note}`,
    portfolioContext && `참고용 현재 내 포트폴리오 요약:\n${portfolioContext}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemPrompt = `당신은 신중하고 균형 잡힌 개인 투자 리서치 어시스턴트입니다.
사용자가 투자를 고려 중인 자산(주식/ETF/암호화폐/부동산 등)에 대해 정성적 분석을 한국어로 제공합니다.
반드시 아래 형식의 마크다운으로 답하세요:

## 개요
(이 자산이 무엇인지, 어떤 섹터/카테고리인지 2~3문장 요약)

## 강점
- 항목별로 3~5개 bullet

## 리스크 요인
- 항목별로 3~5개 bullet

## 점검 체크포인트
- 투자 전 사용자가 스스로 확인해야 할 지표나 질문 3~5개 (예: 밸류에이션 지표, 재무 상태, 시장 변동성 등)

## 결론
(중립적 요약 2~3문장. 매수/매도를 단정적으로 권유하지 말 것)

---
⚠️ 본 분석은 학습된 지식을 기반으로 한 참고용 정성 분석이며, 실시간 시세·최신 공시를 반영하지 못할 수 있습니다. 투자 조언이 아니며 최종 투자 판단과 책임은 본인에게 있습니다.

사용자가 현재 포트폴리오 맥락을 제공한 경우, 그 포트폴리오와의 상관관계나 집중도 리스크도 함께 짚어주세요.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Claude API 호출 실패 (${res.status}): ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text ?? "";
    if (!text) {
      return NextResponse.json({ error: "분석 결과를 받아오지 못했습니다." }, { status: 502 });
    }

    return NextResponse.json({ result: text });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
