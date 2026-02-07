
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Wallet, 
  GraduationCap,
  FileText,
  X,
  Printer,
  Sun,
  Moon,
  ArrowUpRight,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronDown,
  Briefcase,
  Award,
  Scale
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

import { INITIAL_EMPLOYEES, BASELINE_REVENUE_2025 } from './constants';
import { Employee } from './types';
import { calculateStats, calculateLoyaltyBonus } from './services/financialEngine';

const App: React.FC = () => {
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tuitionIncrease, setTuitionIncrease] = useState<number>(6);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const profitControls = useAnimation();

  const stats = useMemo(() => calculateStats(employees, tuitionIncrease), [employees, tuitionIncrease]);

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
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    });
  }, [tuitionIncrease, profitControls]);

  const formattedCurrency = (val: number) => {
    return new Intl.NumberFormat('bs-BA', { style: 'currency', currency: 'BAM', minimumFractionDigits: 2 }).format(val);
  };

  const waterfallData = [
    { name: 'Novi Prihod', value: stats.dodatniPrihod, color: '#10b981' },
    { name: 'Uprava (A)', value: -stats.categorySummaries.find(s => s.cat === 'A')?.totalRaiseCostBruto! || 0, color: '#ef4444' },
    { name: 'Odgajatelji (B)', value: -stats.categorySummaries.find(s => s.cat === 'B')?.totalRaiseCostBruto! || 0, color: '#ef4444' },
    { name: 'Pomoćno (C/D)', value: -(stats.categorySummaries.find(s => s.cat === 'C')?.totalRaiseCostBruto! + stats.categorySummaries.find(s => s.cat === 'D')?.totalRaiseCostBruto!), color: '#ef4444' },
    { name: 'Saldo', value: stats.cistaDobit, color: stats.isSustainable ? '#fbbf24' : '#7f1d1d' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-12 lg:p-16 font-sans overflow-x-hidden`}>
      
      {/* DINAMIČKA POZADINA */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${stats.isSustainable ? 'opacity-[0.03] bg-emerald-500' : 'opacity-[0.1] bg-red-900'}`} />

      {/* HEADER & EXECUTIVE SLIDER */}
      <header className="max-w-[1400px] mx-auto mb-16 flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 text-center xl:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }}
              className="p-6 bg-amber-500 rounded-[2.5rem] shadow-2xl shadow-amber-500/30"
            >
              <GraduationCap className="text-slate-950 w-12 h-12" />
            </motion.div>
            <div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-amber-500 mb-2">
                International Montessori House
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                Modelator Strategije 2026
              </h1>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl text-lg md:text-xl font-medium italic">
            Zvanični simulator za analizu korelacije između rasta prihoda i plata.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 w-full xl:w-auto">
          {/* FOUNDER'S SLIDER */}
          <motion.div 
            className={`w-full sm:w-[480px] ${isDark ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl'} border-2 p-10 rounded-[4rem] flex flex-col gap-6`}
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
              className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">
              <span>Standard (0%)</span>
              <span>Bazni Prihod: {formattedCurrency(BASELINE_REVENUE_2025)}</span>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <button 
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`p-6 rounded-[2rem] border-2 transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 shadow-xl'}`}
              title="Privatni način rada"
            >
              {privacyMode ? <EyeOff size={32} /> : <Eye size={32} />}
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-6 rounded-[2rem] border-2 transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-600 shadow-xl'}`}
            >
              {isDark ? <Sun size={32} /> : <Moon size={32} />}
            </button>
          </div>
        </div>
      </header>

      {/* EXECUTIVE CARDS */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 relative z-10">
        
        <motion.div 
          className={`p-10 md:p-14 rounded-[4rem] border-2 transition-all ${isDark ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-slate-100 shadow-xl'}`}
        >
          <div className="flex justify-between items-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Dodatni Prihod</span>
            <div className="p-4 bg-emerald-500/10 rounded-2xl"><TrendingUp className="text-emerald-500 w-8 h-8" /></div>
          </div>
          <div className="text-4xl md:text-5xl font-mono font-black text-emerald-500 tracking-tighter">
            +{formattedCurrency(stats.dodatniPrihod)}
          </div>
          <p className="mt-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Godišnji priliv od školarina</p>
        </motion.div>

        <motion.div 
          className={`p-10 md:p-14 rounded-[4rem] border-2 transition-all ${isDark ? 'bg-slate-900/60 border-slate-800 hover:border-red-500/30' : 'bg-white border-slate-100 shadow-xl'}`}
        >
          <div className="flex justify-between items-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Trošak Povišica (Bruto)</span>
            <div className="p-4 bg-red-500/10 rounded-2xl"><Users className="text-red-500 w-8 h-8" /></div>
          </div>
          <div className="text-4xl md:text-5xl font-mono font-black text-red-500 tracking-tighter">
            -{formattedCurrency(stats.ukupniTrosakPovisicaBruto)}
          </div>
          <p className="mt-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Ukupni trošak doprinosa (1.63)</p>
        </motion.div>

        <motion.div 
          animate={profitControls}
          className={`p-10 md:p-14 rounded-[4rem] border-2 transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] ${isDark ? 'bg-slate-900 border-amber-500/40' : 'bg-white border-slate-100 shadow-2xl'}`}
        >
          <div className="flex justify-between items-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Sigurnosna Rezerva</span>
            <div className={`p-4 ${stats.isSustainable ? 'bg-amber-500/10' : 'bg-red-500/10'} rounded-2xl`}>
              <Wallet className={`${stats.isSustainable ? 'text-amber-500' : 'text-red-500'} w-8 h-8`} />
            </div>
          </div>
          <div className={`text-4xl md:text-5xl font-mono font-black tracking-tighter ${stats.isSustainable ? 'text-amber-500' : 'text-red-500'}`}>
            {formattedCurrency(stats.cistaDobit)}
          </div>
          <p className="mt-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Čista dobit nakon povišica</p>
        </motion.div>

      </div>

      {/* DASHBOARD MIDDLE SECTION */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 relative z-10">
        
        {/* SEMAFOR SIGURNOSTI BUDŽETA */}
        <motion.div 
          className={`lg:col-span-5 p-12 md:p-16 rounded-[5rem] border-4 flex flex-col items-center justify-center text-center shadow-2xl ${
            stats.isSustainable ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : 'border-red-600 bg-red-950/40'
          }`}
        >
          <h2 className="text-2xl font-serif font-bold mb-10 tracking-widest uppercase">Semafor Sigurnosti Budžeta</h2>
          <div className="relative mb-12 flex items-center justify-center scale-125">
            <svg className="w-64 h-64 transform -rotate-90">
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
                <ShieldCheck className="text-emerald-500 mb-2 drop-shadow-emerald-500" size={90} /> : 
                <ShieldAlert className="text-red-600 mb-2 animate-pulse" size={90} />
              }
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${stats.isSustainable ? 'text-emerald-500' : 'text-red-600'}`}>
                {stats.isSustainable ? 'SIGURNOST: VISOKA' : 'RIZIK: DEFICIT'}
              </div>
            </div>
          </div>
          <div className={`text-[11px] px-12 py-5 rounded-full font-black tracking-widest uppercase border-2 shadow-xl ${
            stats.isSustainable ? 'text-emerald-500 border-emerald-500/30' : 'text-red-500 border-red-500/30'
          }`}>
            {stats.isSustainable ? 'Model je finansijski održiv' : 'Potrebna korekcija školarina'}
          </div>
        </motion.div>

        {/* WATERFALL CHART */}
        <motion.div 
          className={`lg:col-span-7 p-12 md:p-16 rounded-[5rem] border-2 shadow-2xl ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          <h2 className="text-2xl font-serif font-bold mb-10 tracking-widest uppercase text-center xl:text-left">Simetrija Održivosti (KM)</h2>
          <div className="w-full h-[400px] min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="name" fontSize={11} fontWeight="bold" stroke="#64748b" axisLine={false} tickLine={false} dy={15} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
                  formatter={(val: number) => [formattedCurrency(Math.abs(val)), 'Vrijednost']}
                />
                <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={80}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <ReferenceLine y={0} stroke="#475569" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-60">
            <span>PRILIV</span>
            <span>UPRAVA</span>
            <span>ODGAJATELJI</span>
            <span>TEHNIČKO</span>
            <span className="text-amber-500">DOBIT</span>
          </div>
        </motion.div>

      </div>

      {/* MATRICA STRATEGIJE 2026 */}
      <section className="max-w-[1400px] mx-auto mb-32 relative z-10">
        <div className={`border-2 rounded-[5rem] overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="p-12 md:p-20 border-b-2 border-slate-800 flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold flex items-center gap-6">
                <Users className="text-amber-500 w-14 h-14" />
                Matrica Strategije 2026
              </h2>
              <p className="text-slate-500 mt-4 text-sm md:text-lg font-bold uppercase tracking-[0.4em]">Precizni obračun primanja po zaposleniku</p>
            </div>
            <div className="flex gap-6 w-full md:w-auto">
              <button 
                onClick={() => setIsReportOpen(true)} 
                className="flex-1 px-14 py-8 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-5"
              >
                <FileText size={28} /> Generiši Izvještaj
              </button>
            </div>
          </div>
          
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className={`${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-[11px] uppercase font-black tracking-[0.5em] border-b-2 border-slate-800`}>
                  <th className="px-16 py-12">Ime i Prezime / Uloga</th>
                  <th className="px-8 py-12 text-center">Stub Lojalnosti</th>
                  <th className="px-8 py-12 text-center">Magistar</th>
                  <th className="px-8 py-12 text-right">Trenutni Neto</th>
                  <th className="px-8 py-12 text-right text-emerald-500">Ciljani Neto 2026</th>
                  <th className="px-16 py-12 text-right text-amber-500">Trošak Bruto (1.63)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-800/40">
                {employees.map((emp) => {
                  const loyalty = calculateLoyaltyBonus(emp.start);
                  const raiseNet = emp.targetNet - emp.currentNet;
                  const raiseBruto = raiseNet * 1.63;
                  return (
                    <tr key={emp.id} className={`transition-all ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-16 py-10">
                        <div className="font-black uppercase text-base tracking-widest">{privacyMode ? `Zaposlenik #${emp.id}` : emp.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{emp.role}</div>
                      </td>
                      <td className="px-8 py-10 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${loyalty > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>+{loyalty}%</span>
                          <span className="text-[9px] font-black uppercase text-slate-600">Start: {emp.start}</span>
                        </div>
                      </td>
                      <td className="px-8 py-10 text-center">
                        {emp.ma ? <Award className="text-amber-500 w-8 h-8 mx-auto" /> : <span className="text-slate-800 opacity-20">-</span>}
                      </td>
                      <td className="px-8 py-10 text-right font-mono text-xs opacity-50">{formattedCurrency(emp.currentNet)}</td>
                      <td className="px-8 py-10 text-right">
                        <div className="font-mono font-black text-emerald-500 text-xl tracking-tighter">{formattedCurrency(emp.targetNet)}</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">+{formattedCurrency(raiseNet)}</div>
                      </td>
                      <td className="px-16 py-10 text-right">
                        <div className="font-mono font-black text-amber-500 text-2xl tracking-tighter">{formattedCurrency(raiseBruto)}</div>
                        <div className="text-[10px] text-amber-600 font-bold opacity-60">Puni teret ustanove</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden p-8 space-y-10">
            {employees.map((emp) => {
              const loyalty = calculateLoyaltyBonus(emp.start);
              const raiseNet = emp.targetNet - emp.currentNet;
              const raiseBruto = raiseNet * 1.63;
              return (
                <div key={emp.id} className={`p-10 rounded-[4rem] border-2 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'} shadow-xl`}>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <div className="font-black uppercase text-xl tracking-widest">{privacyMode ? `Zaposlenik #${emp.id}` : emp.name}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase mt-1">{emp.role}</div>
                    </div>
                    <span className="text-[10px] font-black px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">Kat {emp.cat}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="flex flex-col gap-2 p-6 rounded-[2rem] bg-black/20 border border-white/5">
                      <span className="text-[10px] font-black uppercase text-slate-500">Lojalnost</span>
                      <span className={`text-2xl font-black ${loyalty > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>+{loyalty}%</span>
                    </div>
                    <div className="flex flex-col gap-2 p-6 rounded-[2rem] bg-black/20 border border-white/5">
                      <span className="text-[10px] font-black uppercase text-slate-500">Stručnost</span>
                      <span className={`text-2xl font-black ${emp.ma ? 'text-amber-500' : 'text-slate-700'}`}>{emp.ma ? 'MA' : 'BA'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t-2 border-slate-800/40 pt-10">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Ciljani Neto 2026</span>
                      <div className="text-3xl font-mono font-black text-emerald-500 tracking-tighter">{formattedCurrency(emp.targetNet)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Trošak Bruto</span>
                      <div className="text-3xl font-mono font-black text-amber-500 tracking-tighter">{formattedCurrency(raiseBruto)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLE FOOTER */}
          <div className={`p-16 md:p-24 border-t-2 border-slate-800 ${isDark ? 'bg-slate-950/80' : 'bg-slate-50'}`}>
            <h3 className="text-sm md:text-xl font-black uppercase tracking-[0.5em] mb-16 text-slate-500">Analiza troškova po kategorijama (Godišnji Bruto)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.categorySummaries.map((summary, idx) => (
                <div key={idx} className={`p-10 rounded-[3rem] border-2 ${isDark ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="flex items-center gap-4 mb-8">
                     <span className="text-xs font-black px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">{summary.cat}</span>
                     <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{summary.label}</span>
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-black tracking-tighter">{formattedCurrency(summary.totalRaiseCostBruto)}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mt-6 flex items-center gap-3">
                    <Users size={16} /> {summary.count} zaposlenika
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGY SUMMARY MODAL */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
              className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, y: 150, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 150, scale: 0.9 }}
              className="relative w-full h-full md:h-auto md:max-w-[1200px] bg-white text-slate-900 rounded-[5rem] overflow-y-auto p-12 md:p-28 shadow-2xl"
            >
              <button onClick={() => setIsReportOpen(false)} className="absolute top-12 right-12 text-slate-300 hover:text-red-700 transition-colors">
                <X size={72} />
              </button>
              
              <div className="flex items-center gap-6 text-amber-600 mb-16 font-black uppercase text-sm md:text-base tracking-[0.5em]">
                <GraduationCap size={48} /> Službeni Dokument Strategije 2026
              </div>
              
              <h3 className="text-6xl md:text-9xl font-serif font-bold mb-20 text-slate-950 leading-tight">Analiza Održivosti Plata</h3>
              
              <div className="space-y-32">
                <div className="p-20 rounded-[5rem] bg-slate-50 border-4 border-slate-100 italic text-4xl md:text-6xl leading-relaxed text-slate-800 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 left-0 w-8 h-full bg-amber-500" />
                  "Uz povećanje školarine od <span className="font-black text-amber-600">{tuitionIncrease}%</span>, Ustanova generiše <span className="font-black text-emerald-600">{formattedCurrency(stats.dodatniPrihod)}</span> dodatnih sredstava. Ukupna godišnja bruto cijena povišica iznosi <span className="font-black text-red-600">{formattedCurrency(stats.ukupniTrosakPovisicaBruto)}</span>, što rezultira sigurnosnom rezervom od <span className="font-black">{formattedCurrency(stats.cistaDobit)}</span>."
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   <div className="p-20 rounded-[5rem] border-4 border-slate-100 bg-slate-50 shadow-inner">
                     <span className="block text-sm uppercase font-black text-slate-400 mb-10 tracking-[0.3em]">Ukupni Teret Povišica</span>
                     <span className="text-5xl md:text-7xl font-mono font-black tracking-tighter">{formattedCurrency(stats.ukupniTrosakPovisicaBruto)}</span>
                   </div>
                   <div className="p-20 rounded-[5rem] border-4 border-amber-200 bg-amber-50/50 shadow-inner">
                     <span className="block text-sm uppercase font-black text-amber-600 mb-10 tracking-[0.3em]">Sigurnosna Rezerva</span>
                     <span className="text-5xl md:text-7xl font-mono font-black text-amber-600 tracking-tighter">{formattedCurrency(stats.cistaDobit)}</span>
                   </div>
                </div>

                <div className="pt-40 border-t-4 border-slate-100 flex justify-between items-end gap-16 text-center">
                  <div className="flex-1">
                    <div className="w-full h-1 bg-slate-400 mb-12" />
                    <div className="text-xs md:text-sm uppercase font-black text-slate-500 tracking-[0.5em]">Direktor Ustanove</div>
                  </div>
                  <div className="flex-1 hidden sm:block">
                    <div className="w-full h-1 bg-slate-400 mb-12" />
                    <div className="text-xs md:text-sm uppercase font-black text-slate-500 tracking-[0.5em]">Pečat Ustanove</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-1 bg-slate-400 mb-12" />
                    <div className="text-xs md:text-sm uppercase font-black text-slate-500 tracking-[0.5em]">Osnivač / Vlasnik</div>
                  </div>
                </div>
              </div>

              <div className="mt-40 flex flex-col sm:flex-row gap-10">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-14 bg-slate-950 text-white rounded-[4rem] font-black text-xl md:text-2xl uppercase tracking-[0.5em] flex items-center justify-center gap-10 shadow-2xl active:scale-95 transition-all"
                >
                  <Printer size={48} /> ŠTAMPAJ SLUŽBENI IZVJEŠTAJ
                </button>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="px-16 py-14 border-4 border-slate-300 text-slate-400 rounded-[4rem] font-black text-xl md:text-2xl uppercase tracking-[0.4em] hover:border-slate-500 hover:text-slate-800 transition-all active:scale-95"
                >
                  ZATVORI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="max-w-[1400px] mx-auto py-32 border-t-2 border-slate-900 flex flex-col items-center gap-14 relative z-10 opacity-30 select-none">
         <div className="flex items-center gap-8 font-serif text-3xl md:text-5xl font-bold">
           <GraduationCap className="text-amber-500 w-16 h-16" />
           IMH Sarajevo 2026
         </div>
         <div className="text-[10px] md:text-sm uppercase tracking-[1em] font-black text-slate-500 text-center leading-loose">
           STRATEŠKI SIMULATOR ODRŽIVOSTI • MODEL v3.2 <br />
           SVA PRAVA ZADRŽANA © 2025-2026 INTERNATIONAL MONTESSORI HOUSE
         </div>
      </footer>

    </div>
  );
};

export default App;
