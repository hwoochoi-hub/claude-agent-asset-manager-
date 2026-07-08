"use client";

import { useMemo, useState } from "react";
import { useFinanceItems } from "@/lib/useFinanceItems";
import { useAnalysisHistory } from "@/lib/useAnalysisHistory";
import { formatKRW, formatDate } from "@/lib/format";
import MarkdownLite from "@/components/MarkdownLite";

export default function AnalysisPage() {
  const { items } = useFinanceItems();
  const { history, addRecord, removeRecord } = useAnalysisHistory();

  const [target, setTarget] = useState("");
  const [note, setNote] = useState("");
  const [includePortfolio, setIncludePortfolio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const portfolioSummary = useMemo(() => {
    const assets = items.filter((it) => it.kind === "asset");
    if (assets.length === 0) return "";
    const byCategory = new Map<string, number>();
    for (const a of assets) {
      byCategory.set(a.category, (byCategory.get(a.category) ?? 0) + a.amount);
    }
    const total = assets.reduce((sum, a) => sum + a.amount, 0);
    return Array.from(byCategory.entries())
      .map(([cat, amount]) => `- ${cat}: ${formatKRW(amount)} (${Math.round((amount / total) * 100)}%)`)
      .join("\n");
  }, [items]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!target.trim()) {
      setError("분석할 자산/종목명을 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          target: target.trim(),
          note: note.trim(),
          portfolioContext: includePortfolio ? portfolioSummary : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "분석 요청에 실패했습니다.");
        return;
      }
      setResult(data.result);
      addRecord({ target: target.trim(), note: note.trim() || undefined, result: data.result });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">투자 분석</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          관심 있는 종목/자산을 입력하면 AI가 정성적인 분석을 제공합니다. (투자 조언 아님)
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
      >
        <label className="text-sm space-y-1 block">
          <span style={{ color: "var(--text-secondary)" }}>분석할 자산/종목</span>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="예: 삼성전자, TSLA, 비트코인, 리츠(REITs)"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
            style={{ borderColor: "var(--border-hairline)" }}
          />
        </label>

        <label className="text-sm space-y-1 block">
          <span style={{ color: "var(--text-secondary)" }}>추가로 궁금한 점 (선택)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="예: 지금 진입하기에 밸류에이션이 부담스럽지 않은지 궁금해"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
            style={{ borderColor: "var(--border-hairline)" }}
          />
        </label>

        {portfolioSummary && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includePortfolio}
              onChange={(e) => setIncludePortfolio(e.target.checked)}
            />
            <span style={{ color: "var(--text-secondary)" }}>
              내 포트폴리오 구성을 함께 참고해서 분석 (집중도 리스크 등)
            </span>
          </label>
        )}

        {error && (
          <p className="text-sm" style={{ color: "var(--status-critical)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--series-1)" }}
        >
          {loading ? "분석 중..." : "분석 요청"}
        </button>
      </form>

      {result && (
        <section
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
        >
          <h2 className="text-base font-semibold mb-2">{target} 분석 결과</h2>
          <MarkdownLite text={result} />
        </section>
      )}

      {history.length > 0 && (
        <section
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
        >
          <h2 className="text-base font-semibold mb-3">분석 히스토리</h2>
          <ul className="divide-y" style={{ borderColor: "var(--gridline)" }}>
            {history.map((r) => (
              <li key={r.id} className="py-3">
                <details>
                  <summary className="cursor-pointer flex items-center justify-between text-sm">
                    <span className="font-medium">{r.target}</span>
                    <span className="flex items-center gap-3">
                      <span style={{ color: "var(--text-muted)" }}>{formatDate(r.createdAt)}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeRecord(r.id);
                        }}
                        className="text-xs font-medium"
                        style={{ color: "var(--status-critical)" }}
                      >
                        삭제
                      </button>
                    </span>
                  </summary>
                  <div className="mt-3">
                    <MarkdownLite text={r.result} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
