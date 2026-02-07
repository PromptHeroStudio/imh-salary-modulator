
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Wallet, 
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  FileText,
  X,
  Printer,
  Info,
  Sun,
  Moon,
  Save,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis,
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid
} from 'recharts';

import { INITIAL_EMPLOYEES, BASELINE_REVENUE_2025 } from './constants';
import { Employee } from './types';
import { calculateStats, calculateNewNet, getLoyaltyBonus, getExpertiseBonus } from './services/financialEngine';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tuitionIncrease, setTuitionIncrease] = useState<number>(6);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const profitControls = useAnimation();

  const stats = useMemo(() => calculateStats(employees, tuitionIncrease), [employees, tuitionIncrease]);

  // Added groupSummaries to fix the "Cannot find name 'groupSummaries'" error
  const groupSummaries = useMemo(() => {
    const labels: Record<string, string> = {
      'A': 'Uprava i Pedagogija',
      'B': 'Odgajatelji',
      'C': 'Asistenti i Saradnici',
      'D': 'Tehničko osoblje'
    };
    return stats.categorySummaries.map(s => ({
      label: labels[s.cat] || `Grupa ${s.cat}`,
      value: s.totalNewGross
    }));
  }, [stats.categorySummaries]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [isDark]);

  useEffect(() => {
    profitControls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    });
  }, [tuitionIncrease, profitControls]);

  const toggleMA = (id: number) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ma: !e.ma } : e));
  };

  const formattedCurrency = (val: number) => {
    return new Intl.NumberFormat('bs-BA', { style: 'currency', currency: 'BAM', minimumFractionDigits: 2 }).format(val);
  };

  const waterfallData = [
    { name: 'Bazni Prihod', value: BASELINE_REVENUE_2025, color: '#475569' },
    { name: 'Novi Priliv', value: stats.revenueGrowth, color: '#10b981' },
    { name: 'Ukupni Bruto', value: -stats.totalNewGross, color: '#991b1b' },
    { name: 'Rezerva', value: stats.operationalBuffer, color: stats.isSustainable ? '#fbbf24' : '#ef4444' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-10 lg:p-16 font-sans overflow-x-hidden`}>
      
      {/* GLOW BACKGROUND EFFECT */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${stats.isSustainable ? 'opacity-[0.03] bg-emerald-500' : 'opacity-[0.08] bg-red-900'}`} />

      {/* HEADER & SLIDER */}
      <header className="max-w-[1600px] mx-auto mb-12 md:mb-20 flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex-1 text-center xl:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <motion.div 
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              className="p-6 bg-amber-500 rounded-[2rem] shadow-[0_20px_50px_rgba(245,158,11,0.3)]"
            >
              <GraduationCap className="text-slate-950 w-12 h-12" />
            </motion.div>
            <div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-amber-500 mb-2">
                International Montessori House
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                Digitalni Ustav 2026
              </h1>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg md:text-xl font-medium italic opacity-80">
            Autorizovani simulator za osnivača: Upravljanje povišicama i održivošću budžeta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 w-full xl:w-auto">
          {/* SLIDER CARD */}
          <motion.div 
            className={`w-full sm:w-[450px] ${isDark ? 'bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl border-2 p-10 rounded-[3.5rem] flex flex-col gap-8`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Povećanje školarine (%)
              </span>
              <span className="text-amber-500 font-black text-5xl">+{tuitionIncrease}%</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.5"
              value={tuitionIncrease}
              onChange={(e) => setTuitionIncrease(parseFloat(e.target.value))}
              className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500 shadow-inner"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter opacity-60">
              <span>Standard (0%)</span>
              <span>Bazni Prihod: {formattedCurrency(BASELINE_REVENUE_2025)}</span>
            </div>
          </motion.div>

          {/* THEME TOGGLE */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-6 rounded-[2rem] transition-all border-2 ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 shadow-xl'}`}
          >
            {isDark ? <Sun size={32} /> : <Moon size={32} />}
          </button>
        </div>
      </header>

      {/* MANDAT 3: 3 LARGE EXECUTIVE CARDS */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-20 relative z-10">
        
        {/* CARD 1: NOVI PRIHOD */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-10 md:p-14 rounded-[4rem] border-2 transition-all ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-slate-100 shadow-xl'}`}
        >
          <div className="flex justify-between items-start mb-10">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Novi Prihod</span>
            <TrendingUp className="text-emerald-500 w-10 h-10" />
          </div>
          <div className="text-4xl md:text-6xl font-mono font-black text-emerald-500 tracking-tighter">
            +{formattedCurrency(stats.revenueGrowth)}
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest opacity-60">
            Dodatna sredstva od školarine
          </p>
        </motion.div>

        {/* CARD 2: TROŠAK POVIŠICA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 md:p-14 rounded-[4rem] border-2 transition-all ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-red-500/30' : 'bg-white border-slate-100 shadow-xl'}`}
        >
          <div className="flex justify-between items-start mb-10">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Trošak Povišica</span>
            <ArrowDownRight className="text-red-500 w-10 h-10" />
          </div>
          <div className="text-4xl md:text-6xl font-mono font-black text-red-500 tracking-tighter">
            -{formattedCurrency(stats.grossIncrease)}
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest opacity-60">
            Ukupni Bruto teret (Neto x 1.63)
          </p>
        </motion.div>

        {/* CARD 3: ČISTA DOBIT */}
        <motion.div 
          animate={profitControls}
          initial={{ opacity: 0, x: 30 }}
          className={`p-10 md:p-14 rounded-[4rem] border-2 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ${isDark ? 'bg-slate-900 border-amber-500/20 shadow-amber-500/5' : 'bg-white border-slate-100 shadow-xl'}`}
        >
          <div className="flex justify-between items-start mb-10">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Čista Dobit</span>
            <Wallet className={`${stats.operationalBuffer >= 0 ? 'text-amber-500' : 'text-red-500'} w-10 h-10`} />
          </div>
          <div className={`text-4xl md:text-6xl font-mono font-black tracking-tighter ${stats.operationalBuffer >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
            {formattedCurrency(stats.operationalBuffer)}
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase text-slate-500 tracking-widest opacity-60">
            Preostali višak za investicije
          </p>
        </motion.div>
      </div>

      {/* DASHBOARD MIDDLE SECTION */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 relative z-10">
        
        {/* SIGURNOST BUDŽETA (GAUGE) */}
        <motion.div 
          className={`lg:col-span-5 p-12 md:p-16 rounded-[5rem] border-2 flex flex-col items-center justify-center text-center shadow-2xl ${
            stats.isSustainable 
              ? (isDark ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-emerald-200 bg-white') 
              : (isDark ? 'border-red-600 bg-red-950/40' : 'border-red-400 bg-white')
          }`}
        >
          <h2 className="text-2xl font-serif font-bold mb-10 tracking-widest uppercase">Sigurnost Budžeta</h2>
          <div className="relative mb-12 flex items-center justify-center scale-110 md:scale-125">
            <svg className="w-64 h-64 transform -rotate-90 drop-shadow-2xl">
              <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="18" fill="transparent" className={isDark ? "text-slate-900" : "text-slate-100"} />
              <motion.circle
                cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="18" fill="transparent"
                strokeDasharray="691.15"
                initial={{ strokeDashoffset: 691.15 }}
                animate={{ strokeDashoffset: 691.15 - (Math.min(tuitionIncrease, 10) / 10) * 691.15 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={stats.isSustainable ? "text-emerald-500" : "text-red-600"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {stats.isSustainable ? 
                <ShieldCheck className="text-emerald-500 mb-2" size={80} /> : 
                <ShieldAlert className="text-red-600 mb-2 animate-pulse" size={80} />
              }
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${stats.isSustainable ? 'text-emerald-500' : 'text-red-600'}`}>
                {stats.isSustainable ? 'BALANS POSTIGNUT' : 'RIZIČNA OPERACIJA'}
              </div>
            </div>
          </div>
          <div className={`text-[11px] px-10 py-5 rounded-full font-black tracking-[0.3em] uppercase border-2 shadow-xl ${
            stats.isSustainable ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : 'text-red-500 border-red-500/30 bg-red-500/10'
          }`}>
            {stats.isSustainable ? 'Strategija je održiva' : 'Povećajte povišicu školarine'}
          </div>
        </motion.div>

        {/* WATERFALL CHART */}
        <motion.div 
          className={`lg:col-span-7 p-12 md:p-16 rounded-[5rem] border-2 shadow-2xl ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          <h2 className="text-2xl font-serif font-bold mb-12 tracking-widest uppercase text-center xl:text-left">
            Simetrija Budžeta (Waterfall)
          </h2>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="name" fontSize={11} fontWeight="bold" stroke="#64748b" axisLine={false} tickLine={false} dy={15} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
                  formatter={(val: number) => [formattedCurrency(val), 'Finansijski saldo']}
                />
                <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={90}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between text-[10px] font-black uppercase text-slate-500 px-6 tracking-widest opacity-60">
            <span>START</span>
            <span>PRILIV</span>
            <span>RASHOD</span>
            <span className="text-amber-500">SALDO 2026</span>
          </div>
        </motion.div>
      </div>

      {/* MATRICA STRATEGIJE RADNIKA (TABLE) */}
      <section className="max-w-[1600px] mx-auto mb-32 relative z-10">
        <div className={`border-2 rounded-[4rem] md:rounded-[5rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="p-12 md:p-20 border-b-2 border-slate-800 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-serif font-bold flex items-center gap-6">
                <Users className="text-amber-500 w-12 h-12" />
                Matrica Strategije 2026
              </h2>
              <p className="text-slate-500 mt-4 text-sm md:text-lg font-bold uppercase tracking-[0.4em]">Precizni obračun primanja po stubovima</p>
            </div>
            <div className="flex gap-6 w-full md:w-auto">
              <button onClick={() => setIsReportOpen(true)} className="flex-1 px-12 py-8 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4">
                <FileText size={24} /> Izvještaj
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className={`${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-xs uppercase font-black tracking-[0.4em] border-b-2 border-slate-800`}>
                  <th className="px-16 py-12">Ime i Prezime / Pozicija</th>
                  <th className="px-6 py-12 text-center">Start</th>
                  <th className="px-6 py-12 text-center">Razred</th>
                  <th className="px-6 py-12">Lojalnost (%)</th>
                  <th className="px-6 py-12">MA Status</th>
                  <th className="px-6 py-12 text-right">Nova Neto Plata</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-800/40">
                {employees.map((emp) => {
                  const loyaltyBonus = getLoyaltyBonus(emp.start);
                  const finalNet = calculateNewNet(emp);
                  const netDelta = finalNet - emp.currentNet;
                  return (
                    <tr key={emp.id} className={`transition-all ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-16 py-10">
                        <div className="font-black uppercase text-base tracking-widest">{emp.name}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase mt-2 tracking-wider">{emp.role}</div>
                      </td>
                      <td className="px-6 py-10 text-center font-black text-slate-400">{emp.start}</td>
                      <td className="px-6 py-10 text-center">
                        <span className="text-[11px] font-black px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">{emp.cat}</span>
                      </td>
                      <td className="px-6 py-10">
                        <div className="flex flex-col">
                          <span className={`text-lg font-black ${loyaltyBonus > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>+{(loyaltyBonus * 100).toFixed(0)}%</span>
                          <span className="text-[10px] uppercase font-bold text-slate-600">Član 4.</span>
                        </div>
                      </td>
                      <td className="px-6 py-10">
                        <button onClick={() => toggleMA(emp.id)} className={`transition-all ${emp.ma ? 'text-amber-500' : 'text-slate-700 opacity-40 hover:opacity-100'}`}>
                          {emp.ma ? <ToggleRight size={56} /> : <ToggleLeft size={56} />}
                        </button>
                      </td>
                      <td className="px-6 py-10 text-right">
                        <div className="font-mono font-black text-3xl tracking-tighter">{formattedCurrency(finalNet)}</div>
                        <div className="text-xs text-emerald-500 font-black flex items-center justify-end gap-2 mt-2">
                          <ArrowUpRight size={16} /> +{formattedCurrency(netDelta)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER: GROUP SUMMARIES */}
          <div className={`p-16 md:p-24 border-t-2 border-slate-800 ${isDark ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
            <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.5em] mb-12 text-slate-500">
              Godišnji Trošak po Grupama (Ukupni Bruto)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {groupSummaries.map((summary, idx) => (
                <div key={idx} className={`p-10 rounded-[3rem] border-2 ${isDark ? 'bg-black/30 border-white/5 shadow-inner' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-6">{summary.label}</div>
                  <div className="text-3xl md:text-4xl font-mono font-black tracking-tighter">{formattedCurrency(summary.value)}</div>
                  <div className="text-[10px] text-amber-500 font-bold uppercase mt-6 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_#f59e0b]" /> 
                    Uračunato Bruto (1.63)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto py-24 border-t-2 border-slate-200 dark:border-slate-900 flex flex-col items-center gap-12 relative z-10">
         <div className="flex items-center gap-6 font-serif text-3xl md:text-5xl font-bold opacity-30 select-none">
           <GraduationCap className="text-amber-500 w-16 h-16" />
           IMH Sarajevo
         </div>
         <div className="text-[10px] md:text-sm uppercase tracking-[0.8em] font-black text-slate-500 text-center leading-loose select-none opacity-40">
           STRATEŠKI SIMULATOR ODRŽIVOSTI • MODEL v2.8 <br />
           SVA PRAVA ZADRŽANA © 2025-2026 INTERNATIONAL MONTESSORI HOUSE
         </div>
      </footer>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 lg:p-20">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
              className="absolute inset-0 bg-slate-950/99 backdrop-blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, y: 150, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 150, scale: 0.9 }}
              className="relative w-full h-full md:h-auto md:max-w-[1300px] bg-white text-slate-900 md:rounded-[6rem] overflow-y-auto p-12 md:p-28 shadow-[0_100px_200px_-40px_rgba(0,0,0,1)]"
            >
              <button onClick={() => setIsReportOpen(false)} className="absolute top-12 right-12 text-slate-300 hover:text-red-700 transition-colors">
                <X size={80} />
              </button>
              <div className="flex items-center gap-6 text-amber-600 mb-16 font-black uppercase text-sm md:text-base tracking-[0.5em]">
                <GraduationCap size={48} /> Službeni Dokument Strategije 2026
              </div>
              <h3 className="text-6xl md:text-9xl font-serif font-bold mb-20 md:mb-32 text-slate-950 leading-tight">Plan Plata i Održivosti</h3>
              
              <div className="space-y-24 md:space-y-40">
                <div className="p-16 md:p-28 rounded-[5rem] bg-slate-50 border-4 border-slate-100 italic text-3xl md:text-6xl leading-relaxed text-slate-800 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-8 h-full bg-amber-500" />
                  "Uz povećanje školarine od <span className="font-black text-amber-600">{tuitionIncrease}%</span>, Ustanova generiše <span className="font-black text-emerald-600">{formattedCurrency(stats.revenueGrowth)}</span> dodatnog priliva. Plan omogućava povišice uz čistu dobit od <span className="font-black">{formattedCurrency(stats.operationalBuffer)}</span>."
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                   <div className="p-20 rounded-[5rem] border-4 border-slate-100 bg-slate-50 shadow-inner">
                     <span className="block text-base uppercase font-black text-slate-400 mb-10 tracking-widest">Ukupni Trošak (Bruto) 2025</span>
                     <span className="text-4xl md:text-6xl font-mono font-black tracking-tighter">{formattedCurrency(stats.totalCurrentGross)}</span>
                   </div>
                   <div className="p-20 rounded-[5rem] border-4 border-amber-200 bg-amber-50/50 shadow-inner">
                     <span className="block text-base uppercase font-black text-amber-600 mb-10 tracking-widest">Ukupni Trošak (Bruto) 2026</span>
                     <span className="text-4xl md:text-6xl font-mono font-black text-amber-600 tracking-tighter">{formattedCurrency(stats.totalNewGross)}</span>
                   </div>
                </div>

                <div className="pt-32 md:pt-48 border-t-4 border-slate-100 flex justify-between items-end gap-16 text-center">
                  <div className="flex-1">
                    <div className="w-full h-1 bg-slate-400 mb-10" />
                    <div className="text-xs md:text-sm uppercase font-black text-slate-500 tracking-[0.4em]">Uprava Ustanove</div>
                  </div>
                  <div className="flex-1 hidden sm:block">
                    <div className="w-full h-1 bg-slate-400 mb-10" />
                    <div className="text-xs md:text-sm uppercase font-black text-slate-500 tracking-[0.4em]">Pečat Ustanove</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-1 bg-slate-400 mb-10" />
                    <div className="text-xs md:text-sm uppercase font-black text-slate-500 tracking-[0.4em]">Osnivač / Vlasnik</div>
                  </div>
                </div>
              </div>

              <div className="mt-32 md:mt-48 flex flex-col sm:flex-row gap-10">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-12 md:py-16 bg-slate-950 text-white rounded-[4rem] font-black text-lg md:text-2xl uppercase tracking-[0.5em] flex items-center justify-center gap-10 shadow-2xl active:scale-95 transition-all"
                >
                  <Printer size={48} /> ŠTAMPAJ SLUŽBENI IZVJEŠTAJ
                </button>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="px-16 py-12 md:py-16 border-4 border-slate-300 text-slate-400 rounded-[4rem] font-black text-lg md:text-2xl uppercase tracking-[0.4em] hover:border-slate-500 hover:text-slate-800 transition-all active:scale-95"
                >
                  ZATVORI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
