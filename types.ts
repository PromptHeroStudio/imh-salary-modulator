
export interface Employee {
  id: number;
  name: string;
  role: string;
  cat: 'A' | 'B' | 'C' | 'D';
  start: number;
  ma: boolean;
  currentNet: number;
  targetNet: number;
}

export interface CategorySummary {
  cat: 'A' | 'B' | 'C' | 'D';
  count: number;
  totalNewGross: number;
}

export interface FinancialStats {
  totalCurrentNet: number;
  totalNewNet: number;
  totalCurrentGross: number;
  totalNewGross: number;
  grossIncrease: number;
  revenueGrowth: number;
  isSustainable: boolean;
  operationalBuffer: number;
  categorySummaries: CategorySummary[];
}

export interface Pricing {
  local: number;
  foreign: number;
  canteen: number;
}
