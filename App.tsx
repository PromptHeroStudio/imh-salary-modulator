
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Wallet, 
  FileText, 
  X, 
  Printer, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Award, 
  Scale, 
  Target, 
  FileCheck, 
  Zap, 
  CheckCircle2,
  PieChart,
  Filter,
  GraduationCap,
  LayoutGrid,
  CalendarDays,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

import { INITIAL_EMPLOYEES, BRUTO_FACTOR } from './constants';
import { Employee } from './types';
import { calculateStats, calculateLoyaltyBonus } from './services/financialEngine';

// Komponenta za formatiranje valute po bs-BA standardu (1.000,00 KM)
const LocalFormattedCurrency: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const formatted = new Intl.NumberFormat('bs-BA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(value);
  return <span className={`font-mono text-black ${className}`}>{formatted} KM</span>;
};

// Pomoćna funkcija za formatiranje u KM string
function formattedCurrency(val: number) {
  return new Intl.NumberFormat('bs-BA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(val) + " KM";
}

const App: React.FC = () => {
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tuitionIncrease, setTuitionIncrease] = useState<number>(6);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // State za filtriranje
  const [activeCatFilter, setActiveCatFilter] = useState<'ALL' | 'CD' | 'AB'>('ALL');
  const [activeMaFilter, setActiveMaFilter] = useState<'ALL' | 'MA_ONLY' | 'NO_MA'>('ALL');
  const [activeYearFilter, setActiveYearFilter] = useState<'ALL' | 'BEFORE_2020' | 'AFTER_2020'>('ALL');

  const stats = useMemo(() => calculateStats(employees, tuitionIncrease), [employees, tuitionIncrease]);

  // Podaci za novi grafikon po godinama (lojalnosti)
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

  // Kombinovana logika filtriranja
  const visibleEmployees = useMemo(() => {
    return employees.filter(e => {
      // Filter po kategoriji
      let passCat = true;
      if (activeCatFilter === 'CD') passCat = (e.cat === 'C' || e.cat === 'D');
      if (activeCatFilter === 'AB') passCat = (e.cat === 'A' || e.cat === 'B');
      
      // Filter po MA statusu
      const passMa = activeMaFilter === 'ALL' || 
                    (activeMaFilter === 'MA_ONLY' && e.ma) || 
                    (activeMaFilter === 'NO_MA' && !e.ma);

      // Filter po godini početka rada
      let passYear = true;
      if (activeYearFilter === 'BEFORE_2020') passYear = e.start < 2020;
      if (activeYearFilter === 'AFTER_2020') passYear = e.start > 2020;
      
      return passCat && passMa && passYear;
    });
  }, [employees, activeCatFilter, activeMaFilter, activeYearFilter]);

  const totals = useMemo(() => {
    const totalCurrentNet = employees.reduce((sum, e) => sum + e.currentNet, 0);
    const totalTargetNet = employees.reduce((sum, e) => sum + e.targetNet, 0);
    const totalNetIncrease = totalTargetNet - totalCurrentNet;
    const totalBrutoCost = totalNetIncrease * BRUTO_FACTOR;
    return { totalCurrentNet, totalTargetNet, totalNetIncrease, totalBrutoCost };
  }, [employees]);

  const waterfallData = useMemo(() => {
    const prihod = stats.dodatniPrihod;
    const costA = stats.categorySummaries.find(s => s.cat === 'A')?.totalRaiseCostBruto || 0;
    const costB = stats.categorySummaries.find(s => s.cat === 'B')?.totalRaiseCostBruto || 0;
    const costCD = (stats.categorySummaries.find(s => s.cat === 'C')?.totalRaiseCostBruto || 0) + 
                   (stats.categorySummaries.find(s => s.cat === 'D')?.totalRaiseCostBruto || 0);
    const dobit = stats.cistaDobit;

    return [
      { name: 'PRIHOD', val: prihod, fill: '#10B981' },
      { name: 'UPRAVA', val: -costA, fill: '#000000' },
      { name: 'ODGAJATELJI', val: -costB, fill: '#000000' },
      { name: 'POMOĆNO', val: -costCD, fill: '#000000' },
      { name: 'SUFICIT', val: dobit, fill: stats.isSustainable ? '#10B981' : '#EF4444' },
    ];
  }, [stats]);

  const toggleReport = useCallback(() => setIsReportOpen(prev => !prev), []);
  const togglePrivacy = useCallback(() => setPrivacyMode(prev => !prev), []);

  return (
    <div className="min-h-screen bg-white text-black font-sans w-full max-w-none antialiased flex flex-col p-4 md:p-6 lg:p-8 text-lg">
      
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${stats.isSustainable ? 'opacity-[0.02] bg-emerald-500' : 'opacity-[0.05] bg-red-500'}`} />

      {/* HEADER */}
      <header className="w-full mb-12 flex flex-col xl:flex-row items-center justify-between gap-8 relative z-10 border-b-8 border-black pb-12">
        <div className="flex items-center gap-10">
          <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="IMH Logo" className="h-[80px] object-contain" />
          <div className="h-16 w-2 bg-black hidden md:block"></div>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter text-black uppercase">
            Matrica strategije plata 2026
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 w-full xl:w-auto">
          <div className="flex items-center gap-8 bg-slate-50 px-10 py-6 rounded-3xl border-4 border-black w-full sm:w-auto shadow-2xl">
            <span className="text-sm font-black uppercase text-black tracking-[0.2em] whitespace-nowrap">Korekcija školarine:</span>
            <input 
              type="range" min="0" max="10" step="0.5"
              value={tuitionIncrease}
              onChange={(e) => setTuitionIncrease(parseFloat(e.target.value))}
              className="w-64 h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black"
            />
            <span className="text-black font-black text-5xl min-w-[120px]">+{tuitionIncrease}%</span>
          </div>
          
          <div className="flex gap-6 w-full lg:w-auto">
            <button 
              onClick={toggleReport} 
              className="flex-1 lg:flex-none px-12 py-6 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 active:scale-95"
            >
              <FileText size={28} /> GENERIRAJ IZVJEŠTAJ
            </button>
            
            <button 
              onClick={togglePrivacy}
              className="p-6 rounded-2xl border-4 border-black bg-white text-black shadow-xl hover:bg-slate-50 transition-all active:scale-95"
              title="Privatni način rada"
            >
              {privacyMode ? <EyeOff size={32} /> : <Eye size={32} />}
            </button>
          </div>
        </div>
      </header>

      {/* STRATEŠKE KARTICE */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 relative z-10">
        <motion.div className="p-12 rounded-[3rem] border-8 border-black bg-white shadow-2xl flex flex-col justify-between h-64">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-black">Prirast prihoda</span>
            <TrendingUp className="text-emerald-600 w-12 h-12" />
          </div>
          <LocalFormattedCurrency value={stats.dodatniPrihod} className="text-5xl font-black" />
        </motion.div>

        <motion.div className="p-12 rounded-[3rem] border-8 border-black bg-white shadow-2xl flex flex-col justify-between h-64">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-black">Ukupni Bruto Trošak</span>
            <Scale className="text-red-600 w-12 h-12" />
          </div>
          <div className="text-5xl font-mono font-black text-black">
            -<LocalFormattedCurrency value={totals.totalBrutoCost} />
          </div>
        </motion.div>

        <motion.div className="p-12 rounded-[3rem] border-8 border-black bg-white shadow-2xl flex flex-col justify-between h-64">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-black">Neto Isplatni Fond</span>
            <Users className="text-black w-12 h-12 opacity-10" />
          </div>
          <LocalFormattedCurrency value={totals.totalTargetNet} className="text-5xl font-black" />
        </motion.div>

        <motion.div className={`p-12 rounded-[3rem] border-8 ${stats.isSustainable ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'} shadow-2xl flex flex-col justify-between h-64`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-black uppercase tracking-[0.3em] ${stats.isSustainable ? 'text-emerald-700' : 'text-red-700'}`}>Operativni Suficit</span>
            <Wallet className={`${stats.isSustainable ? 'text-emerald-600' : 'text-red-600'} w-12 h-12`} />
          </div>
          <LocalFormattedCurrency 
            value={stats.cistaDobit} 
            className={`text-5xl font-black ${stats.isSustainable ? 'text-emerald-700' : 'text-red-700'}`} 
          />
        </motion.div>
      </div>

      {/* DOMINANTNI ANALITIČKI PANEL */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-12 mb-16 relative z-10">
        
        {/* SIGURNOST BUDŽETA - DOMINANTAN GAUGE (70%) */}
        <div className="xl:col-span-8">
          <div className="p-16 rounded-[4rem] border-8 border-black bg-white shadow-2xl flex flex-col items-center justify-center text-center min-h-[650px]">
            <h2 className="text-3xl font-black uppercase tracking-[0.5em] text-black mb-16">SIGURNOST BUDŽETA</h2>
            <div className="relative mb-12 flex items-center justify-center w-full h-full">
              <svg className="w-full h-auto max-w-xl transform -rotate-90 aspect-square">
                <circle cx="200" cy="200" r="180" stroke="#F1F5F9" strokeWidth="35" fill="transparent" />
                <motion.circle
                  cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="35" fill="transparent"
                  strokeDasharray="1131"
                  initial={{ strokeDashoffset: 1131 }}
                  animate={{ strokeDashoffset: 1131 - (Math.max(0, Math.min(stats.cistaDobit / 60000, 1)) * 1131) }}
                  transition={{ duration: 1.5 }}
                  className={stats.isSustainable ? "text-emerald-500" : "text-red-600"}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {stats.isSustainable ? <ShieldCheck className="text-emerald-500 mb-6" size={160} /> : <ShieldAlert className="text-red-600 mb-6 animate-pulse" size={160} />}
                <div className={`text-2xl font-black uppercase tracking-[0.6em] ${stats.isSustainable ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stats.isSustainable ? 'FISKALNO SAMOODRŽIVO' : 'KRITIČAN RIZIK'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOK KAPITALA - SPOREDNI GRAFIKON (30%) */}
        <div className="xl:col-span-4">
          <div className="p-12 rounded-[4rem] border-8 border-black bg-white shadow-2xl flex flex-col h-full min-h-[650px]">
             <h2 className="text-xl font-black uppercase tracking-[0.4em] text-black mb-12">TOK KAPITALA</h2>
             <div className="flex-1 w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} margin={{top: 20, right: 20, left: 0, bottom: 40}}>
                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} dy={20} stroke="#000000" />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                      contentStyle={{ borderRadius: '32px', border: '6px solid black', boxShadow: '0 35px 60px -15px rgba(0,0,0,0.3)', padding: '30px' }}
                      formatter={(val: number) => [<LocalFormattedCurrency value={val} className="text-2xl" />, 'Iznos']}
                    />
                    <Bar dataKey="val" radius={[12, 12, 12, 12]}>
                      {waterfallData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                    <ReferenceLine y={0} stroke="#000000" strokeWidth={4} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>

      {/* TABELA ZAPOSLENIKA - PUNA ŠIRINA */}
      <div className="w-full relative z-10 mb-16">
        <div className="bg-white border-8 border-black rounded-[4rem] shadow-2xl overflow-hidden flex flex-col w-full">
          <div className="p-10 border-b-8 border-black flex justify-between items-center bg-slate-50">
             <h3 className="text-3xl font-black uppercase tracking-[0.3em] flex items-center gap-6">
               <Users size={48} /> MATRICA ZAPOSLENIKA 
               {activeCatFilter !== 'ALL' && <span className="text-emerald-600 text-sm ml-2 font-mono tracking-normal">(CAT {activeCatFilter})</span>}
               {activeMaFilter !== 'ALL' && <span className="text-emerald-600 text-sm ml-2 font-mono tracking-normal">({activeMaFilter === 'MA_ONLY' ? 'MA' : 'NO MA'})</span>}
               {activeYearFilter !== 'ALL' && <span className="text-emerald-600 text-sm ml-2 font-mono tracking-normal">({activeYearFilter === 'BEFORE_2020' ? '< 2020' : '> 2020'})</span>}
             </h3>
             <span className="text-lg text-black font-black uppercase tracking-widest border-4 border-black px-8 py-4 rounded-full bg-white shadow-md">{visibleEmployees.length} POZICIJA PRIKAZANO</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-20 shadow-xl">
                <tr className="text-sm font-black uppercase tracking-[0.4em] text-black border-b-8 border-black">
                  <th className="px-12 py-8 whitespace-nowrap w-1/4">ZAPOSLENIK / ULOGA</th>
                  <th className="px-6 py-8 text-center whitespace-nowrap">LOJALNOST</th>
                  <th className="px-6 py-8 text-center whitespace-nowrap">MA</th>
                  <th className="px-8 py-8 text-right whitespace-nowrap">BAZNI NETO</th>
                  <th className="px-8 py-8 text-right text-emerald-700 whitespace-nowrap">NOVI NETO</th>
                  <th className="px-12 py-8 text-right text-red-600 whitespace-nowrap">BRUTO TERET</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-slate-100">
                {visibleEmployees.map((emp) => {
                  const loyalty = calculateLoyaltyBonus(emp.start);
                  const raiseNet = emp.targetNet - emp.currentNet;
                  const raiseBruto = raiseNet * BRUTO_FACTOR;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-all duration-500 group">
                      <td className="px-12 py-10">
                        <div className="font-black text-3xl text-black uppercase tracking-tighter">{privacyMode ? `RADNIK ID #${emp.id}` : emp.name}</div>
                        <div className="text-sm text-slate-500 font-black uppercase mt-2 tracking-[0.2em]">{emp.role}</div>
                      </td>
                      <td className="px-6 py-10 text-center">
                        <span className={`text-2xl font-black ${loyalty > 0 ? 'text-emerald-600' : 'text-slate-200'}`}>+{loyalty}%</span>
                      </td>
                      <td className="px-6 py-10 text-center">
                        {emp.ma ? <Award size={40} className="text-black mx-auto" /> : <span className="opacity-5">-</span>}
                      </td>
                      <td className="px-8 py-10 text-right">
                        <LocalFormattedCurrency value={emp.currentNet} className="text-lg opacity-40" />
                      </td>
                      <td className="px-8 py-10 text-right">
                        <LocalFormattedCurrency value={emp.targetNet} className="text-4xl font-black text-black" />
                        <div className="text-xs text-emerald-600 font-black uppercase mt-2">RAST: +{formattedCurrency(raiseNet)}</div>
                      </td>
                      <td className="px-12 py-10 text-right">
                        <LocalFormattedCurrency value={raiseBruto} className="text-4xl font-black text-red-600" />
                        <div className="text-xs text-red-600/40 font-black uppercase mt-2">KOEFICIJENT 1.63</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="bg-black text-white p-12 grid grid-cols-1 md:grid-cols-3 gap-12 shadow-[0_-30px_70px_rgba(0,0,0,0.5)] z-30">
             <div className="flex flex-col">
               <span className="text-xs font-black uppercase tracking-[0.6em] text-slate-500 mb-4">UKUPNI BAZNI NETO</span>
               <LocalFormattedCurrency value={totals.totalCurrentNet} className="text-3xl font-black text-white opacity-50" />
             </div>
             <div className="flex flex-col border-l-4 border-slate-800 pl-12">
               <span className="text-xs font-black uppercase tracking-[0.6em] text-emerald-500 mb-4">UKUPNI NOVI NETO</span>
               <LocalFormattedCurrency value={totals.totalTargetNet} className="text-4xl font-black text-emerald-400" />
             </div>
             <div className="flex flex-col border-l-8 border-emerald-600 pl-12 bg-emerald-950/30 p-8 rounded-3xl shadow-emerald-500/20 shadow-xl">
               <span className="text-xs font-black uppercase tracking-[0.6em] text-emerald-500 mb-4">UKUPNI BRUTO TERET</span>
               <LocalFormattedCurrency value={totals.totalBrutoCost} className="text-5xl font-black text-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mt-4 italic">FINALNI MJESEČNI TROŠAK STRATEGIJE</span>
             </div>
          </div>
        </div>
      </div>

      {/* ZBIRNI TROŠKOVI PO GRUPAMA */}
      <div className="w-full mb-16 relative z-10">
        <h3 className="text-4xl font-black uppercase tracking-[0.4em] text-black mb-10 flex items-center gap-6">
          <PieChart size={40} /> ZBIRNI TROŠKOVI PO GRUPAMA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.categorySummaries.map((catSum) => (
            <div key={catSum.cat} className="p-10 rounded-[3rem] border-8 border-black bg-white shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-black text-white px-6 py-2 rounded-full font-black text-2xl">{catSum.cat}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{catSum.count} zaposlenika</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Teret povišica</span>
                  </div>
                </div>
                <h4 className="text-2xl font-black uppercase leading-tight mb-8 min-h-[4rem] flex items-center">{catSum.label}</h4>
              </div>
              <div className="border-t-4 border-slate-100 pt-6 mt-4">
                <LocalFormattedCurrency value={catSum.totalRaiseCostBruto} className="text-4xl font-black" />
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 italic">UKUPNO BRUTO (1.63)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KUMULATIVNI BRUTO TROŠAK PO PERIODU ZAPOSLENJA (LOJALNOSTI) */}
      <div className="w-full mb-16 relative z-10">
        <div className="p-12 rounded-[4rem] border-8 border-black bg-white shadow-2xl flex flex-col min-h-[500px]">
          <h3 className="text-3xl font-black uppercase tracking-[0.4em] text-black mb-12 flex items-center gap-6">
            <BarChart3 size={40} /> TERET PO STUBU LOJALNOSTI (BRUTO)
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={loyaltyCostData} margin={{top: 20, right: 30, left: 60, bottom: 20}}>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="period" 
                  fontSize={14} 
                  fontWeight="900" 
                  axisLine={false} 
                  tickLine={false} 
                  dy={15} 
                  stroke="#000"
                />
                <YAxis 
                  fontSize={12} 
                  fontWeight="700" 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                  contentStyle={{ borderRadius: '2rem', border: '4px solid black', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '20px' }}
                  formatter={(val: number) => [<LocalFormattedCurrency value={val} className="text-xl" />, 'Kumulativni Bruto']}
                />
                <Bar dataKey="iznos" radius={[20, 20, 0, 0]} barSize={120}>
                  {loyaltyCostData.map((entry, index) => (
                    <Cell key={`cell-loyalty-${index}`} fill={entry.boja} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-center gap-10">
            {loyaltyCostData.map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: entry.boja}} />
                <span className="text-xs font-black uppercase tracking-widest">{entry.period}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER DUGMADI ZA MATRICU */}
      <div className="w-full mb-16 relative z-10">
        <div className="bg-slate-50 border-8 border-black rounded-[4rem] p-12 flex flex-col gap-12 shadow-2xl">
          
          {/* Grupa 1: Kategorije */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b-4 border-black/5 pb-10">
            <div className="flex items-center gap-8">
              <Filter size={48} className="text-black" />
              <div className="flex flex-col">
                <h3 className="text-3xl font-black uppercase tracking-widest leading-none">FILTRIRANJE KATEGORIJA</h3>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2">Prikaz specifičnih departmana</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 w-full md:w-auto justify-end">
              <button 
                onClick={() => setActiveCatFilter('ALL')}
                className={`flex-1 md:px-12 py-6 rounded-3xl font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 ${activeCatFilter === 'ALL' ? 'bg-black text-white scale-105 ring-8 ring-slate-200' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SVE KATEGORIJE
              </button>
              <button 
                onClick={() => setActiveCatFilter('CD')}
                className={`flex-1 md:px-12 py-6 rounded-3xl font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 ${activeCatFilter === 'CD' ? 'bg-emerald-600 text-white scale-105 ring-8 ring-emerald-100' : 'bg-white text-emerald-600 border-4 border-emerald-600 hover:bg-emerald-50'}`}
              >
                SAMO C I D
              </button>
            </div>
          </div>

          {/* Grupa 2: Uprava i Odgajatelji (A&B) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b-4 border-black/5 pb-10">
            <div className="flex items-center gap-8">
              <LayoutGrid size={48} className="text-black" />
              <div className="flex flex-col">
                <h3 className="text-3xl font-black uppercase tracking-widest leading-none">UPRAVA I ODGAJATELJI (A&B)</h3>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2">Strateško filtriranje kategorija A i B</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 w-full md:w-auto justify-end">
              <button 
                onClick={() => setActiveCatFilter('AB')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeCatFilter === 'AB' ? 'bg-black text-white scale-105 ring-4 ring-slate-200' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SAMO A I B
              </button>
              <button 
                onClick={() => setActiveCatFilter('CD')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeCatFilter === 'CD' ? 'bg-black text-white scale-105 ring-4 ring-red-400' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SAKRIJ A I B
              </button>
            </div>
          </div>

          {/* Grupa 3: MA Status */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b-4 border-black/5 pb-10">
            <div className="flex items-center gap-8">
              <GraduationCap size={48} className="text-black" />
              <div className="flex flex-col">
                <h3 className="text-3xl font-black uppercase tracking-widest leading-none">MA STATUS (EKSPERTIZA)</h3>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2">Filtriranje po magistarskom zvanju</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 w-full md:w-auto justify-end">
              <button 
                onClick={() => setActiveMaFilter('ALL')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeMaFilter === 'ALL' ? 'bg-black text-white scale-105 ring-4 ring-slate-200' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SVI STATUSI
              </button>
              <button 
                onClick={() => setActiveMaFilter('MA_ONLY')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeMaFilter === 'MA_ONLY' ? 'bg-black text-white scale-105 ring-4 ring-emerald-400' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SVE SA MA
              </button>
              <button 
                onClick={() => setActiveMaFilter('NO_MA')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeMaFilter === 'NO_MA' ? 'bg-black text-white scale-105 ring-4 ring-red-400' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SAMO BEZ MA
              </button>
            </div>
          </div>

          {/* Grupa 4: Godina početka rada */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-4">
            <div className="flex items-center gap-8">
              <CalendarDays size={48} className="text-black" />
              <div className="flex flex-col">
                <h3 className="text-3xl font-black uppercase tracking-widest leading-none">GODINA POČETKA RADA</h3>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2">Filtriranje po stažu (prije/poslije 2020.)</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 w-full md:w-auto justify-end">
              <button 
                onClick={() => setActiveYearFilter('ALL')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeYearFilter === 'ALL' ? 'bg-black text-white scale-105 ring-4 ring-slate-200' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                SVE GODINE
              </button>
              <button 
                onClick={() => setActiveYearFilter('BEFORE_2020')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeYearFilter === 'BEFORE_2020' ? 'bg-black text-white scale-105 ring-4 ring-emerald-400' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                PRIJE 2020.
              </button>
              <button 
                onClick={() => setActiveYearFilter('AFTER_2020')}
                className={`flex-1 md:px-10 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 ${activeYearFilter === 'AFTER_2020' ? 'bg-black text-white scale-105 ring-4 ring-indigo-400' : 'bg-white text-black border-4 border-black hover:bg-slate-100'}`}
              >
                POSLIJE 2020.
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL IZVJEŠTAJA */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleReport} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 100 }}
              className="relative w-full max-w-none mx-4 lg:mx-12 bg-white text-black rounded-[5rem] overflow-y-auto p-20 md:p-32 shadow-2xl max-h-[95vh] font-serif border-[20px] border-black"
            >
              <button onClick={toggleReport} className="absolute top-16 right-16 text-slate-300 hover:text-black transition-colors no-print">
                <X size={80} />
              </button>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16 mb-32 border-b-[12px] border-black pb-20">
                <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="Logo" className="h-32" />
                <div className="text-right font-sans">
                  <div className="text-2xl font-black uppercase tracking-[0.6em] text-emerald-700">STRATEGIJA 2026</div>
                  <div className="text-slate-400 font-mono text-lg uppercase font-bold mt-4">POVJERLJIVO | DOKUMENT REVIZIJE: FINAL-X</div>
                </div>
              </div>

              <div className="space-y-32">
                <h2 className="text-7xl md:text-[12rem] font-black leading-none tracking-tighter text-black uppercase mb-12">
                  FISKALNA<br/>ODRŽIVOST
                </h2>

                <section className="space-y-16">
                  <h4 className="text-3xl font-black uppercase tracking-[0.4em] text-black flex items-center gap-10 font-sans">
                    <div className="w-20 h-20 bg-black flex items-center justify-center text-white rounded-full text-4xl">1</div>
                    MISIJA I INSTITUCIONALNI MIR
                  </h4>
                  <p className="text-4xl md:text-6xl leading-tight text-black font-medium">
                    Ovim dokumentom se definira implementacija <span className="font-black italic underline decoration-8">Strategije 2026</span>, strateškog okvira čiji je primarni cilj uspostavljanje dugoročnog institucionalnog mira i potpuna eliminacija subjektivnosti u sistemu nagrađivanja. Model "Matematičke pravednosti" garantira da svaki član kolektiva bude vrijednovan isključivo kroz objektivne i mjerljive faktore rasta.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div className="bg-slate-50 p-24 rounded-[5rem] space-y-12 border-8 border-black shadow-2xl">
                    <h4 className="text-2xl font-black uppercase tracking-widest text-emerald-700 flex items-center gap-8 font-sans"><Zap size={48} /> II. STUB LOJALNOSTI</h4>
                    <p className="text-3xl text-black leading-relaxed italic font-medium">
                      Lojalnost je temelj institucionalne memorije IMH-a. Sistem povišica do <span className="font-black">15% za deceniju posvećenosti</span> nije samo finansijska stavka, već duboko priznanje za godine rada na izgradnji vizije.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-24 rounded-[5rem] space-y-12 border-8 border-black shadow-2xl">
                    <h4 className="text-2xl font-black uppercase tracking-widest text-black flex items-center gap-8 font-sans"><Award size={48} /> III. STUB EKSPERTIZE</h4>
                    <p className="text-3xl text-black leading-relaxed italic font-medium">
                      Kontinuirano akademsko usavršavanje kroz <span className="font-black">dodatak od 5% za Magistarski stepen (MA)</span> osigurava elitni standard naših usluga i potiče vrhunsku stručnost tima.
                    </p>
                  </div>
                </div>

                <section className="p-32 bg-emerald-50 rounded-[6rem] border-[16px] border-emerald-600 shadow-inner">
                  <h4 className="text-3xl font-black uppercase tracking-widest text-emerald-800 flex items-center gap-10 mb-20 font-sans"><FileCheck size={64} /> IV. STRATEŠKI ŠTIT I SAMOODRŽIVOST</h4>
                  <div className="space-y-24">
                    <p className="text-4xl md:text-6xl leading-tight text-emerald-900 font-bold">
                      Planirana korekcija školarine od <span className="font-black underline decoration-[12px]">{tuitionIncrease}%</span> predstavlja ključni strateški štit. Ova mjera omogućava Ustanovi da apsorbira bruto teret povišica od <span className="font-black"><LocalFormattedCurrency value={totals.totalBrutoCost} /></span> mjesečno.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 font-sans">
                      <div className="text-center p-12">
                        <div className="text-xl uppercase font-black text-emerald-700 mb-8 tracking-[0.2em]">PRIRAST PRIHODA</div>
                        <LocalFormattedCurrency value={stats.dodatniPrihod} className="text-7xl font-black text-emerald-800" />
                      </div>
                      <div className="text-center p-12">
                        <div className="text-xl uppercase font-black text-red-700 mb-8 tracking-[0.2em]">BRUTO GODIŠNJI TERET</div>
                        <div className="text-7xl font-mono font-black text-red-600">
                          -<LocalFormattedCurrency value={totals.totalBrutoCost * 12} />
                        </div>
                      </div>
                      <div className="text-center p-20 bg-white rounded-[4rem] shadow-2xl border-8 border-emerald-600 scale-110">
                        <div className="text-xl uppercase font-black text-emerald-800 mb-8 tracking-[0.2em]">OPERATIVNI SUFICIT</div>
                        <LocalFormattedCurrency value={stats.cistaDobit} className="text-8xl font-black text-black" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="pt-32 border-t-[16px] border-black">
                  <div className="flex items-center gap-12 mb-16">
                    <CheckCircle2 size={100} className="text-emerald-600" />
                    <h4 className="text-6xl font-black text-black uppercase tracking-tighter font-sans">FINALNI ZAKLJUČAK</h4>
                  </div>
                  <p className="text-5xl md:text-8xl font-black text-black leading-none uppercase italic">
                    "MODEL JE <span className="text-emerald-600 underline decoration-[20px]">FISKALNO SAMOODRŽIV</span>. OMOGUĆAVA REKORDNO POVEĆANJE PLATA UZ ISTOVREMENO JAČANJE PROFITNE MARŽE USTANOVE."
                  </p>
                </section>

                <div className="pt-64 flex justify-between items-end gap-48 no-print font-sans">
                   <div className="flex-1 text-center border-t-8 border-black pt-16">
                      <div className="text-3xl uppercase font-black text-black tracking-[0.6em] mb-8">UPRAVA USTANOVE</div>
                      <div className="text-xl text-slate-400 font-bold uppercase tracking-widest">DIGITALNO POTPISANO: IMH-ADMIN-CHIEF</div>
                   </div>
                   <div className="flex-1 text-center border-t-8 border-black pt-16">
                      <div className="text-3xl uppercase font-black text-black tracking-[0.6em] mb-8">OSNIVAČ / VLASNIK</div>
                      <div className="text-xl text-slate-400 font-bold uppercase tracking-widest">ODOBRENO ZA HITNU IMPLEMENTACIJU</div>
                   </div>
                </div>
              </div>

              <div className="mt-48 flex flex-col md:flex-row gap-12 no-print font-sans pb-32">
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 py-12 bg-black text-white rounded-[3rem] font-black text-4xl uppercase tracking-[0.3em] flex items-center justify-center gap-8 shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Printer size={64} /> ISPRINTAJ SLUŽBENI DOKUMENT
                </button>
                <button 
                  onClick={toggleReport}
                  className="px-32 py-12 border-[12px] border-black text-black rounded-[3rem] font-black text-4xl uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                >
                  ZATVORI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="w-full py-24 mt-24 border-t-8 border-black flex flex-col items-center gap-12 opacity-50 select-none no-print">
        <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="Footer Logo" className="h-20 grayscale" />
        <div className="text-lg font-black uppercase tracking-[1em] text-black">
          © 2026 INTERNATIONAL MONTESSORI HOUSE • SARAJEVO
        </div>
      </footer>
    </div>
  );
};

export default App;
