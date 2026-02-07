
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
  PieChart,
  Filter,
  GraduationCap,
  CalendarDays,
  BarChart3,
  Lock,
  ArrowRight
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

// --- UTILITIES ---

// Globalni formatter za bosansku valutu (1.234,56 KM)
const formatKM = (val: number) => {
  return new Intl.NumberFormat('bs-BA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(val) + " KM";
};

// React komponenta za prikaz valute
const CurrencyDisplay: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const formatted = new Intl.NumberFormat('bs-BA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(value);
  return <span className={`font-mono whitespace-nowrap ${className}`}>{formatted} KM</span>;
};

// --- LOGIN KOMPONENTA ---
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'imh2026') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-white border-4 border-black p-12 rounded-[3rem] shadow-2xl text-center"
      >
        <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="IMH Logo" className="h-24 mx-auto mb-8" />
        <h1 className="text-2xl font-black uppercase tracking-widest mb-2">IMH Salary Moderator</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mb-10">Protected Financial Environment</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="UNESITE PRISTUPNU ŠIFRU"
              className={`w-full bg-slate-50 border-4 ${error ? 'border-red-500' : 'border-slate-200'} p-4 pl-12 rounded-xl font-bold text-center outline-none focus:border-black transition-colors uppercase placeholder:text-slate-300`}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white p-5 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            Pristupi <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
      <div className="mt-8 text-xs font-black uppercase tracking-[0.5em] text-slate-300">
        © 2026 International Montessori House
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Totali za sticky footer - OPREZNA KALKULACIJA
  const totals = useMemo(() => {
    const totalCurrentNet = visibleEmployees.reduce((sum, e) => sum + e.currentNet, 0);
    const totalTargetNet = visibleEmployees.reduce((sum, e) => sum + e.targetNet, 0);
    const totalNetIncrease = totalTargetNet - totalCurrentNet;
    // Formula: (Nova Plata - Stara Plata) * 1.63
    const totalBrutoCost = visibleEmployees.reduce((sum, e) => sum + (e.targetNet - e.currentNet) * BRUTO_FACTOR, 0);
    
    return { totalCurrentNet, totalTargetNet, totalNetIncrease, totalBrutoCost };
  }, [visibleEmployees]);

  // Totali za cijelu firmu (neovisno o filterima) za KPI kartice
  const globalTotals = useMemo(() => {
     const totalNetIncrease = employees.reduce((sum, e) => sum + (e.targetNet - e.currentNet), 0);
     return {
         totalTargetNet: employees.reduce((sum, e) => sum + e.targetNet, 0),
         totalBrutoCost: employees.reduce((sum, e) => sum + (e.targetNet - e.currentNet) * BRUTO_FACTOR, 0)
     }
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
      { name: 'UPRAVA', val: -costA, fill: '#0f172a' }, // Dark Slate
      { name: 'ODGAJATELJI', val: -costB, fill: '#334155' }, // Slate 700
      { name: 'POMOĆNO', val: -costCD, fill: '#64748b' }, // Slate 500
      { name: 'SUFICIT', val: dobit, fill: stats.isSustainable ? '#10B981' : '#EF4444' },
    ];
  }, [stats]);

  const toggleReport = useCallback(() => setIsReportOpen(prev => !prev), []);
  const togglePrivacy = useCallback(() => setPrivacyMode(prev => !prev), []);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans w-full max-w-none antialiased flex flex-col p-4 md:p-8">
      
      {/* Background Ambience */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${stats.isSustainable ? 'opacity-[0.02] bg-emerald-500' : 'opacity-[0.05] bg-red-500'}`} />

      {/* HEADER */}
      <header className="w-full mb-12 flex flex-col 2xl:flex-row items-center justify-between gap-8 relative z-10 border-b-8 border-black pb-10 no-print">
        <div className="flex items-center gap-8">
          <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="IMH Logo" className="h-[80px] object-contain" />
          <div className="h-16 w-2 bg-black hidden md:block"></div>
          <div>
            <h1 className="text-4xl xl:text-5xl font-serif font-black tracking-tighter text-black uppercase">
              Matrica Strategije 2026
            </h1>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mt-1">International Montessori House</p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center gap-6 w-full 2xl:w-auto">
          {/* Slider Control */}
          <div className="flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-3xl border-4 border-black w-full xl:w-auto shadow-xl">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">KOREKCIJA ŠKOLARINE</span>
              <span className="text-black font-black text-4xl">+{tuitionIncrease}%</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.5"
              value={tuitionIncrease}
              onChange={(e) => setTuitionIncrease(parseFloat(e.target.value))}
              className="w-48 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
          
          <div className="flex gap-4 w-full xl:w-auto">
            <button 
              onClick={toggleReport} 
              className="flex-1 xl:flex-none px-8 py-4 bg-black text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <FileText size={24} /> GENERIŠI IZVJEŠTAJ
            </button>
            
            <button 
              onClick={togglePrivacy}
              className="p-4 rounded-2xl border-4 border-black bg-white text-black shadow-xl hover:bg-slate-50 transition-all active:scale-95"
              title={privacyMode ? "Prikaži podatke" : "Sakrij podatke"}
            >
              {privacyMode ? <EyeOff size={28} /> : <Eye size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* STRATEŠKE KARTICE (KPI) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12 relative z-10 no-print">
        <motion.div className="p-8 rounded-[2.5rem] border-4 border-black bg-white shadow-xl flex flex-col justify-between h-56 group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Prirast Prihoda</span>
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700"><TrendingUp size={28} /></div>
          </div>
          <CurrencyDisplay value={stats.dodatniPrihod} className="text-4xl 2xl:text-5xl font-black text-black" />
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{width: '100%'}}></div>
          </div>
        </motion.div>

        <motion.div className="p-8 rounded-[2.5rem] border-4 border-black bg-white shadow-xl flex flex-col justify-between h-56 group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Bruto Trošak</span>
            <div className="p-3 bg-red-100 rounded-2xl text-red-700"><Scale size={28} /></div>
          </div>
          <div className="text-4xl 2xl:text-5xl font-mono font-black text-black tracking-tight">
            -<CurrencyDisplay value={globalTotals.totalBrutoCost} />
          </div>
          <div className="text-xs font-bold text-red-500 uppercase tracking-widest mt-2">Faktor 1.63 (Canton SA)</div>
        </motion.div>

        <motion.div className="p-8 rounded-[2.5rem] border-4 border-black bg-white shadow-xl flex flex-col justify-between h-56 group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Neto Isplatni Fond</span>
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-700"><Users size={28} /></div>
          </div>
          <CurrencyDisplay value={globalTotals.totalTargetNet} className="text-4xl 2xl:text-5xl font-black text-black" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Ciljana vrijednost 2026</div>
        </motion.div>

        <motion.div className={`p-8 rounded-[2.5rem] border-4 ${stats.isSustainable ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'} shadow-xl flex flex-col justify-between h-56 transition-colors duration-500`}>
          <div className="flex justify-between items-start">
            <span className={`text-xs font-black uppercase tracking-[0.2em] ${stats.isSustainable ? 'text-emerald-700' : 'text-red-700'}`}>Operativni Suficit</span>
            <div className={`p-3 rounded-2xl ${stats.isSustainable ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
              <Wallet size={28} />
            </div>
          </div>
          <CurrencyDisplay 
            value={stats.cistaDobit} 
            className={`text-4xl 2xl:text-5xl font-black ${stats.isSustainable ? 'text-emerald-700' : 'text-red-700'}`} 
          />
          <div className={`text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-2 ${stats.isSustainable ? 'text-emerald-700' : 'text-red-700'}`}>
            {stats.isSustainable ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            {stats.isSustainable ? 'ODRŽIVO' : 'RIZIČNO'}
          </div>
        </motion.div>
      </div>

      {/* CHARTS ROW (Full Width) */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12 relative z-10 no-print">
        
        {/* CHART 1: SIGURNOST BUDŽETA (50%) */}
        <div className="xl:col-span-6">
          <div className="p-10 rounded-[3rem] border-4 border-black bg-white shadow-2xl flex flex-col items-center justify-center text-center h-[500px]">
            <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-black mb-8 flex items-center gap-3">
              <ShieldCheck size={32} /> Sigurnost Budžeta
            </h2>
            <div className="relative flex items-center justify-center w-full h-full pb-8">
              <svg className="w-full h-full max-h-[300px] transform -rotate-90" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="160" stroke="#f1f5f9" strokeWidth="30" fill="transparent" />
                <motion.circle
                  cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="30" fill="transparent"
                  strokeDasharray="1005"
                  initial={{ strokeDashoffset: 1005 }}
                  animate={{ strokeDashoffset: 1005 - (Math.max(0, Math.min(stats.cistaDobit / 40000, 1)) * 1005) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={stats.isSustainable ? "text-emerald-500" : "text-red-600"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pb-8">
                <div className={`text-4xl font-black ${stats.isSustainable ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stats.isSustainable ? '100%' : 'KRITIČNO'}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">STATUS</div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 2: TOK KAPITALA (Waterfall) (50%) */}
        <div className="xl:col-span-6">
          <div className="p-10 rounded-[3rem] border-4 border-black bg-white shadow-2xl flex flex-col h-[500px]">
             <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-black mb-8 flex items-center gap-3">
               <TrendingUp size={32} /> Tok Kapitala
             </h2>
             <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} margin={{top: 20, right: 10, left: 0, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={10} 
                      fontWeight="800" 
                      axisLine={false} 
                      tickLine={false} 
                      dy={10} 
                      stroke="#64748b" 
                      interval={0}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black text-white p-4 rounded-xl shadow-xl">
                              <p className="font-bold text-sm mb-1">{payload[0].payload.name}</p>
                              <p className="font-mono text-emerald-400 text-lg">{formatKM(payload[0].value as number)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
                    <Bar dataKey="val" radius={[6, 6, 6, 6]} barSize={60}>
                      {waterfallData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="w-full mb-8 relative z-10 no-print">
        <div className="bg-white border-4 border-black rounded-[3rem] p-8 shadow-xl">
           <div className="flex flex-col xl:flex-row gap-8 justify-between">
              
              {/* Filter: Categories */}
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <Filter size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Kategorije</span>
                 </div>
                 <div className="flex gap-2">
                    {['ALL', 'AB', 'CD'].map((opt) => (
                       <button
                         key={opt}
                         onClick={() => setActiveCatFilter(opt as any)}
                         className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all border-2 ${activeCatFilter === opt ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                       >
                         {opt === 'ALL' ? 'Sve' : opt === 'AB' ? 'A & B' : 'C & D'}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Filter: MA Status */}
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <GraduationCap size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Ekspertiza (MA)</span>
                 </div>
                 <div className="flex gap-2">
                    {['ALL', 'MA_ONLY', 'NO_MA'].map((opt) => (
                       <button
                         key={opt}
                         onClick={() => setActiveMaFilter(opt as any)}
                         className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all border-2 ${activeMaFilter === opt ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                       >
                         {opt === 'ALL' ? 'Sve' : opt === 'MA_ONLY' ? 'Sa MA' : 'Bez MA'}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Filter: Year */}
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <CalendarDays size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Staž</span>
                 </div>
                 <div className="flex gap-2">
                    {['ALL', 'BEFORE_2020', 'AFTER_2020'].map((opt) => (
                       <button
                         key={opt}
                         onClick={() => setActiveYearFilter(opt as any)}
                         className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all border-2 ${activeYearFilter === opt ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                       >
                         {opt === 'ALL' ? 'Sve' : opt === 'BEFORE_2020' ? '< 2020' : '> 2020'}
                       </button>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* MAIN TABLE (STICKY FOOTER IMPLEMENTED) */}
      <div className="w-full relative z-10 mb-12 no-print">
        <div className="bg-white border-4 border-black rounded-[3rem] shadow-2xl overflow-hidden flex flex-col w-full h-[800px]"> {/* Fixed height for sticky behavior */}
          
          <div className="p-8 border-b-4 border-black flex justify-between items-center bg-slate-50 shrink-0">
             <h3 className="text-2xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
               <Users size={32} /> Matrica Zaposlenika 
               <span className="px-4 py-1 bg-black text-white text-xs rounded-full">{visibleEmployees.length}</span>
             </h3>
          </div>
          
          <div className="overflow-auto flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-20 shadow-sm ring-1 ring-black/5">
                <tr className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b-2 border-slate-100">
                  <th className="px-8 py-6 whitespace-nowrap bg-white">Zaposlenik</th>
                  <th className="px-4 py-6 text-center whitespace-nowrap bg-white">Kat.</th>
                  <th className="px-4 py-6 text-center whitespace-nowrap bg-white">Početak</th>
                  <th className="px-4 py-6 text-center whitespace-nowrap bg-white">Lojalnost</th>
                  <th className="px-4 py-6 text-center whitespace-nowrap bg-white">MA</th>
                  <th className="px-6 py-6 text-right whitespace-nowrap bg-white">Bazni Neto</th>
                  <th className="px-6 py-6 text-right text-emerald-700 whitespace-nowrap bg-white">Novi Neto</th>
                  <th className="px-8 py-6 text-right text-red-600 whitespace-nowrap bg-white">Bruto Teret</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleEmployees.map((emp) => {
                  const loyalty = calculateLoyaltyBonus(emp.start);
                  const raiseNet = emp.targetNet - emp.currentNet;
                  const raiseBruto = raiseNet * BRUTO_FACTOR;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="font-bold text-lg text-black">{privacyMode ? `ZAPOSLENIK #${emp.id}` : emp.name}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{emp.role}</div>
                      </td>
                      <td className="px-4 py-4 text-center font-black text-slate-300">{emp.cat}</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-500">{emp.start}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${loyalty > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                          +{loyalty}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {emp.ma ? <div className="flex justify-center"><Award size={20} className="text-amber-500" /></div> : <span className="text-slate-200">-</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <CurrencyDisplay value={emp.currentNet} className="text-slate-400" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <CurrencyDisplay value={emp.targetNet} className="text-xl font-black text-black" />
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex flex-col items-end">
                           <CurrencyDisplay value={raiseBruto} className="text-red-600 font-bold" />
                           <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">+{formatKM(raiseNet)} NETO</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              
              {/* STICKY FOOTER */}
              <tfoot className="sticky bottom-0 bg-black text-white z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                 <tr>
                   <td colSpan={5} className="px-8 py-6 text-right font-black uppercase tracking-[0.2em] text-slate-400 text-sm">
                     UKUPNO (PRIKAZANO):
                   </td>
                   <td className="px-6 py-6 text-right font-mono font-bold text-slate-300">
                     {formatKM(totals.totalCurrentNet)}
                   </td>
                   <td className="px-6 py-6 text-right font-mono font-bold text-emerald-400 text-lg">
                     {formatKM(totals.totalTargetNet)}
                   </td>
                   <td className="px-8 py-6 text-right font-mono font-black text-white text-xl">
                     {formatKM(totals.totalBrutoCost)}
                   </td>
                 </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* ADDITIONAL CHARTS AREA */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12 relative z-10 no-print">
         
         {/* LOYALTY CHART */}
         <div className="p-10 rounded-[3rem] border-4 border-black bg-white shadow-2xl h-[500px] flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <BarChart3 size={24} /> Teret po lojalnosti
            </h3>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loyaltyCostData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="period" 
                    fontSize={11} 
                    fontWeight="700" 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.03)'}}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border-2 border-black p-4 rounded-xl shadow-lg">
                            <p className="font-bold text-xs uppercase text-slate-400 mb-1">{payload[0].payload.period}</p>
                            <p className="font-mono text-xl font-black">{formatKM(payload[0].value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="iznos" radius={[8, 8, 8, 8]} barSize={50}>
                    {loyaltyCostData.map((entry, index) => (
                      <Cell key={`cell-loyalty-${index}`} fill={entry.boja} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* GROUP COSTS */}
         <div className="grid grid-cols-2 gap-4 h-[500px]">
            {stats.categorySummaries.map((catSum) => (
              <div key={catSum.cat} className="p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-black transition-colors flex flex-col justify-between shadow-lg">
                 <div>
                   <div className="flex justify-between items-center mb-2">
                      <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-lg font-black">{catSum.cat}</span>
                      <span className="text-xs font-bold text-slate-400">{catSum.count} ZAP.</span>
                   </div>
                   <h4 className="font-bold leading-tight text-sm uppercase">{catSum.label}</h4>
                 </div>
                 <div>
                   <div className="text-2xl font-black tracking-tight">{formatKM(catSum.totalRaiseCostBruto)}</div>
                   <div className="text-[10px] font-bold text-slate-300 uppercase mt-1">BRUTO TERET</div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* REPORT MODAL (PRINT READY) */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 p-0 md:p-8 print:p-0 print:bg-white print:static print:block">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-5xl min-h-screen md:min-h-0 md:rounded-[3rem] p-12 md:p-20 shadow-2xl relative print:shadow-none print:w-full print:max-w-none print:p-0"
            >
              <button onClick={toggleReport} className="absolute top-8 right-8 p-4 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors no-print">
                <X size={24} />
              </button>

              {/* REPORT HEADER */}
              <div className="flex justify-between items-end border-b-8 border-black pb-8 mb-16">
                 <div>
                    <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="IMH" className="h-24 mb-6" />
                    <div className="text-4xl font-black uppercase tracking-tighter">Strategija 2026</div>
                    <div className="text-sm font-bold uppercase tracking-[0.4em] text-slate-500 mt-2">Službeni Dokument Revizije</div>
                 </div>
                 <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold uppercase text-slate-400">DATUM GENERISANJA</div>
                    <div className="font-mono font-bold text-lg">{new Date().toLocaleDateString('bs-BA')}</div>
                 </div>
              </div>

              {/* REPORT CONTENT */}
              <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                       <span className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-lg">1</span>
                       Institucionalni Mir
                    </h2>
                    
                    {/* DYNAMIC NARRATIVE LOGIC */}
                    {stats.isSustainable ? (
                        <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-800 text-justify">
                            Ovaj dokument potvrđuje punu finansijsku održivost tranzicije uz korekciju školarine od <span className="font-black bg-black text-white px-2">{tuitionIncrease}%</span>. Model 'Matematičke Pravednosti' uspješno apsorbuje bruto teret povišica, osiguravajući stabilan operativni suficit.
                        </p>
                    ) : (
                        <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-800 text-justify">
                            Ovaj dokument ukazuje na finansijsku neodrživost tranzicije uz trenutnu korekciju školarine od <span className="font-black bg-black text-white px-2">{tuitionIncrease}%</span>. Projekcija potvrđuje da mjesečni bruto teret povišica premašuje prirast prihoda, što zahtijeva hitnu reviziju modela.
                        </p>
                    )}
                 </section>

                 <section className="grid grid-cols-1 md:grid-cols-2 gap-12 print:grid-cols-2">
                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-black print:border">
                       <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">MJESEČNI BRUTO TERET</div>
                       <div className="text-5xl font-black text-black mb-2">{formatKM(globalTotals.totalBrutoCost)}</div>
                       <div className="text-xs font-bold text-red-500">PROJEKCIJA TROŠKA POVIŠICA</div>
                    </div>
                    <div className={`p-8 rounded-3xl border-2 border-black print:border ${stats.isSustainable ? 'bg-emerald-50' : 'bg-red-50'}`}>
                       <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">OPERATIVNI REZULTAT</div>
                       <div className={`text-5xl font-black mb-2 ${stats.isSustainable ? 'text-emerald-700' : 'text-red-700'}`}>{formatKM(stats.cistaDobit)}</div>
                       <div className="text-xs font-bold uppercase">{stats.isSustainable ? 'SUFICIT (ODRŽIVO)' : 'DEFICIT (NEODRŽIVO)'}</div>
                    </div>
                 </section>

                 <section className="print:break-inside-avoid">
                    <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                       <span className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full text-lg">2</span>
                       Verifikacija Parametara
                    </h2>
                    <table className="w-full text-sm text-left border-t-2 border-black">
                       <thead className="bg-slate-100 font-black uppercase">
                          <tr>
                             <th className="p-4">Parametar</th>
                             <th className="p-4 text-right">Vrijednost</th>
                             <th className="p-4 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200 font-bold">
                          <tr>
                             <td className="p-4">Faktor Bruto Plate</td>
                             <td className="p-4 text-right font-mono">1.63</td>
                             <td className="p-4 text-right text-emerald-600">VERIFIKOVANO</td>
                          </tr>
                          <tr>
                             <td className="p-4">Prirast Školarine</td>
                             <td className="p-4 text-right font-mono">+{tuitionIncrease}%</td>
                             <td className="p-4 text-right text-emerald-600">AKTIVNO</td>
                          </tr>
                          <tr>
                             <td className="p-4">Ukupno Zaposlenika</td>
                             <td className="p-4 text-right font-mono">{employees.length}</td>
                             <td className="p-4 text-right text-emerald-600">KOMPLETNO</td>
                          </tr>
                       </tbody>
                    </table>
                 </section>
              </div>

              {/* FOOTER / SIGNATURES */}
              <div className="mt-24 pt-12 border-t-4 border-black grid grid-cols-2 gap-20 print:mt-12">
                 <div className="text-center">
                    <div className="h-16 border-b-2 border-slate-300 mb-4"></div>
                    <div className="font-black uppercase tracking-widest">DIREKTOR USTANOVE</div>
                 </div>
                 <div className="text-center">
                    <div className="h-16 border-b-2 border-slate-300 mb-4"></div>
                    <div className="font-black uppercase tracking-widest">PREDSJEDNIK UPRAVNOG ODBORA</div>
                 </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-12 flex gap-4 no-print">
                 <button onClick={() => window.print()} className="flex-1 bg-black text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2">
                    <Printer /> Printaj Dokument
                 </button>
                 <button onClick={toggleReport} className="flex-1 bg-slate-100 text-black py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200">
                    Zatvori Pregled
                 </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="w-full py-12 text-center opacity-40 hover:opacity-100 transition-opacity no-print">
         <div className="flex items-center justify-center gap-2 mb-2">
            <Lock size={12} />
            <span className="text-xs font-bold uppercase tracking-widest">SECURE SYSTEM ACTIVE</span>
         </div>
         <p className="text-[10px] uppercase font-bold tracking-[0.2em]">© 2026 International Montessori House • Sarajevo</p>
      </footer>

    </div>
  );
};

export default App;
