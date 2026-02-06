
import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

import { INITIAL_EMPLOYEES, INITIAL_PRICING, BASELINE_REVENUE_2025 } from './constants';
import { Employee } from './types';
import { calculateStats, calculateNewNet, getLoyaltyBonus, getExpertiseBonus } from './services/financialEngine';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [tuitionIncrease, setTuitionIncrease] = useState<number>(6);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const stats = useMemo(() => calculateStats(employees, tuitionIncrease), [employees, tuitionIncrease]);

  const toggleMA = (id: number) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ma: !e.ma } : e));
  };

  const formattedCurrency = (val: number) => {
    return new Intl.NumberFormat('bs-BA', { style: 'currency', currency: 'BAM' }).format(val);
  };

  const chartData = [
    { name: '2025 Realnost', value: stats.totalCurrentGross },
    { name: '2026 Strategija', value: stats.totalNewGross },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 lg:p-12 selection:bg-amber-500/30 font-sans">
      {/* Executive Header */}
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-amber-500 mb-3 font-semibold tracking-widest uppercase text-xs"
          >
            <GraduationCap size={16} />
            International Montessori House Sarajevo
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight"
          >
            IMH Strateški <br />
            <span className="text-amber-400">Modelator Plata 2026</span>
          </motion.h1>
          <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
            Interaktivni sistem za simulaciju finansijske održivosti i pravedne distribucije dohotka radnicima IMH-a.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 min-w-[340px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-amber-400" />
          </div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Klizač za povećanje školarine</span>
            <span className="text-amber-400 font-black text-3xl">{tuitionIncrease}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5"
            value={tuitionIncrease}
            onChange={(e) => setTuitionIncrease(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500 relative z-10"
          />
          <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black tracking-tighter relative z-10">
            <span>0% ODRŽIVOST</span>
            <span>OSNOVA: {formattedCurrency(BASELINE_REVENUE_2025)}</span>
            <span>10% MAX RAST</span>
          </div>
        </motion.div>
      </header>

      {/* Primary Analytics Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* MAGIC GAUGE: Indikator Održivosti */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-5 p-10 rounded-[3rem] border-2 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-700 shadow-2xl ${
            stats.isSustainable 
              ? 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-emerald-500/10' 
              : 'border-rose-500/40 bg-rose-500/[0.03] shadow-rose-500/10'
          }`}
        >
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: stats.isSustainable ? '#10b981' : '#f43f5e' }}></div>
          
          <div className={`relative mb-8 flex items-center justify-center`}>
            {/* Simple Gauge Animation */}
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96" cy="96" r="80"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                className="text-slate-800"
              />
              <motion.circle
                cx="96" cy="96" r="80"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="502.4"
                initial={{ strokeDashoffset: 502.4 }}
                animate={{ strokeDashoffset: 502.4 - (Math.min(tuitionIncrease, 10) / 10) * 502.4 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={stats.isSustainable ? "text-emerald-500" : "text-rose-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {stats.isSustainable ? 
                <ShieldCheck size={48} className="text-emerald-500 mb-1" /> : 
                <ShieldAlert size={48} className="text-rose-500 mb-1 animate-pulse" />
              }
            </div>
          </div>

          <h2 className="text-3xl font-serif mb-3">Indikator Održivosti Budžeta</h2>
          <div className={`text-sm mb-6 px-6 py-2 rounded-full font-black tracking-[0.2em] uppercase transition-colors duration-500 border-2 ${
            stats.isSustainable 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {stats.isSustainable ? 'BUDŽET JE ODRŽIV ✅' : 'BUDŽET NIJE ODRŽIV ❌'}
          </div>
          
          <p className="text-slate-500 text-sm max-w-xs mb-8 italic">
            Ovaj krug vam pokazuje da li novo povećanje školarine u potpunosti pokriva nove plate radnika.
          </p>

          <div className="w-full space-y-5 px-4">
            <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-500">Dodatni Prihod</span>
              <span className="font-mono text-xl text-emerald-500">+{formattedCurrency(stats.revenueGrowth)}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-500">Trošak Povećanja</span>
              <span className="font-mono text-xl text-rose-500">-{formattedCurrency(stats.grossIncrease)}</span>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* PROFIT SHIELD: Zaštita Profita */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex flex-col shadow-xl"
          >
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-serif text-white">Zaštita Profita</h2>
              <div className={`p-3 rounded-2xl ${stats.operationalBuffer >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                <Wallet size={24} />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Operativni Net Rezultat</div>
              <div className={`text-4xl font-mono font-black ${stats.operationalBuffer >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                {formattedCurrency(stats.operationalBuffer)}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info size={14} className="text-amber-500" />
                Razlika između novih prihoda i rashoda.
              </div>
            </div>
          </motion.div>

          {/* PILLARS VISUALIZATION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex flex-col shadow-xl"
          >
            <h2 className="text-xl font-serif text-white mb-8">Strateški Stubovi</h2>
            <div className="flex justify-between items-end h-full gap-4 pt-4">
              {[
                { label: 'Lojalnost', value: 85, color: '#fbbf24' },
                { label: 'Stručnost', value: 65, color: '#f59e0b' },
                { label: 'Održivost', value: stats.isSustainable ? 100 : 40, color: stats.isSustainable ? '#10b981' : '#f43f5e' }
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${p.value}%` }}
                    className="w-full rounded-t-xl mb-3 shadow-lg relative group"
                    style={{ backgroundColor: p.color, boxShadow: `0 0 20px ${p.color}33` }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DELTA COMPARISON CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-white">Godišnji Bruto Fond (Poređenje)</h2>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500">
                   <div className="w-2 h-2 rounded-full bg-slate-700"></div> 2025
                 </div>
                 <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500">
                   <div className="w-2 h-2 rounded-full bg-amber-500"></div> 2026
                 </div>
              </div>
            </div>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" hide />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                    formatter={(val: number) => [formattedCurrency(val), 'Bruto Fund']}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#1e293b' : '#fbbf24'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Main Employee Matrix */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="p-10 border-b border-slate-800 flex justify-between items-center flex-wrap gap-6">
            <div>
              <h2 className="text-3xl font-serif flex items-center gap-4 text-white">
                <Users className="text-amber-500" size={32} />
                Matrica Strategije 2026
              </h2>
              <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">
                Pregled individualnih povećanja zasnovan na Stupu Lojalnosti i Stručnosti
              </p>
            </div>
            <button 
              onClick={() => setIsReportOpen(true)}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-3"
            >
              <FileText size={18} />
              Pripremi izvještaj za potpis
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-[11px] uppercase font-black text-slate-400 tracking-[0.2em] border-b border-slate-800">
                  <th className="px-10 py-6">Ime i Prezime / Uloga</th>
                  <th className="px-6 py-6 text-center">Godina</th>
                  <th className="px-6 py-6 text-center">Razred</th>
                  <th className="px-6 py-6">Dodatak na lojalnost (%)</th>
                  <th className="px-6 py-6">Magistar (MA)</th>
                  <th className="px-6 py-6 text-right">Nova plata (Neto KM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                <AnimatePresence mode="popLayout">
                  {employees.map((emp) => {
                    const loyaltyBonus = getLoyaltyBonus(emp.start);
                    const expertiseBonus = getExpertiseBonus(emp.ma);
                    const finalNet = calculateNewNet(emp);
                    const netDelta = finalNet - emp.currentNet;
                    
                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={emp.id} 
                        className="hover:bg-slate-800/20 transition-all group"
                      >
                        <td className="px-10 py-6">
                          <div className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors uppercase text-sm tracking-wide">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-black uppercase mt-1 flex items-center gap-2">
                            <Briefcase size={12} className="text-slate-600" />
                            {emp.role}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 text-slate-400 text-[11px] font-bold">
                            <Calendar size={12} className="text-slate-600" />
                            {emp.start}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="text-[11px] font-black px-2 py-1 bg-amber-500/5 text-amber-500 border border-amber-500/20 rounded">
                            {emp.cat}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-xl ${loyaltyBonus > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
                               <Scale size={16} />
                             </div>
                             <div className="flex flex-col">
                               <span className={`text-sm font-black ${loyaltyBonus > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                                 {loyaltyBonus > 0 ? `+${loyaltyBonus * 100}%` : '0%'}
                               </span>
                               <span className="text-[9px] uppercase text-slate-500 font-bold">Pilar I</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <button 
                            onClick={() => toggleMA(emp.id)}
                            className="flex items-center gap-3 group/ma transition-all"
                          >
                            <div className={`transition-colors duration-300 ${emp.ma ? 'text-amber-400' : 'text-slate-700'}`}>
                              {emp.ma ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </div>
                            <div className="flex flex-col text-left">
                               <span className={`text-sm font-black transition-colors ${emp.ma ? 'text-amber-400' : 'text-slate-600'}`}>
                                 {emp.ma ? '+5%' : '0%'}
                               </span>
                               <span className="text-[9px] uppercase text-slate-500 font-bold">Pilar II</span>
                             </div>
                          </button>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="font-mono font-black text-white text-xl">
                            {formattedCurrency(finalNet)}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-black flex items-center justify-end gap-1 mt-1">
                            <ChevronRight size={12} />
                            +{formattedCurrency(netDelta)}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-950/80 p-8 flex items-center justify-between text-[11px] text-slate-500 font-black tracking-widest uppercase border-t border-slate-800">
             <div className="flex items-center gap-10">
                <span className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                  Održivost Aktivna
                </span>
                <span className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]"></div>
                  Bruto Faktor 1.63
                </span>
                <span className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700 shadow-[0_0_12px_rgba(51,65,85,0.4)]"></div>
                  Fiskalna godina 2026
                </span>
             </div>
             <div className="text-slate-600 italic font-medium normal-case">
               Softverski model usklađen sa strateškom odlukom uprave IMH.
             </div>
          </div>
        </div>
      </motion.div>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white text-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-12"
            >
              <button 
                onClick={() => setIsReportOpen(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={28} />
              </button>

              <div className="flex items-center gap-3 text-amber-600 mb-8 font-black uppercase text-xs tracking-widest">
                <GraduationCap size={20} />
                International Montessori House Sarajevo
              </div>

              <h3 className="text-4xl font-serif mb-8 text-slate-950">Izvještaj o Strateškom Planu Plata 2026</h3>
              
              <div className="space-y-8 py-4">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 italic text-lg leading-relaxed text-slate-700">
                  "Sa povećanjem školarine od <span className="font-bold text-amber-600">{tuitionIncrease}%</span>, IMH ostvaruje <span className="font-bold text-emerald-600">{formattedCurrency(stats.revenueGrowth)}</span> dodatnog godišnjeg prihoda, što omogućava povećanje plata za <span className="font-bold">19 radnika</span> uz zadržavanje potpune finansijske stabilnosti i operativnog buffera od <span className="font-bold">{formattedCurrency(stats.operationalBuffer)}</span>."
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                   <div>
                     <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Ukupan godišnji Bruto (Staro)</span>
                     <span className="text-xl font-mono font-bold">{formattedCurrency(stats.totalCurrentGross)}</span>
                   </div>
                   <div>
                     <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Ukupan godišnji Bruto (Novo)</span>
                     <span className="text-xl font-mono font-bold text-amber-600">{formattedCurrency(stats.totalNewGross)}</span>
                   </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex justify-between items-end">
                  <div className="w-48 h-px bg-slate-300"></div>
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Pečat i Potpis Uprave</div>
                  <div className="w-48 h-px bg-slate-300"></div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                >
                  <Printer size={18} />
                  Odštampaj izvještaj
                </button>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="px-8 py-5 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-200 hover:text-slate-600 transition-all"
                >
                  Zatvori
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <footer className="max-w-7xl mx-auto mt-24 pb-16 border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center text-slate-600 gap-6">
         <div className="flex items-center gap-3 font-serif text-2xl text-white/40">
           <GraduationCap className="text-amber-500/50" size={32} />
           IMH <span className="text-white/20">Finance Strategist</span>
         </div>
         <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-700 text-center md:text-right">
           MODEL VERZIJA 3.1.2026 • USKLAĐENO SA PRAVILNIKOM O RADU IMH <br />
           SVA PRAVA ZADRŽANA © 2025
         </div>
      </footer>
    </div>
  );
};

export default App;
