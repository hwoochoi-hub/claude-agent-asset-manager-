"use client";

import { useMemo } from "react";
import { useFinanceItems } from "@/lib/useFinanceItems";
import AssetForm from "@/components/AssetForm";
import AssetTable from "@/components/AssetTable";

export default function AssetsPage() {
  const { items, addItem, removeItem, hydrated } = useFinanceItems();

  const assets = useMemo(() => items.filter((it) => it.kind === "asset"), [items]);
  const liabilities = useMemo(() => items.filter((it) => it.kind === "liability"), [items]);

  if (!hydrated) {
    return <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">자산 관리</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          보유 자산과 부채를 추가·삭제하며 최신 상태로 관리하세요.
        </p>
      </div>

      <AssetForm onSubmit={addItem} />

      <section
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
      >
        <h2 className="text-base font-semibold mb-3">자산 ({assets.length})</h2>
        <AssetTable items={assets} onRemove={removeItem} />
      </section>

      <section
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
      >
        <h2 className="text-base font-semibold mb-3">부채 ({liabilities.length})</h2>
        <AssetTable items={liabilities} onRemove={removeItem} />
      </section>
    </div>
  );
}
