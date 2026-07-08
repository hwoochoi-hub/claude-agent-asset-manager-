"use client";

import { formatKRW } from "@/lib/format";

export default function SummaryCards({
  totalAssets,
  totalLiabilities,
}: {
  totalAssets: number;
  totalLiabilities: number;
}) {
  const netWorth = totalAssets - totalLiabilities;

  const cards = [
    { label: "총 자산", value: totalAssets, tone: "var(--text-primary)" },
    { label: "총 부채", value: totalLiabilities, tone: "var(--status-critical)" },
    {
      label: "순자산",
      value: netWorth,
      tone: netWorth >= 0 ? "var(--status-good)" : "var(--status-critical)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {c.label}
          </p>
          <p className="text-2xl font-semibold tabular-nums" style={{ color: c.tone }}>
            {formatKRW(c.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
