export interface Child {
  id: string;
  name: string;
  group: string;
  monthlyFee: number;
  active: boolean;
}

export interface ChildSummary {
  total: number;
  active: number;
  inactive: number;
  averageMonthlyFee: number;
  highestFee: Child;
  lowestFee: Child;
  groups: string[];
}

export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: ChildSummary;
  children: Child[];
}