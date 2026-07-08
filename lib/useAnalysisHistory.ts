"use client";

import { useLocalStorage } from "./useLocalStorage";
import { AnalysisRecord } from "./types";

const STORAGE_KEY = "asset-manager:analysis-history";

export function useAnalysisHistory() {
  const [history, setHistory, hydrated] = useLocalStorage<AnalysisRecord[]>(STORAGE_KEY, []);

  function addRecord(record: Omit<AnalysisRecord, "id" | "createdAt">) {
    const newRecord: AnalysisRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => [newRecord, ...prev].slice(0, 50));
    return newRecord;
  }

  function removeRecord(id: string) {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }

  return { history, addRecord, removeRecord, hydrated };
}
