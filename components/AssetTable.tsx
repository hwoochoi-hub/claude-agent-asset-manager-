"use client";

import { FinanceItem } from "@/lib/types";
import { formatKRW, formatDate } from "@/lib/format";

export default function AssetTable({
  items,
  onRemove,
}: {
  items: FinanceItem[];
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
        등록된 항목이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b" style={{ borderColor: "var(--gridline)" }}>
            <th className="py-2 pr-3 font-medium" style={{ color: "var(--text-muted)" }}>
              이름
            </th>
            <th className="py-2 pr-3 font-medium" style={{ color: "var(--text-muted)" }}>
              카테고리
            </th>
            <th className="py-2 pr-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>
              금액
            </th>
            <th className="py-2 pr-3 font-medium" style={{ color: "var(--text-muted)" }}>
              업데이트
            </th>
            <th className="py-2 font-medium" style={{ color: "var(--text-muted)" }} />
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-b" style={{ borderColor: "var(--gridline)" }}>
              <td className="py-2.5 pr-3">
                <p className="font-medium">{it.name}</p>
                {it.memo && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {it.memo}
                  </p>
                )}
              </td>
              <td className="py-2.5 pr-3" style={{ color: "var(--text-secondary)" }}>
                {it.category}
              </td>
              <td
                className="py-2.5 pr-3 text-right tabular-nums"
                style={{ color: it.kind === "liability" ? "var(--status-critical)" : "var(--text-primary)" }}
              >
                {it.kind === "liability" ? "-" : ""}
                {formatKRW(it.amount)}
              </td>
              <td className="py-2.5 pr-3" style={{ color: "var(--text-muted)" }}>
                {formatDate(it.updatedAt)}
              </td>
              <td className="py-2.5 text-right">
                <button
                  onClick={() => onRemove(it.id)}
                  className="text-xs font-medium"
                  style={{ color: "var(--status-critical)" }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
