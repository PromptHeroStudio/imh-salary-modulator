
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Wallet, 
  Calendar,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  GraduationCap,
  Scale,
  FileText,
  X,
  Printer,
  Info,
  Sun,
  Moon,
  Save,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

import { INITIAL_EMPLOYEES, BASELINE_REVENUE_2025 } from './constants';
import { Employee } from './types';
import { calculateStats, calculateNewNet, getLoyaltyBonus, getExpertiseBonus } from './services/financialEngine';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tuitionIncrease, setTuitionIncrease] = useState<number>(6);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

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

  const toggleMA = (id: number) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ma: !e.ma } : e));
  };

  const formattedCurrency = (val: number) => {
    return new Intl.NumberFormat('bs-BA', { style: 'currency', currency: 'BAM' }).format(val);
  };

  const barChartData = [
    { name: '2025 Stanje', value: stats.totalCurrentGross },
    { name: '2026 Projekcija', value: stats.totalNewGross },
  ];

  const TooltipIcon = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-1 md:ml-2 cursor-help align-middle">
      <Info size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-40 md:w-48 p-2 bg-slate-900 text-white text-[9px] md:text-[10px] rounded-lg shadow-xl z-[60] border border-slate-800">
        {text}
      </div>
    </div>
  );

  const groupSummaries = useMemo(() => {
    const uprava = stats.categorySummaries.find(s => s.cat === 'A')?.totalNewGross || 0;
    const odgajatelji = stats.categorySummaries.find(s => s.cat === 'B')?.totalNewGross || 0;
    const pomocno = (stats.categorySummaries.find(s => s.cat === 'C')?.totalNewGross || 0) + 
                     (stats.categorySummaries.find(s => s.cat === 'D')?.totalNewGross || 0);
    return [
      { label: 'Uprava (Kat. A)', value: uprava },
      { label: 'Odgajatelji (Kat. B)', value: odgajatelji },
      { label: 'Pomoćno osoblje (Kat. C i D)', value: pomocno }
    ];
  }, [stats]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 lg:p-12 font-sans overflow-x-hidden`}>
      {/* Background Pulse Indicator */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 opacity-5 z-0 ${stats.isSustainable ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-8 md:mb-16 flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8 relative z-10">
        <div className="flex-1 order-2 md:order-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-amber-500 rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/20"
            >
              <GraduationCap className="text-slate-950 md:w-8 md:h-8" size={24} />
            </motion.div>
            <div>
              <div className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                International Montessori House
              </div>
              <h1 className={`text-2xl md:text-5xl font-serif font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Strateški Modelator 2026
              </h1>
            </div>
          </div>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} max-w-xl text-sm md:text-lg hidden md:block`}>
            Precizna simulacija finansijske održivosti vrtića i pravedne distribucije primanja.
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 order-1 md:order-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isDark ? 'bg-slate-900 text-amber-400 hover:bg-slate-800' : 'bg-white text-slate-600 shadow-lg hover:shadow-xl'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} className="md:w-6 md:h-6" /> : <Moon size={20} className="md:w-6 md:h-6" />}
          </button>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex-1 md:flex-none ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'} border p-4 md:p-8 rounded-xl md:rounded-[2.5rem] flex flex-col gap-2 md:gap-4 min-w-0 md:min-w-[320px] transition-shadow duration-300 ${!stats.isSustainable ? 'shadow-rose-500/10' : 'shadow-emerald-500/10'}`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[8px] md:text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Klizač za povećanje školarine (%)
              </span>
              <span className="text-amber-500 font-black text-xl md:text-3xl">{tuitionIncrease}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.5"
              value={tuitionIncrease}
              onChange={(e) => setTuitionIncrease(parseFloat(e.target.value))}
              className={`w-full h-2 md:h-3 rounded-full appearance-none cursor-pointer accent-amber-500 touch-manipulation transition-colors ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}
            />
          </motion.div>
        </div>
      </header>

      {/* Main Dashboard Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-8 mb-8 md:mb-16 relative z-10">
        
        {/* SEMAFOR SIGURNOSTI BUDŽETA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-5 p-6 md:p-12 rounded-2xl md:rounded-[3.5rem] border-2 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-700 shadow-xl ${
            stats.isSustainable 
              ? (isDark ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-emerald-200 bg-white') 
              : (isDark ? 'border-rose-500/40 bg-rose-500/[0.03]' : 'border-rose-200 bg-white')
          }`}
        >
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <TooltipIcon text="Semafor prati da li planirani rast prihoda od školarine pokriva nove povišice plata radnika (sa svim doprinosima)." />
          </div>
          
          <div className="relative mb-6 md:mb-10 flex items-center justify-center scale-75 md:scale-100">
            <svg className="w-40 h-40 md:w-56 md:h-56 transform -rotate-90">
              <circle
                cx="112" cy="112" r="95"
                stroke="currentColor" strokeWidth="16" fill="transparent"
                className={isDark ? "text-slate-900" : "text-slate-100"}
              />
              <motion.circle
                cx="112" cy="112" r="95"
                stroke="currentColor" strokeWidth="16" fill="transparent"
                strokeDasharray="596.6"
                initial={{ strokeDashoffset: 596.6 }}
                animate={{ strokeDashoffset: 596.6 - (Math.min(tuitionIncrease, 10) / 10) * 596.6 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={stats.isSustainable ? "text-emerald-500" : "text-rose-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {stats.isSustainable ? 
                <ShieldCheck className="text-emerald-500 mb-1 md:mb-2 drop-shadow-lg md:w-16 md:h-16" size={32} /> : 
                <ShieldAlert className="text-rose-500 mb-1 md:mb-2 animate-pulse drop-shadow-lg md:w-16 md:h-16" size={32} />
              }
              <div className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${stats.isSustainable ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stats.isSustainable ? 'ODRŽIVO ✅' : 'RIZIČNO ❌'}
              </div>
            </div>
          </div>

          <h2 className="text-xl md:text-3xl font-serif font-bold mb-2 md:mb-4 leading-tight">Semafor Sigurnosti Budžeta</h2>
          <div className={`text-[10px] md:text-sm mb-4 md:mb-8 px-4 md:px-8 py-2 md:py-3 rounded-full font-black tracking-widest uppercase border-2 ${
            stats.isSustainable 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
          }`}>
            {stats.isSustainable ? 'Budžet je Održiv' : 'Potrebna Korekcija'}
          </div>
          
          <div className="w-full space-y-3 px-4 md:px-8">
            <div className={`flex justify-between items-center p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <span className="text-[10px] uppercase font-bold text-slate-500">Priliv od školarina</span>
              <span className="font-mono text-emerald-500 font-black">+{formattedCurrency(stats.revenueGrowth)}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <span className="text-[10px] uppercase font-bold text-slate-500">Trošak plata (Bruto)</span>
              <span className="font-mono text-rose-500 font-black">-{formattedCurrency(stats.grossIncrease)}</span>
            </div>
          </div>
        </motion.div>

        {/* Executive Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          
          {/* ČISTA DOBIT VRTIĆA */}
          <motion.div 
            className={`p-6 md:p-10 rounded-2xl md:rounded-[3rem] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'} border flex flex-col`}
          >
            <div className="flex justify-between items-start mb-6 md:mb-10">
              <h2 className={`text-lg md:text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Čista Dobit Vrtića</h2>
              <div className={`p-3 md:p-4 rounded-xl md:rounded-[1.5rem] ${stats.operationalBuffer >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                <Wallet className="md:w-7 md:h-7" size={20} />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-[8px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 md:mb-2 flex items-center">
                Neto Rezultat Strategije
                <TooltipIcon text="Iznos koji ostaje Ustanovi nakon isplate svih novih povišica i doprinosa državi." />
              </div>
              <div className={`text-2xl md:text-5xl font-mono font-black ${stats.operationalBuffer >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formattedCurrency(stats.operationalBuffer)}
              </div>
            </div>
          </motion.div>

          {/* TRI STUBA (Pravilnik 2026) */}
          <motion.div 
            className={`p-6 md:p-10 rounded-2xl md:rounded-[3rem] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'} border flex flex-col`}
          >
            <h2 className={`text-lg md:text-xl font-serif font-bold mb-6 md:mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Strateški Stubovi 2026</h2>
            <div className="space-y-4">
              {[
                { label: 'Stup Lojalnosti', info: 'Do 15% na osnovu staža.', icon: <Users size={14} />, color: '#fbbf24' },
                { label: 'Stup Stručnosti', info: '+5% za MA status.', icon: <Briefcase size={14} />, color: '#f59e0b' },
                { label: 'Stup Održivosti', info: 'Rast školarina vs plate.', icon: <TrendingUp size={14} />, color: stats.isSustainable ? '#10b981' : '#f43f5e' }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${s.color}15`, color: s.color }}>{s.icon}</div>
                  <div>
                    <div className={`text-[10px] font-black uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{s.label}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase">{s.info}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* GRAFIKON PROJEKCIJE */}
          <motion.div 
            className={`md:col-span-2 p-6 md:p-10 rounded-2xl md:rounded-[3rem] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'} border shadow-xl flex flex-col`}
          >
            <h2 className={`text-lg md:text-xl font-serif font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ukupni Trošak Plata (Bruto)</h2>
            <div className="w-full h-[200px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <BarChart data={barChartData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                  <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: '1rem', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [formattedCurrency(val), 'Bruto Trošak']}
                  />
                  <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={80} isAnimationActive={false}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? (isDark ? '#1e293b' : '#cbd5e1') : '#fbbf24'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Employee Matrix Section */}
      <section className="max-w-7xl mx-auto mb-20 md:mb-32 relative z-10">
        <div className={`border rounded-2xl md:rounded-[3.5rem] overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="p-6 md:p-12 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className={`text-xl md:text-3xl font-serif font-bold flex flex-col md:flex-row items-center gap-2 md:gap-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Users className="text-amber-500 md:w-9 md:h-9" size={24} />
                Matrica Strategije 2026
              </h2>
              <p className="text-slate-500 mt-2 text-[10px] md:text-sm uppercase tracking-widest font-black">
                Prikaz novih primanja radnika (Stub Lojalnosti + Stručnosti)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                className={`flex-1 px-4 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Save size={16} />
                Sačuvaj Simulaciju
              </button>
              <button 
                onClick={() => setIsReportOpen(true)}
                className="flex-1 px-4 py-3 md:px-10 md:py-5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Generiši Izvještaj
              </button>
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-[11px] uppercase font-black tracking-[0.2em] border-b border-slate-800`}>
                  <th className="px-12 py-8">Ime i Prezime</th>
                  <th className="px-6 py-8 text-center">Start</th>
                  <th className="px-6 py-8 text-center">Razred</th>
                  <th className="px-6 py-8">Stub Lojalnosti (%)</th>
                  <th className="px-6 py-8">Stručnost (MA)</th>
                  <th className="px-6 py-8 text-right">Nova Neto Plata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {employees.map((emp) => {
                  const loyaltyBonus = getLoyaltyBonus(emp.start);
                  const finalNet = calculateNewNet(emp);
                  const netDelta = finalNet - emp.currentNet;
                  return (
                    <tr key={emp.id} className={`transition-all ${isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50'}`}>
                      <td className="px-12 py-6">
                        <div className={`font-black uppercase text-sm tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{emp.name}</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase mt-1">{emp.role}</div>
                      </td>
                      <td className="px-6 py-6 text-center text-xs font-bold text-slate-400">{emp.start}</td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-[10px] font-black px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">{emp.cat}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`text-xs font-black ${loyaltyBonus > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {loyaltyBonus > 0 ? `+${(loyaltyBonus * 100).toFixed(0)}%` : '0%'}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <button onClick={() => toggleMA(emp.id)} className={`transition-all ${emp.ma ? 'text-amber-500' : 'text-slate-700'}`}>
                          {emp.ma ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="font-mono font-black text-lg">{formattedCurrency(finalNet)}</div>
                        <div className="text-[10px] text-emerald-500 font-bold">+{formattedCurrency(netDelta)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {employees.map((emp) => {
              const loyaltyBonus = getLoyaltyBonus(emp.start);
              const finalNet = calculateNewNet(emp);
              const netDelta = finalNet - emp.currentNet;
              return (
                <div key={emp.id} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className={`font-black uppercase text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{emp.name}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase">{emp.role}</div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">Kat {emp.cat}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-[10px] uppercase font-bold text-slate-500">
                    <div className="flex flex-col gap-1">
                      <span>Lojalnost</span>
                      <span className={loyaltyBonus > 0 ? 'text-emerald-500' : ''}>+{(loyaltyBonus * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Magistar</span>
                      <button onClick={() => toggleMA(emp.id)} className={`text-left font-black ${emp.ma ? 'text-amber-500' : 'text-slate-400'}`}>
                        {emp.ma ? 'AKTIVNO' : 'PASIVNO'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-slate-800/30 pt-4">
                    <div>
                      <div className="text-[8px] text-slate-500 uppercase font-black">Nova Plata 2026</div>
                      <div className="font-mono font-black text-xl">{formattedCurrency(finalNet)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 text-[10px] font-bold">+{formattedCurrency(netDelta)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ZBIRNI TROŠKOVI PO GRUPAMA */}
          <div className={`p-6 md:p-12 border-t border-slate-800 ${isDark ? 'bg-slate-950/60' : 'bg-slate-50'}`}>
            <h3 className={`text-sm md:text-base font-black uppercase tracking-widest mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Zbirni troškovi plata po grupama (Godišnji Bruto)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {groupSummaries.map((summary, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">
                    {summary.label}
                  </div>
                  <div className={`text-base md:text-2xl font-mono font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {formattedCurrency(summary.value)}
                  </div>
                  <div className="text-[9px] text-amber-500 font-bold uppercase mt-1">
                    Uključuje sve poreze (Faktor 1.63)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
              className="absolute inset-0 bg-slate-950/95 md:backdrop-blur-xl"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="relative w-full h-full md:h-auto md:max-w-4xl bg-white text-slate-900 md:rounded-[4rem] overflow-y-auto p-6 md:p-20 shadow-2xl"
            >
              <button 
                onClick={() => setIsReportOpen(false)}
                className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-300 hover:text-rose-500 transition-colors"
                aria-label="Zatvori"
              >
                <X size={32} />
              </button>

              <div className="flex items-center gap-3 text-amber-600 mb-8 md:mb-12 font-black uppercase text-xs md:text-sm tracking-[0.2em]">
                <GraduationCap size={24} />
                IMH Sarajevo
              </div>

              <h3 className="text-3xl md:text-6xl font-serif font-bold mb-8 md:mb-12 text-slate-950 leading-tight">Finansijski Plan Plata 2026</h3>
              
              <div className="space-y-10">
                <div className="p-8 md:p-12 rounded-3xl md:rounded-[3rem] bg-slate-50 border border-slate-100 italic text-lg md:text-3xl leading-relaxed text-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
                  "Uz povećanje školarine od <span className="font-black text-amber-600">{tuitionIncrease}%</span>, vrtić ostvaruje <span className="font-black text-emerald-600">{formattedCurrency(stats.revenueGrowth)}</span> godišnjeg rasta prihoda. Ovo u potpunosti pokriva nove povišice plata radnika uz stabilnu čistu dobit od <span className="font-black">{formattedCurrency(stats.operationalBuffer)}</span>."
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                   <div className="p-6 md:p-10 rounded-2xl border border-slate-100 bg-slate-50/50">
                     <span className="block text-[10px] uppercase font-black text-slate-400 mb-3">Ukupni godišnji Bruto (2025)</span>
                     <span className="text-xl md:text-3xl font-mono font-black">{formattedCurrency(stats.totalCurrentGross)}</span>
                   </div>
                   <div className="p-6 md:p-10 rounded-2xl border border-amber-100 bg-amber-50/30">
                     <span className="block text-[10px] uppercase font-black text-amber-600 mb-3">Ukupni godišnji Bruto (2026)</span>
                     <span className="text-xl md:text-3xl font-mono font-black text-amber-600">{formattedCurrency(stats.totalNewGross)}</span>
                   </div>
                </div>

                <div className="pt-12 md:pt-24 border-t border-slate-100 flex justify-between items-end gap-8 text-center">
                  <div className="flex-1">
                    <div className="w-full h-px bg-slate-200 mb-4" />
                    <div className="text-[9px] md:text-[10px] uppercase font-black text-slate-400">Direktor Ustanove</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-px bg-slate-200 mb-4" />
                    <div className="text-[9px] md:text-[10px] uppercase font-black text-slate-400">Pečat i Datum</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-5 md:py-8 bg-slate-950 text-white rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
                >
                  <Printer size={20} />
                  Odštampaj Izvještaj za Potpis
                </button>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="px-8 py-5 md:py-8 border-2 border-slate-100 text-slate-400 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest hover:border-slate-200 hover:text-slate-600 transition-all"
                >
                  Zatvori
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <footer className="max-w-7xl mx-auto py-12 md:py-20 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center gap-6 relative z-10">
         <div className="flex items-center gap-3 font-serif text-xl md:text-3xl font-bold opacity-30">
           <GraduationCap className="text-amber-500 md:w-10 md:h-10" size={24} />
           IMH Finance
         </div>
         <div className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 text-center leading-loose">
           STRATEŠKI ALAT ZA PROJEKCIJU 2026 • VERZIJA 2.0 <br />
           SVA PRAVA ZADRŽANA © 2025 INTERNATIONAL MONTESSORI HOUSE
         </div>
      </footer>
    </div>
  );
};

export default App;
