
import { Employee, FinancialStats, CategorySummary } from '../types';
import { BRUTO_FACTOR, BASELINE_REVENUE_2025 } from '../constants';

export const calculateLoyaltyBonus = (startYear: number): number => {
  const years = 2026 - startYear;
  if (years >= 10) return 15;
  if (years >= 5) return 10;
  if (years >= 2) return 4;
  return 0;
};

export const calculateStats = (employees: Employee[], tuitionIncrease: number): FinancialStats => {
  // 1. Dodatni prihod od školarina
  const dodatniPrihod = BASELINE_REVENUE_2025 * (tuitionIncrease / 100);

  // 2. Ukupni Bruto trošak povišica
  // Formula: (targetNet - currentNet) * 1.63
  const ukupniTrosakPovisicaBruto = employees.reduce((sum, emp) => {
    const raise = emp.targetNet - emp.currentNet;
    return sum + (raise * BRUTO_FACTOR);
  }, 0);

  // 3. Sigurnosna rezerva
  const cistaDobit = dodatniPrihod - ukupniTrosakPovisicaBruto;

  // 4. Analiza po kategorijama za Waterfall
  const categoryLabels: Record<string, string> = {
    'A': 'Uprava i Pedagogija',
    'B': 'Odgajatelji',
    'C': 'Asistenti i Stručni saradnici',
    'D': 'Tehničko osoblje'
  };

  const cats: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const categorySummaries: CategorySummary[] = cats.map(cat => {
    const filtered = employees.filter(e => e.cat === cat);
    const cost = filtered.reduce((sum, e) => sum + ((e.targetNet - e.currentNet) * BRUTO_FACTOR), 0);
    return {
      cat,
      label: categoryLabels[cat],
      count: filtered.length,
      totalRaiseCostBruto: cost
    };
  });

  return {
    dodatniPrihod,
    ukupniTrosakPovisicaBruto,
    cistaDobit,
    isSustainable: cistaDobit >= 0,
    categorySummaries
  };
};
