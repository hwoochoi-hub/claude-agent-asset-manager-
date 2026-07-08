"use client";

import { useLocalStorage } from "./useLocalStorage";
import { FinanceItem } from "./types";

const STORAGE_KEY = "asset-manager:items";

export function useFinanceItems() {
  const [items, setItems, hydrated] = useLocalStorage<FinanceItem[]>(STORAGE_KEY, []);

  function addItem(item: Omit<FinanceItem, "id" | "updatedAt">) {
    const newItem: FinanceItem = {
      ...item,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
  }

  function updateItem(id: string, patch: Partial<Omit<FinanceItem, "id">>) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it
      )
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return { items, addItem, updateItem, removeItem, hydrated };
}
