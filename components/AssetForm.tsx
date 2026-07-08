"use client";

import { useState } from "react";
import {
  ASSET_CATEGORIES,
  LIABILITY_CATEGORIES,
  AssetCategory,
  LiabilityCategory,
  ItemKind,
} from "@/lib/types";

export default function AssetForm({
  onSubmit,
}: {
  onSubmit: (input: {
    kind: ItemKind;
    category: AssetCategory | LiabilityCategory;
    name: string;
    amount: number;
    memo?: string;
  }) => void;
}) {
  const [kind, setKind] = useState<ItemKind>("asset");
  const [category, setCategory] = useState<string>(ASSET_CATEGORIES[0]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categories = kind === "asset" ? ASSET_CATEGORIES : LIABILITY_CATEGORIES;

  function handleKindChange(next: ItemKind) {
    setKind(next);
    setCategory(next === "asset" ? ASSET_CATEGORIES[0] : LIABILITY_CATEGORIES[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount.replace(/,/g, ""));
    if (!name.trim()) {
      setError("항목 이름을 입력해주세요.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("금액은 0보다 큰 숫자로 입력해주세요.");
      return;
    }
    setError(null);
    onSubmit({
      kind,
      category: category as AssetCategory | LiabilityCategory,
      name: name.trim(),
      amount: parsedAmount,
      memo: memo.trim() || undefined,
    });
    setName("");
    setAmount("");
    setMemo("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-5 space-y-4"
      style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
    >
      <div className="flex gap-2">
        {(["asset", "liability"] as ItemKind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => handleKindChange(k)}
            className="px-3 py-1.5 rounded-md text-sm font-medium border"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: kind === k ? "var(--gridline)" : "transparent",
              color: "var(--text-primary)",
            }}
          >
            {k === "asset" ? "자산" : "부채"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm space-y-1">
          <span style={{ color: "var(--text-secondary)" }}>카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border px-3 py-2 bg-transparent"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm space-y-1">
          <span style={{ color: "var(--text-secondary)" }}>이름</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={kind === "asset" ? "예: 삼성전자, 자유입출금 통장" : "예: 신용대출, 전세자금대출"}
            className="w-full rounded-md border px-3 py-2 bg-transparent"
            style={{ borderColor: "var(--border-hairline)" }}
          />
        </label>

        <label className="text-sm space-y-1">
          <span style={{ color: "var(--text-secondary)" }}>금액 (원)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="예: 5000000"
            className="w-full rounded-md border px-3 py-2 bg-transparent tabular-nums"
            style={{ borderColor: "var(--border-hairline)" }}
          />
        </label>

        <label className="text-sm space-y-1">
          <span style={{ color: "var(--text-secondary)" }}>메모 (선택)</span>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 3년 만기, 변동금리"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
            style={{ borderColor: "var(--border-hairline)" }}
          />
        </label>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--status-critical)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-md px-4 py-2 text-sm font-semibold text-white"
        style={{ backgroundColor: "var(--series-1)" }}
      >
        추가하기
      </button>
    </form>
  );
}
