
import { Employee, FinancialStats, CategorySummary } from '../types';
import { BRUTO_FACTOR, BASELINE_REVENUE_2025 } from '../constants';

/**
 * STUP LOJALNOSTI (Član 4. Pravilnika 2026)
 * Obračun: 2026 - Godina starta
 * >= 10 godina: +15%
 * >= 5 godina: +10%
 * >= 2 godine: +4%
 * < 2 godine: 0%
 */
export const getLoyaltyBonus = (startYear: number): number => {
  const yearsInIMH = 2026 - startYear;
  if (yearsInIMH >= 10) return 0.15;
  if (yearsInIMH >= 5) return 0.10;
  if (yearsInIMH >= 2) return 0.04;
  return 0;
};

/**
 * STUP STRUČNOSTI (Član 5. Pravilnika)
 * Magistar (MA) Bonus: Fiksno +5% na osnovnu Neto platu.
 */
export const getExpertiseBonus = (isMa: boolean): number => {
  return isMa ? 0.05 : 0;
};

export const calculateNewNet = (employee: Employee): number => {
  const loyalty = getLoyaltyBonus(employee.start);
  const expertise = getExpertiseBonus(employee.ma);
  // Povišica se obračunava na bazi Target Net plate (Ciljana osnovica 2026)
  return employee.targetNet * (1 + loyalty + expertise);
};

export const calculateStats = (employees: Employee[], tuitionIncrease: number): FinancialStats => {
  const totalCurrentNetMonthly = employees.reduce((sum, e) => sum + e.currentNet, 0);
  const totalNewNetMonthly = employees.reduce((sum, e) => sum + calculateNewNet(e), 0);

  // Ukupni trošak za ustanovu (Bruto 1) = Neto * 1.63
  const totalCurrentGrossYearly = (totalCurrentNetMonthly * 12) * BRUTO_FACTOR;
  const totalNewGrossYearly = (totalNewNetMonthly * 12) * BRUTO_FACTOR;

  // Ukupni trošak povišica (Bruto porast)
  const grossIncrease = totalNewGrossYearly - totalCurrentGrossYearly;
  
  // Novi Prihod od školarina
  const revenueGrowth = BASELINE_REVENUE_2025 * (tuitionIncrease / 100);
  
  // MANDAT 2: Održivost (Sustainability Gauge)
  // Strategija je održiva SAMO ako rast prihoda pokriva rast plata
  const isSustainable = revenueGrowth >= grossIncrease;
  
  // PROFITNA REZERVA: (Bazni prihod 2025 + Rast) - Ukupni novi Bruto trošak
  const operationalBuffer = (BASELINE_REVENUE_2025 + revenueGrowth) - totalNewGrossYearly;

  const cats: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const categorySummaries: CategorySummary[] = cats.map(cat => {
    const catEmployees = employees.filter(e => e.cat === cat);
    const catNewGross = catEmployees.reduce((sum, e) => sum + calculateNewNet(e), 0) * 12 * BRUTO_FACTOR;
    return {
      cat,
      count: catEmployees.length,
      totalNewGross: catNewGross
    };
  });

  return {
    totalCurrentNet: totalCurrentNetMonthly * 12,
    totalNewNet: totalNewNetMonthly * 12,
    totalCurrentGross: totalCurrentGrossYearly,
    totalNewGross: totalNewGrossYearly,
    grossIncrease,
    revenueGrowth,
    isSustainable,
    operationalBuffer,
    categorySummaries
  };
};
