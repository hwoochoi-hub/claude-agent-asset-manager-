export type AssetCategory =
  | "현금"
  | "예금/적금"
  | "주식"
  | "펀드/ETF"
  | "암호화폐"
  | "부동산"
  | "연금/보험"
  | "기타";

export type LiabilityCategory = "대출" | "신용카드" | "전세보증금" | "기타부채";

export type ItemKind = "asset" | "liability";

export interface FinanceItem {
  id: string;
  kind: ItemKind;
  category: AssetCategory | LiabilityCategory;
  name: string;
  amount: number; // 원 단위, 항상 양수로 저장
  memo?: string;
  updatedAt: string; // ISO date string
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  "현금",
  "예금/적금",
  "주식",
  "펀드/ETF",
  "암호화폐",
  "부동산",
  "연금/보험",
  "기타",
];

export const LIABILITY_CATEGORIES: LiabilityCategory[] = [
  "대출",
  "신용카드",
  "전세보증금",
  "기타부채",
];

export interface AnalysisRecord {
  id: string;
  target: string;
  note?: string;
  result: string;
  createdAt: string;
}
