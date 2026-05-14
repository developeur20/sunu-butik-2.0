import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Package, 
  Users, Calendar, Clock, Download, FileText, ChevronRight,
  ShoppingBag, ArrowUpRight, ArrowDownRight, Printer, Mail
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Sale, Product, Employee } from '../../types';

export default function ReportsModule() {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const { sales, products, expenses, employees, currentUser } = useStore();

  const mySales = useMemo(() => sales.filter(s => s.shopId === currentUser?.uid), [sales, currentUser]);
  const myEmployees = useMemo(() => employees.filter(e => e.ownerId === currentUser?.uid), [employees, currentUser]);

  const stats = useMemo(() => {
    const totalRevenue = mySales.reduce((acc, s) => acc + s.total, 0);
    const totalProfit = mySales.reduce((acc, s) => {
        const saleProfit = s.items.reduce((pAcc, item) => pAcc + (item.price - item.buyPrice) * item.quantity, 0);
        return acc + saleProfit;
    }, 0);
    const totalExpenses = expenses.filter(e => e.shopId === currentUser?.uid).reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalProfit - totalExpenses;
    
    return { totalRevenue, totalProfit, totalExpenses, netProfit };
  }, [mySales, expenses, currentUser]);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">Rapports & <span className="text-primary italic">Analyses</span></h3>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Génération automatique des performances boutique</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setReportPeriod(p)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                reportPeriod === p ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:bg-tris'
              }`}
            >
              {p === 'daily' ? 'Jour' : p === 'weekly' ? 'Semaine' : p === 'monthly' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard label="Chiffre d'Affaires" value={`${stats.totalRevenue.toLocaleString()} F`} icon={DollarSign} color="blue" trend="+12%" />
        <ReportCard label="Bénéfice Brut" value={`${stats.totalProfit.toLocaleString()} F`} icon={TrendingUp} color="green" trend="+18%" />
        <ReportCard label="Dépenses Total" value={`${stats.totalExpenses.toLocaleString()} F`} icon={TrendingDown} color="red" trend="+5%" />
        <ReportCard label="Bénéfice Net" value={`${stats.netProfit.toLocaleString()} F`} icon={BarChart3} color="purple" trend="+14%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
             <h4 className="text-lg font-black text-secondary uppercase tracking-tight">Courbe de Croissance</h4>
             <div className="flex gap-2">
                <button className="p-2 border border-gray-100 rounded-xl hover:bg-gris transition-all"><Printer className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 border border-gray-100 rounded-xl hover:bg-gris transition-all"><Download className="w-4 h-4 text-gray-400" /></button>
             </div>
          </div>
          <div className="h-64 flex items-end gap-3 px-4">
             {[45, 60, 35, 85, 55, 95, 75, 40, 65, 50, 80, 90].map((h, i) => (
                <div key={i} className="flex-grow group relative h-full flex flex-col justify-end">
                   <div className="w-full bg-tris rounded-t-xl transition-all duration-500 group-hover:bg-primary/20 relative cursor-pointer" style={{ height: `${h}%` }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all bg-secondary text-white text-[10px] px-2 py-1 rounded mb-1 whitespace-nowrap">{(h * 1000).toLocaleString()} F</div>
                      <div className="absolute inset-0 brand-gradient opacity-10 rounded-t-xl"></div>
                   </div>
                   <span className="text-[8px] font-black text-gray-400 text-center mt-3 uppercase">{i+1}</span>
                </div>
             ))}
          </div>
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 italic">Analyse comparative des revenus sur la période</p>
        </div>

        {/* Top Sold Products */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
           <h4 className="text-lg font-black text-secondary uppercase tracking-tight mb-8">Produits Stars</h4>
           <div className="space-y-6">
              {products.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 group">
                   <div className="w-12 h-12 bg-tris rounded-2xl flex items-center justify-center text-primary font-black italic group-hover:scale-110 transition-transform">{i+1}</div>
                   <div className="flex-grow">
                      <p className="text-sm font-bold text-secondary">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="flex-grow h-1.5 bg-gris rounded-full overflow-hidden">
                            <div className="h-full brand-gradient" style={{ width: `${95-i*15}%` }}></div>
                         </div>
                         <span className="text-[10px] font-black text-primary">{Math.max(5, 50-i*10)} vtes</span>
                      </div>
                   </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-center py-10 text-gray-400 text-xs italic">Aucune donnée de vente disponible.</p>}
           </div>
           <button className="w-full mt-8 py-4 bg-gris text-secondary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-secondary hover:text-white transition-all">Consulter tout le catalogue</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Employee Performance */}
         <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-lg font-black text-secondary uppercase tracking-tight mb-8 flex items-center gap-2">
               <Users className="w-5 h-5 text-primary" /> Performance Collaborateurs
            </h4>
            <div className="space-y-4">
               {myEmployees.map((emp, i) => (
                 <div key={emp.id} className="p-5 bg-tris rounded-3xl border border-gray-50 hover:border-primary/20 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-black text-sm">{emp.name[0]}</div>
                       <div>
                          <p className="text-sm font-bold text-secondary">{emp.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{emp.role}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-secondary">{(Math.random() * 500000).toLocaleString()} F</p>
                       <p className="text-[10px] text-green-500 font-bold uppercase">Objectif: 92%</p>
                    </div>
                 </div>
               ))}
               {myEmployees.length === 0 && <p className="text-center py-10 text-gray-400 italic text-sm">Embauchez pour suivre les performances.</p>}
            </div>
         </div>

         {/* Time Activity */}
         <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-lg font-black text-secondary uppercase tracking-tight mb-8 flex items-center gap-2">
               <Clock className="w-5 h-5 text-primary" /> Pics d'Activité
            </h4>
            <div className="space-y-4">
               {[
                 { time: '08h - 10h', level: 30, color: 'blue' },
                 { time: '10h - 12h', level: 85, color: 'primary' },
                 { time: '12h - 14h', level: 45, color: 'orange' },
                 { time: '14h - 17h', level: 95, color: 'primary' },
                 { time: '17h - 20h', level: 60, color: 'blue' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 h-8">
                    <span className="text-[10px] font-black text-gray-400 w-16">{item.time}</span>
                    <div className="flex-grow h-full bg-gris rounded-lg overflow-hidden">
                       <div className={`h-full ${item.color === 'primary' ? 'brand-gradient' : 'bg-secondary/20'} transition-all duration-1000`} style={{ width: `${item.level}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-secondary w-8">{item.level}%</span>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between text-xs font-bold">
               <span className="text-gray-400">Période la plus forte:</span>
               <span className="text-primary uppercase tracking-widest">14h - 17h (Après-midi)</span>
            </div>
         </div>
      </div>

      {/* Export Section */}
      <div className="bg-secondary p-12 rounded-[50px] text-white shadow-2xl shadow-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 brand-gradient rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div>
                <h4 className="text-3xl font-black tracking-tighter mb-4">Rapports Automatisés</h4>
                <p className="text-gray-400 max-w-md">Recevez vos bilans par email chaque fin de période. Configurez vos préférences d'envoi.</p>
             </div>
             <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all">
                   <Mail className="w-5 h-5" /> Configurer l'envoi
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-white transition-all border border-white/5 flex items-center gap-3">
                   <FileText className="w-5 h-5" /> Télécharger Bilan Complet
                </button>
             </div>
          </div>
      </div>
    </div>
  );
}

function ReportCard({ label, value, icon: Icon, color, trend }: { 
  label: string; 
  value: string; 
  icon: any; 
  color: 'green' | 'blue' | 'red' | 'purple';
  trend: string;
}) {
  const colors = {
    green: 'bg-green-50 text-green-500',
    blue: 'bg-blue-50 text-blue-500',
    red: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-500',
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-2xl transition-all relative overflow-hidden">
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-[0.05] group-hover:scale-125 transition-transform ${colors[color].split(' ')[0]}`}></div>
      <div className="flex items-center justify-between mb-8">
        <div className={`p-5 rounded-[24px] ${colors[color]} group-hover:scale-110 transition-transform shadow-lg shadow-current/10`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${trend.startsWith('+') ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
          {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <h4 className="text-3xl font-black text-secondary tracking-tighter group-hover:text-primary transition-colors">{value}</h4>
      </div>
    </div>
  );
}
