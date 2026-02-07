
import { useState, useMemo } from 'react';
import { Employee } from '../types';
import { INITIAL_EMPLOYEES, BRUTO_FACTOR } from '../constants';
import { calculateStats } from '../services/financialEngine';

export const useSalaryLogic = () => {
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tuitionIncrease, setTuitionIncrease] = useState<number>(6);
  
  // State za filtriranje
  const [activeCatFilter, setActiveCatFilter] = useState<'ALL' | 'CD' | 'AB'>('ALL');
  const [activeMaFilter, setActiveMaFilter] = useState<'ALL' | 'MA_ONLY' | 'NO_MA'>('ALL');
  const [activeYearFilter, setActiveYearFilter] = useState<'ALL' | 'BEFORE_2020' | 'AFTER_2020'>('ALL');

  // Glavna statistika (Semafor, Suficit/Deficit)
  const stats = useMemo(() => calculateStats(employees, tuitionIncrease), [employees, tuitionIncrease]);

  // Podaci za grafikon lojalnosti
  const loyaltyCostData = useMemo(() => {
    const groups = [
      { label: '≤ 2016 (10+ god)', filter: (y: number) => y <= 2016, color: '#064e3b' },
      { label: '2017-2021 (5-10 god)', filter: (y: number) => y >= 2017 && y <= 2021, color: '#059669' },
      { label: '2022-2024 (2-5 god)', filter: (y: number) => y >= 2022 && y <= 2024, color: '#10b981' },
      { label: '2025+ (< 2 god)', filter: (y: number) => y >= 2025, color: '#34d399' },
    ];

    return groups.map(g => {
      const groupEmployees = employees.filter(e => g.filter(e.start));
      const totalBrutoRaise = groupEmployees.reduce((sum, e) => sum + (e.targetNet - e.currentNet) * BRUTO_FACTOR, 0);
      return {
        period: g.label,
        iznos: Number(totalBrutoRaise.toFixed(2)),
        boja: g.color
      };
    });
  }, [employees]);

  // Filtrirani zaposlenici za tabelu
  const visibleEmployees = useMemo(() => {
    return employees.filter(e => {
      let passCat = true;
      if (activeCatFilter === 'CD') passCat = (e.cat === 'C' || e.cat === 'D');
      if (activeCatFilter === 'AB') passCat = (e.cat === 'A' || e.cat === 'B');
      
      const passMa = activeMaFilter === 'ALL' || 
                    (activeMaFilter === 'MA_ONLY' && e.ma) || 
                    (activeMaFilter === 'NO_MA' && !e.ma);

      let passYear = true;
      if (activeYearFilter === 'BEFORE_2020') passYear = e.start < 2020;
      if (activeYearFilter === 'AFTER_2020') passYear = e.start > 2020;
      
      return passCat && passMa && passYear;
    });
  }, [employees, activeCatFilter, activeMaFilter, activeYearFilter]);

  // Totali za tabelu (ovisni o filterima)
  const totals = useMemo(() => {
    const totalCurrentNet = visibleEmployees.reduce((sum, e) => sum + e.currentNet, 0);
    const totalTargetNet = visibleEmployees.reduce((sum, e) => sum + e.targetNet, 0);
    const totalNetIncrease = totalTargetNet - totalCurrentNet;
    // KRITIČNA KALKULACIJA: Faktor 1.63
    const totalBrutoCost = visibleEmployees.reduce((sum, e) => sum + (e.targetNet - e.currentNet) * BRUTO_FACTOR, 0);
    
    return { totalCurrentNet, totalTargetNet, totalNetIncrease, totalBrutoCost };
  }, [visibleEmployees]);

  // Globalni totali (za KPI kartice, neovisni o filterima tabele)
  const globalTotals = useMemo(() => {
     return {
         totalTargetNet: employees.reduce((sum, e) => sum + e.targetNet, 0),
         totalBrutoCost: employees.reduce((sum, e) => sum + (e.targetNet - e.currentNet) * BRUTO_FACTOR, 0)
     }
  }, [employees]);

  // Podaci za Waterfall grafikon
  const waterfallData = useMemo(() => {
    const prihod = stats.dodatniPrihod;
    const costA = stats.categorySummaries.find(s => s.cat === 'A')?.totalRaiseCostBruto || 0;
    const costB = stats.categorySummaries.find(s => s.cat === 'B')?.totalRaiseCostBruto || 0;
    const costCD = (stats.categorySummaries.find(s => s.cat === 'C')?.totalRaiseCostBruto || 0) + 
                   (stats.categorySummaries.find(s => s.cat === 'D')?.totalRaiseCostBruto || 0);
    const dobit = stats.cistaDobit;

    return [
      { name: 'PRIHOD', val: prihod, fill: '#10B981' },
      { name: 'UPRAVA', val: -costA, fill: '#0f172a' },
      { name: 'ODGAJATELJI', val: -costB, fill: '#334155' },
      { name: 'POMOĆNO', val: -costCD, fill: '#64748b' },
      { name: 'SUFICIT', val: dobit, fill: stats.isSustainable ? '#10B981' : '#EF4444' },
    ];
  }, [stats]);

  return {
    employees,
    visibleEmployees,
    tuitionIncrease,
    setTuitionIncrease,
    activeCatFilter,
    setActiveCatFilter,
    activeMaFilter,
    setActiveMaFilter,
    activeYearFilter,
    setActiveYearFilter,
    stats,
    loyaltyCostData,
    totals,
    globalTotals,
    waterfallData
  };
};
