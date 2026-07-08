"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFinanceItems } from "@/lib/useFinanceItems";
import SummaryCards from "@/components/SummaryCards";
import AllocationChart from "@/components/AllocationChart";
import { formatKRW, formatDate } from "@/lib/format";

export default function DashboardPage() {
  const { items, hydrated } = useFinanceItems();

  const assets = useMemo(() => items.filter((it) => it.kind === "asset"), [items]);
  const liabilities = useMemo(() => items.filter((it) => it.kind === "liability"), [items]);

  const totalAssets = assets.reduce((sum, it) => sum + it.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, it) => sum + it.amount, 0);

  const allocation = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const a of assets) {
      byCategory.set(a.category, (byCategory.get(a.category) ?? 0) + a.amount);
    }
    return Array.from(byCategory.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [assets]);

  const recentItems = useMemo(
    () =>
      [...items]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [items]
  );

  if (!hydrated) {
    return <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">자산 현황 점검</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          내 자산과 부채를 한눈에 확인하세요. 데이터는 이 브라우저에만 저장됩니다.
        </p>
      </div>

      <SummaryCards totalAssets={totalAssets} totalLiabilities={totalLiabilities} />

      <section
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
      >
        <h2 className="text-base font-semibold mb-4">카테고리별 자산 배분</h2>
        <AllocationChart data={allocation} />
      </section>

      <section
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">최근 변경 내역</h2>
          <Link href="/assets" className="text-sm font-medium" style={{ color: "var(--series-1)" }}>
            전체 자산 관리 →
          </Link>
        </div>
        {recentItems.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            아직 등록된 항목이 없습니다.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--gridline)" }}>
            {recentItems.map((it) => (
              <li key={it.id} className="py-2.5 flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{it.name}</p>
                  <p style={{ color: "var(--text-muted)" }}>
                    {it.category} · {formatDate(it.updatedAt)}
                  </p>
                </div>
                <span
                  className="tabular-nums shrink-0 ml-3"
                  style={{ color: it.kind === "liability" ? "var(--status-critical)" : "var(--text-primary)" }}
                >
                  {it.kind === "liability" ? "-" : ""}
                  {formatKRW(it.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
