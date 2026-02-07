
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
  TrendingUp,
  Eye,
  EyeOff,
  Award,
  BarChart3,
  Scale,
  Target,
  FileCheck
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

import { INITIAL_EMPLOYEES, BASELINE_REVENUE_2025, BRUTO_FACTOR } from './constants';
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
      { name: 'Novi Prihod', val: prihod, shadow: 0, display: prihod, fill: '#10b981' },
      { name: 'Uprava (A)', val: costA, shadow: prihod - costA, display: -costA, fill: '#ef4444' },
      { name: 'Odgajatelji (B)', val: costB, shadow: prihod - costA - costB, display: -costB, fill: '#ef4444' },
      { name: 'Pomoćno (C/D)', val: costCD, shadow: prihod - costA - costB - costCD, display: -costCD, fill: '#ef4444' },
      { name: 'Čista Dobit', val: Math.abs(dobit), shadow: 0, display: dobit, fill: stats.isSustainable ? '#fbbf24' : '#ef4444' },
    ];
  }, [stats]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 lg:p-12 font-sans overflow-x-hidden`}>
      
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${stats.isSustainable ? 'opacity-[0.03] bg-emerald-500' : 'opacity-[0.1] bg-red-900'}`} />

      {/* HEADER */}
      <header className="max-w-[1400px] mx-auto mb-12 flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex-1 text-center xl:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="IMH Logo" className="h-16 md:h-20 object-contain" />
            </motion.div>
            <div className="h-px w-12 bg-slate-800 hidden md:block"></div>
            <div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-amber-500 mb-1">
                International Montessori House
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight dark:text-white text-slate-900">
                Strategija IMH 2026
              </h1>
            </div>
          </div>
          <p className="text-slate-500 max-w-xl text-base md:text-lg font-medium italic">
            Ekskluzivni simulator za vizualizaciju "Matematičke Pravednosti" i ekonomske održivosti ustanove.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
          {/* FOUNDER'S SLIDER */}
          <motion.div 
            className={`w-full sm:w-[440px] ${isDark ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl'} border p-8 rounded-[2.5rem] flex flex-col gap-4`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Povećanje Školarine
              </span>
              <span className="text-amber-500 font-black text-4xl">+{tuitionIncrease}%</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.5"
              value={tuitionIncrease}
              onChange={(e) => setTuitionIncrease(parseFloat(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60">
              <span>Standard (0%)</span>
              <span>Bazni Prihod: {formattedCurrency(BASELINE_REVENUE_2025)}</span>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <button 
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-lg'}`}
              title="Privatni način rada"
            >
              {privacyMode ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-600 shadow-lg'}`}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* EXECUTIVE CARDS */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
        <motion.div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Novi Prihod</span>
            <div className="p-3 bg-emerald-500/10 rounded-xl"><TrendingUp className="text-emerald-500 w-6 h-6" /></div>
          </div>
          <div className="text-3xl font-mono font-black text-emerald-500">+{formattedCurrency(stats.dodatniPrihod)}</div>
          <p className="mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Dodatna sredstva od školarina</p>
        </motion.div>

        <motion.div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mjesečni Trošak Povišica (Bruto)</span>
            <div className="p-3 bg-red-500/10 rounded-xl"><Scale className="text-red-500 w-6 h-6" /></div>
          </div>
          <div className="text-3xl font-mono font-black text-red-500">-{formattedCurrency(totals.totalBrutoCost)}</div>
          <p className="mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Realni trošak ustanove (Faktor {BRUTO_FACTOR})</p>
        </motion.div>

        <motion.div animate={profitControls} className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-amber-500/40 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.2)]' : 'bg-white border-amber-100 shadow-2xl shadow-amber-500/10'}`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sigurnosna Rezerva</span>
            <div className={`p-3 ${stats.isSustainable ? 'bg-amber-500/10' : 'bg-red-500/10'} rounded-xl`}><Wallet className={`${stats.isSustainable ? 'text-amber-500' : 'text-red-500'} w-6 h-6`} /></div>
          </div>
          <div className={`text-3xl font-mono font-black ${stats.isSustainable ? 'text-amber-500' : 'text-red-500'}`}>{formattedCurrency(stats.cistaDobit)}</div>
          <p className="mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Neto višak nakon svih povišica</p>
        </motion.div>
      </div>

      {/* DASHBOARD MIDDLE SECTION */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 relative z-10">
        <motion.div className={`lg:col-span-5 p-10 rounded-[3.5rem] border-2 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-700 ${stats.isSustainable ? 'border-emerald-500 bg-emerald-500/[0.04]' : 'border-red-600 bg-red-950/20'}`}>
          <h2 className={`text-xl font-serif font-bold mb-8 tracking-widest uppercase ${stats.isSustainable ? 'text-emerald-400' : 'text-red-500'}`}>Sigurnost Budžeta</h2>
          <div className="relative mb-10 flex items-center justify-center">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="16" fill="transparent" className={isDark ? "text-slate-900" : "text-slate-100"} />
              <motion.circle
                cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="16" fill="transparent"
                strokeDasharray="596.9"
                initial={{ strokeDashoffset: 596.9 }}
                animate={{ strokeDashoffset: 596.9 - (Math.max(0, Math.min(stats.cistaDobit / 60000, 1)) * 596.9) }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={stats.isSustainable ? "text-emerald-500" : "text-red-600"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {stats.isSustainable ? <ShieldCheck className="text-emerald-500 mb-1" size={80} /> : <ShieldAlert className="text-red-600 mb-1 animate-pulse" size={80} />}
              <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${stats.isSustainable ? 'text-emerald-500' : 'text-red-600'}`}>{stats.isSustainable ? 'ODRŽIVO' : 'RIZIČNO'}</div>
            </div>
          </div>
          <div className={`text-[10px] px-8 py-4 rounded-full font-black tracking-widest uppercase border transition-all ${stats.isSustainable ? 'text-emerald-500 border-emerald-500/20' : 'text-red-500 border-red-500/20'}`}>
            {stats.isSustainable ? 'Prihodi pokrivaju povišice' : 'Potrebna korekcija modela'}
          </div>
        </motion.div>

        <motion.div className={`lg:col-span-7 p-10 rounded-[3.5rem] border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-serif font-bold tracking-widest uppercase dark:text-white text-slate-800">Finansijski Tok</h2>
            <BarChart3 className="text-amber-500 w-8 h-8" />
          </div>
          <div className="w-full" style={{ minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={waterfallData} margin={{top: 20, right: 30, left: 10, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} opacity={0.3} />
                <XAxis dataKey="name" fontSize={9} fontWeight="black" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', padding: '1rem' }}
                  labelStyle={{ fontWeight: 'black', color: '#64748b', textTransform: 'uppercase', fontSize: '9px', marginBottom: '4px' }}
                  formatter={(val: any, name: any, props: any) => [formattedCurrency(props.payload.display), 'Iznos']}
                />
                <Bar dataKey="shadow" stackId="a" fill="transparent" />
                <Bar dataKey="val" stackId="a" radius={[8, 8, 8, 8]}>
                  {waterfallData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* MATRICA STRATEGIJE */}
      <section className="max-w-[1400px] mx-auto mb-20 relative z-10">
        <div className={`border rounded-[3.5rem] overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="p-8 md:p-12 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-4 dark:text-white text-slate-900">
                <Users className="text-amber-500 w-10 h-10" />
                Matrica Strategije 2026
              </h2>
              <p className="text-slate-500 mt-2 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Individualni obračun povišica po zaposleniku</p>
            </div>
            <button onClick={() => setIsReportOpen(true)} className="px-10 py-5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center gap-3">
              <FileText size={20} /> Generiši Izvještaj
            </button>
          </div>
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className={`${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-[9px] uppercase font-black tracking-[0.4em] border-b border-slate-800`}>
                  <th className="px-10 py-8">Zaposlenik / Uloga</th>
                  <th className="px-6 py-8 text-center">Lojalnost</th>
                  <th className="px-6 py-8 text-center">Magistar</th>
                  <th className="px-6 py-8 text-right">Trenutni Neto</th>
                  <th className="px-6 py-8 text-right text-emerald-500">Nova Neto Plata</th>
                  <th className="px-10 py-8 text-right text-amber-500">Trošak Bruto (1.63)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {employees.map((emp) => {
                  const loyalty = calculateLoyaltyBonus(emp.start);
                  const raiseNet = emp.targetNet - emp.currentNet;
                  const raiseBruto = raiseNet * BRUTO_FACTOR;
                  return (
                    <tr key={emp.id} className={`transition-all ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-10 py-6">
                        <div className="font-black uppercase text-sm tracking-widest dark:text-slate-100 text-slate-900">{privacyMode ? `Zaposlenik #${emp.id}` : emp.name}</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">{emp.role}</div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-base font-black ${loyalty > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>+{loyalty}%</span>
                          <span className="text-[8px] font-black text-slate-600 uppercase">Od {emp.start}.</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        {emp.ma ? <Award className="text-amber-500 w-6 h-6 mx-auto" /> : <span className="opacity-10">-</span>}
                      </td>
                      <td className="px-6 py-6 text-right font-mono text-[11px] dark:text-slate-400 text-slate-600 opacity-70">{formattedCurrency(emp.currentNet)}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="font-mono font-black text-emerald-500 text-lg tracking-tighter">{formattedCurrency(emp.targetNet)}</div>
                        <div className="text-[9px] text-emerald-600/60 font-bold">+{formattedCurrency(raiseNet)} neto</div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="font-mono font-black text-amber-500 text-xl tracking-tighter">{formattedCurrency(raiseBruto)}</div>
                        <div className="text-[9px] text-amber-600/60 font-bold uppercase">Realni trošak</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className={`sticky bottom-0 border-t-2 border-slate-800 ${isDark ? 'bg-slate-900' : 'bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]'}`}>
                <tr className="font-black">
                  <td className="px-10 py-8 uppercase tracking-widest text-xs dark:text-slate-100 text-slate-900">Ukupni Obračun (Matrica)</td>
                  <td colSpan={2}></td>
                  <td className="px-6 py-8 text-right font-mono text-sm dark:text-slate-300 text-slate-700">{formattedCurrency(totals.totalCurrentNet)}</td>
                  <td className="px-6 py-8 text-right">
                    <div className="font-mono text-emerald-500 text-xl">{formattedCurrency(totals.totalTargetNet)}</div>
                    <div className="text-[9px] text-emerald-600 uppercase">+{formattedCurrency(totals.totalNetIncrease)} Neto</div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="font-mono text-amber-500 text-2xl drop-shadow-sm">{formattedCurrency(totals.totalBrutoCost)}</div>
                    <div className="text-[9px] text-amber-600 uppercase">Ukupni Bruto Trošak</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="md:hidden p-6 space-y-6">
            {employees.map((emp) => {
              const raiseNet = emp.targetNet - emp.currentNet;
              const raiseBruto = raiseNet * BRUTO_FACTOR;
              return (
                <div key={emp.id} className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-black uppercase text-sm tracking-widest dark:text-slate-100 text-slate-900">{privacyMode ? `Zaposlenik #${emp.id}` : emp.name}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase">{emp.role}</div>
                    </div>
                    <span className="text-[9px] font-black px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg">{emp.cat}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800/30 pt-4">
                    <div>
                      <span className="text-[8px] font-black uppercase text-slate-500 mb-1 block">Nova Neto Plata</span>
                      <div className="text-base font-mono font-black text-emerald-500">{formattedCurrency(emp.targetNet)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black uppercase text-slate-500 mb-1 block">Bruto Trošak</span>
                      <div className="text-base font-mono font-black text-amber-500">{formattedCurrency(raiseBruto)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* MOBILE TOTALS CARD */}
            <div className={`p-8 rounded-[2.5rem] border-2 border-amber-500/30 ${isDark ? 'bg-amber-500/5' : 'bg-amber-50'}`}>
              <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-6">Ukupni Strategijski Trošak</div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-amber-500/10 pb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Ukupno Neto</span>
                  <span className="text-sm font-mono font-black text-emerald-600">{formattedCurrency(totals.totalTargetNet)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Ukupno Bruto</span>
                  <span className="text-xl font-mono font-black text-amber-600">{formattedCurrency(totals.totalBrutoCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGY SUMMARY MODAL */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReportOpen(false)} className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" />
            <motion.div initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }} className="relative w-full max-w-5xl bg-white text-slate-900 rounded-[3rem] overflow-y-auto p-10 md:p-16 shadow-2xl max-h-[95vh]">
              <button onClick={() => setIsReportOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-700 transition-colors">
                <X size={48} />
              </button>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4 text-amber-600 font-black uppercase text-[10px] md:text-xs tracking-[0.4em]">
                  <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="Logo" className="h-10" />
                  Strategija IMH 2026: Izvještaj o Održivosti
                </div>
                <div className="text-slate-400 font-mono text-[10px]">{new Date().toLocaleDateString('bs-BA')} | Br. 2026-ADM-01</div>
              </div>

              <h3 className="text-4xl md:text-7xl font-serif font-bold mb-16 text-slate-950 leading-tight">Analiza Finansijske Ravnoteže</h3>

              <div className="space-y-16 text-slate-800">
                {/* UVOD SECTION */}
                <section>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 mb-6 flex items-center gap-3">
                    <FileCheck size={18} /> I. Uvodni Mandat
                  </h4>
                  <p className="text-lg md:text-xl leading-relaxed text-slate-700 font-medium">
                    Implementacija Strategije 2026 predstavlja ključni korak ka dugoročnoj <span className="text-slate-950 font-bold">stabilizaciji, unutrašnjem miru i održivom rastu</span> ustanove. Model "Matematičke Pravednosti" eliminiše subjektivnost i postavlja jasne standarde nagrađivanja zasnovane na lojalnosti i ekspertizi.
                  </p>
                </section>

                {/* FINANSIJSKA ANALIZA SECTION */}
                <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 mb-6 flex items-center gap-3">
                    <TrendingUp size={18} /> II. Finansijska Analiza Stubova
                  </h4>
                  <p className="text-lg md:text-xl leading-relaxed mb-10">
                    Kombinovanjem rasta prihoda od školarina (<span className="text-amber-600 font-bold">{tuitionIncrease}%</span>) i redefinisanja platnih razreda, ustanova postiže potpunu samoodrživost:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">1</div>
                        <div className="flex-1">
                          <div className="text-xs font-black uppercase text-slate-400">Prinos od povišice</div>
                          <div className="text-2xl font-mono font-black text-emerald-600">{formattedCurrency(stats.dodatniPrihod)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black">2</div>
                        <div className="flex-1">
                          <div className="text-xs font-black uppercase text-slate-400">Puni bruto teret povišica</div>
                          <div className="text-2xl font-mono font-black text-red-600">{formattedCurrency(totals.totalBrutoCost)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-8 bg-white rounded-3xl border-2 border-amber-200 shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-5"><Scale size={60} /></div>
                       <div className="text-xs font-black uppercase text-amber-600 mb-2">Operativna Rezerva (Godišnje)</div>
                       <div className="text-4xl font-mono font-black text-slate-950">{formattedCurrency(stats.cistaDobit)}</div>
                    </div>
                  </div>
                </section>

                {/* ANALIZA STUPOVA SECTION */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 mb-6 flex items-center gap-3">
                      <Target size={18} /> III. Stup Lojalnosti
                    </h4>
                    <p className="text-base leading-relaxed text-slate-600">
                      Sistem <span className="font-bold text-slate-900">15/10/4%</span> direktno štiti institucionalnu memoriju. Nagrađivanjem najdugovječnijih članova tima, IMH cementira jezgro kolektiva i postavlja standarde za nove zaposlenike.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 mb-6 flex items-center gap-3">
                      <Award size={18} /> IV. Stup Ekspertize
                    </h4>
                    <p className="text-base leading-relaxed text-slate-600">
                      Dodatak od <span className="font-bold text-slate-900">5% za Magistarski stepen (MA)</span> osigurava elitni status ustanove na tržištu BiH, motivišući kadar na kontinuirano akademsko usavršavanje.
                    </p>
                  </div>
                </section>

                {/* ZAKLJUČAK SECTION */}
                <section className="pt-16 border-t-2 border-slate-100">
                  <div className="p-10 rounded-[2.5rem] bg-emerald-50 border-2 border-emerald-100 italic text-2xl md:text-3xl leading-relaxed text-emerald-900 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-3 h-full bg-emerald-500" />
                    "Na osnovu provedene simulacije, predložena promjena školarine od <span className="font-black">{tuitionIncrease}%</span> u potpunosti apsorbuje povećanje plata, ostavljajući operativnu rezervu od <span className="font-black text-slate-950">{formattedCurrency(stats.cistaDobit)}</span> godišnje, što garantuje <span className="font-black uppercase tracking-widest text-emerald-700">fiskalnu sigurnost</span> Ustanove i miran prelazak u novi fiskalni ciklus."
                  </div>
                </section>

                <div className="pt-24 flex justify-between items-end gap-16 text-center">
                  <div className="flex-1">
                    <div className="w-full h-px bg-slate-300 mb-8" />
                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em]">Direktor Ustanove</div>
                  </div>
                  <div className="flex-1 hidden md:block">
                    <div className="w-full h-px bg-slate-300 mb-8" />
                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em]">Službeni Pečat</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-px bg-slate-300 mb-8" />
                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em]">Osnivač / Vlasnik</div>
                  </div>
                </div>
              </div>

              <div className="mt-20 flex flex-col md:flex-row gap-6">
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 py-8 bg-slate-950 text-white rounded-[2rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-6 shadow-xl active:scale-95 transition-all hover:bg-slate-800"
                >
                  <Printer size={28} /> ŠTAMPAJ SLUŽBENI IZVJEŠTAJ
                </button>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="px-12 py-8 border-2 border-slate-200 text-slate-400 rounded-[2rem] font-black text-base uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                >
                  ZATVORI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-[1400px] mx-auto py-24 border-t border-slate-900 flex flex-col items-center gap-10 relative z-10 opacity-30 select-none">
         <img src="https://i.postimg.cc/MZ4w91zf/imh-logo.png" alt="Footer Logo" className="h-12 grayscale brightness-50" />
         <div className="text-[8px] md:text-[10px] uppercase tracking-[0.8em] font-black text-slate-500 text-center leading-loose">
           SVA PRAVA ZADRŽANA © 2025-2026 INTERNATIONAL MONTESSORI HOUSE • SARAJEVO
         </div>
      </footer>

    </div>
  );
};

export default App;
