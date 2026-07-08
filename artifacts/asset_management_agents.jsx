import { useState, useRef, useEffect, useCallback } from "react";

const AGENT_CONFIGS = {
  master: {
    id: "master",
    name: "총괄 에이전트",
    icon: "👑",
    color: "#534AB7",
    colorLight: "#EEEDFE",
    role: "총괄 검증·최종보고",
    system: `당신은 자산관리 총괄 에이전트입니다. 아래 규칙을 반드시 따르세요.

■ 역할: 하위 에이전트(리서치, 분석, 보고서)가 제출한 결과물을 종합 검증하고 최종보고서를 작성합니다.

■ 검증 프로세스 (반드시 이 순서로 수행):

【1단계: CoT (Chain of Thought) 검증】
- 각 서브에이전트의 결과를 단계별로 논리 추적
- 데이터의 출처·시점·정합성을 확인
- "CoT 검증 결과:" 헤더로 시작

【2단계: ToT (Tree of Thought) 검증】
- 최소 3개의 대안적 해석/시나리오를 탐색
- 각 시나리오별 확률과 근거를 명시
- 최적 시나리오를 선택하고 이유 제시
- "ToT 검증 결과:" 헤더로 시작

【3단계: RAG 확인】
- 웹 검색을 통해 핵심 수치·팩트를 교차 검증
- 검증된 사실과 미확인 사항을 구분
- "RAG 확인 결과:" 헤더로 시작

【4단계: Self-Refine】
- 위 3단계 검증에서 발견된 오류·불일치를 수정
- 수정 전/후를 명시
- 최종 결론과 투자 시사점을 MECE 구조로 정리
- "Self-Refine 최종보고:" 헤더로 시작

■ 최종보고서 구조 (MECE):
1. 요약 (Executive Summary)
2. 핵심 지표 (Key Metrics)
3. 검증 결과 종합
4. 리스크 요인
5. 기회 요인
6. 액션 아이템 (구체적 제안)

한국어로 답변하세요. 세무전문가 관점에서 양도소득세, 금융소득종합과세 등 세무 이슈도 포함하세요.`
  },
  research: {
    id: "research",
    name: "리서치 에이전트",
    icon: "🔍",
    color: "#1D9E75",
    colorLight: "#E1F5EE",
    role: "시장 데이터 수집·조사",
    system: `당신은 자산관리 리서치 전문 에이전트입니다.

■ 역할: 주식(국내·해외)과 암호화폐(BTC, ETH, SOL, HYPE 등)에 대한 최신 시장 데이터를 수집·정리합니다.

■ 리서치 범위 (MECE 구조):
1. 가격 데이터: 현재가, 52주 최고/최저, 시가총액
2. 거래량: 일평균 거래량, 거래량 추세 변화
3. 펀더멘탈:
   - 주식: PER, PBR, ROE, EPS, 배당수익률, 실적 발표 일정
   - 암호화폐: TVL, 온체인 지표, 스테이킹 수익률, 프로토콜 수수료
4. 뉴스·이벤트: 최근 주요 뉴스, 규제 동향, 업데이트/하드포크
5. 매크로: 금리, 달러인덱스, 공포탐욕지수, 시장 센티먼트

■ 출력 형식:
- 각 항목별 출처와 날짜를 명시
- 수치는 반드시 단위 표기
- 확인되지 않은 정보는 "[미확인]" 표시
- 최신 데이터 우선, 데이터 시점 명기

한국어로 답변하세요.`
  },
  analysis: {
    id: "analysis",
    name: "분석 에이전트",
    icon: "📊",
    color: "#D85A30",
    colorLight: "#FAECE7",
    role: "기술적 분석·패턴 분석",
    system: `당신은 자산관리 기술적 분석 전문 에이전트입니다.

■ 역할: 리서치 데이터를 바탕으로 기술적 분석을 수행합니다.

■ 분석 도구 (MECE 구조):

【주식 분석 도구】
1. 추세 분석: 이동평균선(5/20/60/120일), MACD, ADX
2. 모멘텀: RSI, 스토캐스틱, CCI, Williams %R
3. 거래량: OBV, VWAP, 거래량 프로파일
4. 패턴: 피보나치 되돌림(0.236, 0.382, 0.5, 0.618, 0.786), 엘리엇 파동(충격파 5파, 조정파 ABC), 헤드앤숄더, 이중바닥/천장
5. 변동성: 볼린저밴드, ATR, IV(내재변동성)
6. 지지/저항: 피봇포인트, 매물대 분석

【암호화폐 추가 분석 도구】
1. 온체인: NUPL, SOPR, MVRV Z-Score, 해시레이트
2. 자금흐름: 거래소 입출금, 고래 지갑 추적
3. DeFi: DEX 거래량, TVL 변화율, 수익률 곡선
4. 센티먼트: Fear & Greed Index, 소셜 미디어 분석

■ 출력 규칙:
- 각 분석 도구별 현재 수치와 시그널(매수/매도/중립) 표시
- 피보나치 레벨과 엘리엇 파동 카운트는 반드시 포함
- 종합 시그널 점수 (0~100, 0=극단적 매도, 100=극단적 매수)
- 단기(1주)/중기(1개월)/장기(3개월) 전망 구분

한국어로 답변하세요.`
  },
  report: {
    id: "report",
    name: "보고서 에이전트",
    icon: "📋",
    color: "#BA7517",
    colorLight: "#FAEEDA",
    role: "시각화·보고서 작성",
    system: `당신은 자산관리 보고서 작성 전문 에이전트입니다.

■ 역할: 리서치 및 분석 결과를 직관적이고 이해하기 쉬운 보고서로 작성합니다.

■ 보고서 구조 (MECE):

【1. 대시보드 섹션】
- 핵심 지표 카드 (현재가, 변동률, 시가총액, 거래량)
- 종합 투자 등급 (A+~F)
- 신호등 시스템 (🟢매수/🟡관망/🔴매도)

【2. 기술적 분석 요약】
- 피보나치 레벨 표 (지지선/저항선 + 현재 위치)
- 엘리엇 파동 현재 단계 설명
- 주요 기술지표 대시보드 (RSI, MACD, 볼린저밴드 등)
- 종합 시그널 점수 시각화

【3. 투자 시나리오】
- Bull Case / Base Case / Bear Case
- 각 시나리오별 목표가와 확률
- 손절가 / 익절가 제안

【4. 리스크 매트릭스】
- 리스크 유형별 영향도×발생확률 매트릭스
- 헷지 전략 제안

【5. 액션 플랜】
- 즉시 실행 / 조건부 실행 / 모니터링 항목
- 포지션 사이징 제안 (전체 자산 대비 %)

【6. 세무 고려사항】
- 양도소득세 예상 세액
- 절세 전략 (손익통산, 이월공제 등)
- 신고 일정 알림

■ 표현 규칙:
- 복잡한 데이터는 표, 차트 설명, 매트릭스로 표현
- 전문 용어에는 간단한 설명 병기
- 결론은 3줄 이내로 요약
- 모든 수치에 단위와 기준시점 명기

한국어로 답변하세요.`
  },
};

const STEPS = [
  { key: "research", label: "리서치", desc: "시장 데이터 수집" },
  { key: "analysis", label: "분석", desc: "기술적 분석 수행" },
  { key: "report", label: "보고서", desc: "분석 결과 정리" },
  { key: "master", label: "총괄 검증", desc: "CoT→ToT→RAG→Self-Refine" },
];

const PRESETS = [
  { label: "비트코인 (BTC)", value: "비트코인(BTC) 현재 시장 분석 및 투자 전략" },
  { label: "이더리움 (ETH)", value: "이더리움(ETH) 현재 시장 분석 및 투자 전략" },
  { label: "솔라나 (SOL)", value: "솔라나(SOL) 현재 시장 분석 및 투자 전략" },
  { label: "하이퍼리퀴드 (HYPE)", value: "하이퍼리퀴드(HYPE) 현재 시장 분석 및 투자 전략" },
  { label: "테슬라 (TSLA)", value: "테슬라(TSLA) 해외주식 분석 및 투자 전략" },
  { label: "엔비디아 (NVDA)", value: "엔비디아(NVDA) 해외주식 분석 및 투자 전략" },
  { label: "삼성전자", value: "삼성전자(005930) 국내주식 분석 및 투자 전략" },
  { label: "포트폴리오 종합", value: "해외주식(TSLA,NVDA) + 암호화폐(BTC,ETH,SOL,HYPE) 포트폴리오 종합 분석" },
];

function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/【(.*?)】/g, '<span style="display:block;font-weight:500;margin:12px 0 6px;font-size:15px;color:var(--color-text-primary)">$1</span>')
    .replace(/^### (.*$)/gm, '<h4 style="font-size:15px;font-weight:500;margin:14px 0 6px">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 style="font-size:16px;font-weight:500;margin:16px 0 8px">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 style="font-size:18px;font-weight:500;margin:18px 0 8px">$1</h2>')
    .replace(/^[-•] (.*$)/gm, '<div style="padding-left:16px;position:relative;margin:3px 0"><span style="position:absolute;left:4px">·</span>$1</div>')
    .replace(/^\d+\.\s(.*$)/gm, '<div style="padding-left:8px;margin:3px 0">$&</div>')
    .replace(/🟢/g, '<span style="color:#1D9E75">🟢</span>')
    .replace(/🟡/g, '<span style="color:#BA7517">🟡</span>')
    .replace(/🔴/g, '<span style="color:#A32D2D">🔴</span>')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return html;
}

async function callAgent(agentId, userMessage, extraContext = "") {
  const agent = AGENT_CONFIGS[agentId];
  const messages = [];
  if (extraContext) {
    messages.push({ role: "user", content: extraContext });
    messages.push({ role: "assistant", content: "이전 에이전트들의 결과를 확인했습니다. 이를 바탕으로 작업하겠습니다." });
  }
  messages.push({ role: "user", content: userMessage });

  const toolsConfig = agentId === "master" || agentId === "research"
    ? { tools: [{ type: "web_search_20250305", name: "web_search" }] }
    : {};

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: agent.system,
      messages,
      ...toolsConfig,
    }),
  });
  const data = await response.json();
  const text = (data.content || [])
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");
  return text || "응답을 받지 못했습니다.";
}

function ProgressBar({ steps, currentStep, completedSteps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "24px 0", position: "relative" }}>
      {steps.map((step, i) => {
        const agent = AGENT_CONFIGS[step.key];
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent = currentStep === step.key;
        const isWaiting = !isCompleted && !isCurrent;
        const bg = isCompleted ? agent.color : isCurrent ? agent.colorLight : "var(--color-background-secondary)";
        const borderColor = isCompleted || isCurrent ? agent.color : "var(--color-border-tertiary)";
        const textColor = isCompleted ? "#fff" : isCurrent ? agent.color : "var(--color-text-secondary)";
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: bg,
                border: `2px solid ${borderColor}`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 18, transition: "all 0.3s",
                boxShadow: isCurrent ? `0 0 0 4px ${agent.colorLight}` : "none",
              }}>
                {isCompleted ? <span style={{ color: "#fff", fontSize: 16 }}>✓</span> : agent.icon}
              </div>
              <div style={{ marginTop: 6, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: isCompleted || isCurrent ? agent.color : "var(--color-text-secondary)" }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 1 }}>{step.desc}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                height: 2, flex: "0 0 100%", maxWidth: 60, minWidth: 20,
                background: isCompleted ? agent.color : "var(--color-border-tertiary)",
                transition: "background 0.3s", marginBottom: 26,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AgentCard({ agent, result, isActive, isCompleted, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? agent.colorLight : "var(--color-background-primary)",
        border: `${isActive ? 2 : 0.5}px solid ${isActive ? agent.color : "var(--color-border-tertiary)"}`,
        borderRadius: 12, padding: "14px 16px", cursor: result ? "pointer" : "default",
        transition: "all 0.2s", opacity: !result && !isActive ? 0.5 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{agent.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: agent.color }}>{agent.name}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{agent.role}</div>
          </div>
        </div>
        {isCompleted && (
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 20,
            background: "#E1F5EE", color: "#0F6E56",
          }}>완료</span>
        )}
        {isActive && !isCompleted && (
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 20,
            background: agent.colorLight, color: agent.color,
          }}>진행중</span>
        )}
      </div>
      {result && (
        <div style={{
          fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8,
          overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5,
        }}>
          {result.substring(0, 120)}...
        </div>
      )}
    </div>
  );
}

function LoadingAnimation({ agentId }) {
  const agent = AGENT_CONFIGS[agentId];
  const messages = {
    research: ["시장 데이터 수집 중...", "최신 뉴스 검색 중...", "가격 데이터 확인 중...", "거래량 분석 중..."],
    analysis: ["피보나치 레벨 계산 중...", "엘리엇 파동 분석 중...", "기술지표 산출 중...", "패턴 인식 중..."],
    report: ["보고서 구조 생성 중...", "투자 시나리오 작성 중...", "리스크 매트릭스 구성 중...", "세무 영향 분석 중..."],
    master: ["CoT 검증 수행 중...", "ToT 시나리오 탐색 중...", "RAG 교차 검증 중...", "Self-Refine 최적화 중..."],
  };
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setMsgIdx((p) => (p + 1) % messages[agentId].length), 2500);
    return () => clearInterval(iv);
  }, [agentId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 16 }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", border: `3px solid ${agent.colorLight}`,
        borderTopColor: agent.color, animation: "spin 1s linear infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 24, animation: "none" }}>{agent.icon}</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: agent.color }}>{agent.name}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4, transition: "opacity 0.3s" }}>
          {messages[agentId][msgIdx]}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AssetManagementAgents() {
  const [query, setQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [results, setResults] = useState({});
  const [activeView, setActiveView] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const runPipeline = useCallback(async (inputQuery) => {
    setIsRunning(true);
    setError(null);
    setResults({});
    setCompletedSteps([]);
    setActiveView(null);

    try {
      // Step 1: Research
      setCurrentStep("research");
      const researchResult = await callAgent("research",
        `다음 자산에 대해 리서치를 수행해 주세요:\n\n${inputQuery}\n\n위 분석 도구 범위(MECE)에 따라 빠짐없이 조사해 주세요. 웹 검색을 활용하여 최신 데이터를 수집하세요.`
      );
      setResults((p) => ({ ...p, research: researchResult }));
      setCompletedSteps((p) => [...p, "research"]);

      // Step 2: Analysis
      setCurrentStep("analysis");
      const analysisResult = await callAgent("analysis",
        `다음 리서치 결과를 바탕으로 기술적 분석을 수행해 주세요:\n\n${inputQuery}`,
        `[리서치 에이전트 결과]\n${researchResult}`
      );
      setResults((p) => ({ ...p, analysis: analysisResult }));
      setCompletedSteps((p) => [...p, "analysis"]);

      // Step 3: Report
      setCurrentStep("report");
      const reportResult = await callAgent("report",
        `다음 리서치 및 분석 결과를 바탕으로 투자 보고서를 작성해 주세요:\n\n${inputQuery}`,
        `[리서치 에이전트 결과]\n${researchResult}\n\n[분석 에이전트 결과]\n${analysisResult}`
      );
      setResults((p) => ({ ...p, report: reportResult }));
      setCompletedSteps((p) => [...p, "report"]);

      // Step 4: Master Verification
      setCurrentStep("master");
      const masterResult = await callAgent("master",
        `아래 3개 서브에이전트의 결과를 검증하고 최종보고서를 작성해 주세요.\n\n분석 대상: ${inputQuery}\n\n반드시 4단계 검증 프로세스(CoT → ToT → RAG → Self-Refine)를 수행하세요.`,
        `[리서치 에이전트 결과]\n${researchResult}\n\n[분석 에이전트 결과]\n${analysisResult}\n\n[보고서 에이전트 결과]\n${reportResult}`
      );
      setResults((p) => ({ ...p, master: masterResult }));
      setCompletedSteps((p) => [...p, "master"]);
      setCurrentStep(null);
      setActiveView("master");
    } catch (e) {
      setError("에이전트 실행 중 오류가 발생했습니다: " + e.message);
      setCurrentStep(null);
    }
    setIsRunning(false);
  }, []);

  const handleSubmit = () => {
    if (!query.trim() || isRunning) return;
    runPipeline(query.trim());
  };

  const handlePreset = (value) => {
    setQuery(value);
    runPipeline(value);
  };

  useEffect(() => {
    if (activeView && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeView]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>👑</span>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            자산관리 에이전트 시스템
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          리서치 → 기술적 분석 → 보고서 → 총괄 검증(CoT·ToT·RAG·Self-Refine)
        </p>
      </div>

      {/* Input */}
      <div style={{
        background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12, padding: "16px 18px", marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10 }}>
          분석 대상 입력
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="분석할 자산을 입력하세요 (예: 비트코인 현재 시장 분석)"
            disabled={isRunning}
            rows={2}
            style={{
              flex: 1, resize: "none", border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: 8, padding: "10px 14px", fontSize: 14,
              fontFamily: "var(--font-sans)", color: "var(--color-text-primary)",
              background: "var(--color-background-primary)", lineHeight: 1.5,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isRunning || !query.trim()}
            style={{
              padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "#534AB7", color: "#fff", fontWeight: 500, fontSize: 14,
              fontFamily: "var(--font-sans)", opacity: isRunning || !query.trim() ? 0.4 : 1,
              alignSelf: "flex-end", whiteSpace: "nowrap",
            }}
          >
            {isRunning ? "분석중..." : "분석 시작"}
          </button>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p.value)}
              disabled={isRunning}
              style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 20,
                border: "0.5px solid var(--color-border-secondary)",
                color: "var(--color-text-secondary)", cursor: "pointer",
                background: "transparent", fontFamily: "var(--font-sans)",
                opacity: isRunning ? 0.4 : 1,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {(isRunning || completedSteps.length > 0) && (
        <ProgressBar steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
      )}

      {/* Agent Cards */}
      {(isRunning || completedSteps.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10, marginBottom: 20 }}>
          {STEPS.map((step) => (
            <AgentCard
              key={step.key}
              agent={AGENT_CONFIGS[step.key]}
              result={results[step.key]}
              isActive={currentStep === step.key}
              isCompleted={completedSteps.includes(step.key)}
              onClick={() => results[step.key] && setActiveView(step.key)}
            />
          ))}
        </div>
      )}

      {/* Loading */}
      {currentStep && <LoadingAnimation agentId={currentStep} />}

      {/* Error */}
      {error && (
        <div style={{
          background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)",
          borderRadius: 12, padding: 16, color: "var(--color-text-danger)", fontSize: 14, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {/* Result Viewer */}
      {activeView && results[activeView] && (
        <div ref={resultRef} style={{
          background: "var(--color-background-primary)", border: `2px solid ${AGENT_CONFIGS[activeView].color}`,
          borderRadius: 12, overflow: "hidden", marginBottom: 24,
        }}>
          {/* Tab bar */}
          <div style={{
            display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)",
            overflowX: "auto",
          }}>
            {STEPS.filter((s) => results[s.key]).map((step) => {
              const agent = AGENT_CONFIGS[step.key];
              const isActive = activeView === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => setActiveView(step.key)}
                  style={{
                    flex: 1, padding: "10px 12px", border: "none", cursor: "pointer",
                    background: isActive ? agent.colorLight : "transparent",
                    borderBottom: isActive ? `2px solid ${agent.color}` : "2px solid transparent",
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: isActive ? 500 : 400,
                    color: isActive ? agent.color : "var(--color-text-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{agent.icon}</span> {step.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ padding: "20px 24px", fontSize: 14, lineHeight: 1.8, color: "var(--color-text-primary)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
              paddingBottom: 12, borderBottom: "0.5px solid var(--color-border-tertiary)",
            }}>
              <span style={{ fontSize: 22 }}>{AGENT_CONFIGS[activeView].icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: AGENT_CONFIGS[activeView].color }}>
                  {AGENT_CONFIGS[activeView].name} 결과
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  {AGENT_CONFIGS[activeView].role}
                </div>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(results[activeView]) }} />
          </div>
        </div>
      )}

      {/* Architecture Info */}
      {!isRunning && completedSteps.length === 0 && (
        <div style={{
          background: "var(--color-background-secondary)", borderRadius: 12,
          padding: "20px 24px", marginTop: 8,
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 12 }}>
            시스템 아키텍처
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            {[
              { icon: "🔍", title: "리서치 에이전트", items: "웹 검색으로 최신 시세·뉴스·펀더멘탈 수집" },
              { icon: "📊", title: "분석 에이전트", items: "피보나치·엘리엇·RSI·MACD 등 기술적 분석" },
              { icon: "📋", title: "보고서 에이전트", items: "투자등급·시나리오·리스크·세무를 보고서로 정리" },
              { icon: "👑", title: "총괄 에이전트", items: "CoT→ToT→RAG→Self-Refine 4단계 검증 후 최종보고" },
            ].map((item) => (
              <div key={item.title} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: "var(--color-background-primary)", borderRadius: 8,
                border: "0.5px solid var(--color-border-tertiary)",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{item.items}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, padding: "10px 14px", background: "#EEEDFE",
            borderRadius: 8, fontSize: 12, color: "#534AB7", lineHeight: 1.6,
          }}>
            총괄 에이전트는 모든 서브에이전트 결과를 수집한 뒤 4단계 검증을 거쳐 오류를 수정하고 최종보고서를 생성합니다.
          </div>
        </div>
      )}
    </div>
  );
}
