
import { Employee, FinancialStats } from '../types';
import { BRUTO_FACTOR, BASELINE_REVENUE_2025 } from '../constants';

/**
 * Pillar 1: Loyalty (Stup lojalnosti) based on 2026 perspective
 * 10+ Years (Start <= 2016): +15%
 * 5 - 10 Years (Start 2017 - 2021): +10%
 * 2 - 5 Years (Start 2022 - 2024): +4%
 * < 2 Years (Start 2025+): 0%
 */
export const getLoyaltyBonus = (startYear: number): number => {
  if (startYear <= 2016) return 0.15;
  if (startYear >= 2017 && startYear <= 2021) return 0.10;
  if (startYear >= 2022 && startYear <= 2024) return 0.04;
  return 0;
};

/**
 * Pillar 2: Expertise (Stup stručnosti)
 * Magistar (MA) Bonus: Fixed +5% increase on Base Net
 */
export const getExpertiseBonus = (isMa: boolean): number => {
  return isMa ? 0.05 : 0;
};

export const calculateNewNet = (employee: Employee): number => {
  const loyalty = getLoyaltyBonus(employee.start);
  const expertise = getExpertiseBonus(employee.ma);
  // Base increment is on the targetNet
  return employee.targetNet * (1 + loyalty + expertise);
};

export const calculateStats = (employees: Employee[], tuitionIncrease: number): FinancialStats => {
  const totalCurrentNetMonthly = employees.reduce((sum, e) => sum + e.currentNet, 0);
  const totalNewNetMonthly = employees.reduce((sum, e) => sum + calculateNewNet(e), 0);

  const totalCurrentGrossYearly = (totalCurrentNetMonthly * 12) * BRUTO_FACTOR;
  const totalNewGrossYearly = (totalNewNetMonthly * 12) * BRUTO_FACTOR;

  const grossIncrease = totalNewGrossYearly - totalCurrentGrossYearly;
  const revenueGrowth = BASELINE_REVENUE_2025 * (tuitionIncrease / 100);
  
  const isSustainable = revenueGrowth >= grossIncrease;
  const operationalBuffer = revenueGrowth - grossIncrease;

  return {
    totalCurrentNet: totalCurrentNetMonthly * 12,
    totalNewNet: totalNewNetMonthly * 12,
    totalCurrentGross: totalCurrentGrossYearly,
    totalNewGross: totalNewGrossYearly,
    grossIncrease,
    revenueGrowth,
    isSustainable,
    operationalBuffer
  };
};
