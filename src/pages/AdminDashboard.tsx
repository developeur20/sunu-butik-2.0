import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Box, ShoppingCart, Users, CreditCard, Settings, 
  Menu, X, TrendingUp, DollarSign, Package, UserPlus, 
  Search, Bell, LogOut, LayoutDashboard, Layers, Star, ShoppingBag,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, ShieldCheck,
  Store, AlertTriangle, PlayCircle, PauseCircle, Trophy, Percent,
  Gift, Save, Plus, Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PLANS, Product, Subscription, ActivityLog, User, PlanId } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { products, subscriptions, currentUser, logout, activityLogs, allUsers, suspendUser, activateUser } = useStore();
  const navigate = useNavigate();

  const platformUsers = useMemo(() => allUsers.filter(u => u.role === 'owner' || u.role === 'customer'), [allUsers]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalRevenue = useMemo(() => {
    return subscriptions.reduce((acc, sub) => acc + PLANS[sub.planId].price, 0);
  }, [subscriptions]);

  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'sellers', label: 'Boutiques', icon: Store },
    { id: 'subscriptions', label: 'Offres & Tarifs', icon: Star },
    { id: 'global-challenges', label: 'Challenges Globaux', icon: Trophy },
    { id: 'activity', label: 'Logs Système', icon: Clock },
    { id: 'settings', label: 'Paramètres Plateforme', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-tris overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-secondary border-r border-white/5 flex flex-col z-50"
      >
        <div className="p-6 flex items-center justify-between">
           <div className={isSidebarOpen ? "flex items-center gap-3" : "hidden"}>
             <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
             <span className="text-xl font-bold font-display text-white">SUNU<span className="text-primary italic">ADMIN</span></span>
           </div>
           {!isSidebarOpen && <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-bold mx-auto">S</div>}
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden bg-gris/30">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gris rounded-lg text-secondary">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-secondary hidden sm:block uppercase tracking-wider">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Système Sécurisé</span>
            </div>
            <button className="p-2 relative hover:bg-gris rounded-lg">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-secondary">Ngary Pro</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Master Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 italic">NP</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Recettes Totales" value={`${totalRevenue.toLocaleString()} F`} change="+15%" icon={DollarSign} color="green" />
                  <StatCard label="Inscriptions" value={subscriptions.length.toString()} change="+8%" icon={UserPlus} color="blue" />
                  <StatCard label="Produits Globaux" value={products.length.toString()} change="+12%" icon={Box} color="purple" />
                  <StatCard label="Logs Système" value={activityLogs.length.toString()} change="+2%" icon={Clock} color="indigo" />
                </div>

                {/* Main View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Chart Placeholder */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className={`absolute -bottom-10 -right-10 w-64 h-64 brand-gradient rounded-full opacity-[0.02] group-hover:scale-110 transition-transform`}></div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-secondary">Volume d'affaires mensuel</h3>
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="h-[300px] flex items-end gap-3">
                       {[30, 45, 25, 60, 40, 75, 55, 90, 70, 85, 95, 80].map((h, i) => (
                         <div key={i} className="flex-grow flex flex-col items-center gap-3">
                           <div className="w-full bg-gris rounded-t-xl group/bar relative" style={{ height: `${h}%` }}>
                              <div className="absolute inset-0 brand-gradient opacity-0 group-hover/bar:opacity-100 transition-all rounded-t-xl"></div>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 capitalize">{['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Subscriptions List */}
                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Derniers Abonnés</h3>
                    <div className="space-y-4">
                      {subscriptions.slice(0, 5).map(sub => (
                        <div key={sub.id} className="flex items-center gap-4 p-3 hover:bg-tris rounded-2xl transition-all border border-transparent hover:border-gray-100">
                          <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-black italic shadow-md">S</div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-secondary truncate">Vendeur ID: {sub.userId.substring(0, 5)}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest">{sub.planId}</p>
                          </div>
                          <div className="ml-auto text-right">
                             <p className="text-xs font-bold text-secondary">{PLANS[sub.planId].price.toLocaleString()} F</p>
                             <p className="text-[10px] text-gray-400">{new Date(sub.startDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                      {subscriptions.length === 0 && (
                        <div className="py-20 text-center text-gray-400 italic text-sm">
                           Aucun abonné pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Global Activity */}
                <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-secondary">Journal Mondial des Événements</h3>
                    <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Monitor Complet</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {activityLogs.slice(0, 10).map(log => (
                      <div key={log.id} className="px-8 py-5 flex items-center gap-6 hover:bg-tris/30 transition-all">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          log.action === 'create' ? 'bg-green-50 text-green-500' :
                          log.action === 'delete' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex-grow">
                           <p className="text-xs font-bold text-secondary">{log.details}</p>
                           <p className="text-[10px] text-gray-400">Par <span className="font-bold text-primary">{log.userName}</span> • {new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-gris rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">{log.action}</span>
                      </div>
                    ))}
                    {activityLogs.length === 0 && (
                      <div className="p-20 text-center text-gray-400 italic">En attente de données système...</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'sellers' && (
              <motion.div 
                key="sellers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Gestion des Boutiques</h3>
                        <p className="text-sm text-gray-500 mt-1">Supervisez et gérez tous les boutiquiers enregistrés.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Rechercher une boutique..." className="pl-10 pr-4 py-2 bg-gris rounded-xl text-sm outline-none focus:ring-2 ring-primary/20 transition-all border-none" />
                        </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-tris/50 border-b border-gray-50">
                         <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Insc.</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                         {platformUsers.map(user => (
                           <tr key={user.uid} className="hover:bg-tris/30 transition-all group">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-black italic">
                                       {user.displayName?.[0] || user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-secondary">{user.displayName || 'Utilisateur Sans Nom'}</p>
                                       <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                                    user.role === 'owner' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-500'
                                 }`}>
                                    {user.role}
                                 </span>
                              </td>
                              <td className="px-8 py-5 text-sm text-gray-500">
                                 {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    <span className="text-xs font-bold text-secondary">{user.isActive ? 'Actif' : 'Suspendu'}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2 text-primary font-bold">
                                    {user.isActive ? (
                                       <button onClick={() => suspendUser(user.uid)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all" title="Suspendre">
                                          <PauseCircle className="w-5 h-5" />
                                       </button>
                                    ) : (
                                       <button onClick={() => activateUser(user.uid)} className="p-2 hover:bg-green-50 text-green-500 rounded-xl transition-all" title="Réactiver">
                                          <PlayCircle className="w-5 h-5" />
                                       </button>
                                    )}
                                    <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all" title="Détails">
                                       <ShieldCheck className="w-5 h-5" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                         {platformUsers.length === 0 && (
                            <tr>
                               <td colSpan={5} className="py-20 text-center text-gray-400 italic">Aucun utilisateur à superviser pour le moment.</td>
                            </tr>
                         )}
                       </tbody>
                     </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'subscriptions' && (
               <motion.div 
                 key="subscriptions"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {Object.values(PLANS).map(plan => (
                        <div key={plan.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-tris rounded-2xl flex items-center justify-center text-primary">
                                    <Star className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <h4 className="text-xl font-black text-secondary uppercase tracking-tight">{plan.name}</h4>
                                    <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">ID: {plan.id}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-black text-primary">{plan.price.toLocaleString()} F</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Par mois</p>
                              </div>
                           </div>

                           <div className="space-y-4 mb-8">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Modifier le Tarif (FCFA)</label>
                              <div className="flex gap-3">
                                 <input type="number" defaultValue={plan.price} className="flex-grow px-4 py-3 bg-tris rounded-xl border-none outline-none focus:ring-2 ring-primary/20 font-bold" />
                                 <button className="px-6 py-3 bg-secondary text-white rounded-xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Sauver
                                 </button>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <p className="text-xs font-black text-secondary uppercase tracking-widest mb-4">Avantages inclus</p>
                              {plan.features.map((f, i) => (
                                 <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                                 </div>
                              ))}
                           </div>

                           <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-400">Statut de l'offre</span>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
                                 <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                    ))}
                 </div>

                 <div className="bg-secondary p-12 rounded-[50px] shadow-2xl shadow-secondary/20 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-96 h-96 brand-gradient rounded-full blur-[120px] opacity-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div>
                          <h3 className="text-3xl font-black tracking-tighter mb-4">Campagne Promotionnelle</h3>
                          <p className="text-gray-400 max-w-md">Créez des remises temporaires, des essais gratuits ou des codes promos pour booster les inscriptions.</p>
                       </div>
                       <div className="flex flex-wrap gap-4">
                          <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all">
                             <Percent className="w-5 h-5" /> Nouvelle Promo
                          </button>
                          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/5">
                             <Gift className="w-5 h-5" /> Essais Gratuits
                          </button>
                       </div>
                    </div>
                 </div>
               </motion.div>
            )}

            {activeTab === 'global-challenges' && (
                <motion.div 
                  key="challenges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                   <div className="flex items-center justify-between">
                      <div>
                         <h3 className="text-3xl font-black text-secondary tracking-tighter uppercase">Compétitions Inter-Boutiques</h3>
                         <p className="text-gray-500 mt-1">Créez de l'émulation entre les commerçants de la plateforme.</p>
                      </div>
                      <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:scale-105 shadow-xl shadow-primary/20 transition-all">
                         <Plus className="w-5 h-5" /> Nouveau Challenge
                      </button>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                         {[1, 2].map(i => (
                            <div key={i} className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm group hover:border-primary/30 transition-all relative">
                               <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 bg-gris rounded-[24px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Trophy className="w-8 h-8" />
                                     </div>
                                     <div>
                                        <h4 className="text-2xl font-black text-secondary tracking-tight">Challenge Boutique Pro {i}</h4>
                                        <p className="text-sm text-gray-400">Objectif: 1,000,000 F de CA en 7 jours</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <span className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">En cours</span>
                                     <p className="text-xs text-gray-400 mt-2">Fin dans 3 jours</p>
                                  </div>
                               </div>

                               <div className="space-y-6">
                                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                     <span>Leader: Boutique Excellence 4</span>
                                     <span className="text-primary">85% Accomplis</span>
                                  </div>
                                  <div className="w-full h-4 bg-gris rounded-full overflow-hidden">
                                     <div className="h-full brand-gradient w-[85%] rounded-full shadow-lg shadow-primary/20"></div>
                                  </div>
                               </div>

                               <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-between">
                                  <div className="flex -space-x-4">
                                     {[1, 2, 3, 4, 5].map(j => (
                                        <div key={j} className="w-10 h-10 rounded-full border-4 border-white brand-gradient flex items-center justify-center text-[10px] text-white font-bold italic shadow-sm">B{j}</div>
                                     ))}
                                     <div className="w-10 h-10 rounded-full border-4 border-white bg-gris flex items-center justify-center text-[10px] text-gray-400 font-bold">+12</div>
                                  </div>
                                  <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Voir le classement complet</button>
                               </div>
                            </div>
                         ))}
                      </div>

                      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-fit sticky top-28">
                         <h4 className="text-lg font-black text-secondary uppercase tracking-widest mb-6">Récompenses Actives</h4>
                         <div className="space-y-4">
                            {[
                               { label: 'Exonération 1 mois', qty: 'Plan Premium', icon: Star },
                               { label: 'Badge "Vendeur Certifié"', qty: 'Illimité', icon: CheckCircle },
                               { label: 'Promotion Booster AI', qty: '3 jours / Gagnant', icon: Zap },
                            ].map((reward, i) => (
                               <div key={i} className="p-5 bg-tris rounded-3xl border border-gray-50 flex items-center gap-4">
                                  <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                     <reward.icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-secondary">{reward.label}</p>
                                     <p className="text-[10px] text-primary font-black uppercase tracking-widest">{reward.qty}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                 <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-8">Journal Global de la Plateforme</h3>
                    <div className="space-y-4">
                       {activityLogs.map(log => (
                         <div key={log.id} className="flex gap-6 p-6 bg-tris/30 rounded-3xl border border-gray-50 hover:border-primary/20 transition-all">
                            <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center ${
                               log.action === 'create' ? 'bg-green-50 text-green-500' :
                               log.action === 'delete' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                               <Clock className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                               <p className="font-bold text-secondary">{log.details}</p>
                               <p className="text-xs text-gray-400 mt-1">Acteur: {log.userName} ({log.userId})</p>
                               <div className="mt-3 flex items-center gap-4">
                                  <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full text-primary border border-gray-100 uppercase tracking-widest">{log.entityType}</span>
                                  <span className="text-[10px] text-gray-300 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                               </div>
                            </div>
                         </div>
                       ))}
                       {activityLogs.length === 0 && (
                          <div className="py-20 text-center text-gray-400 italic">Aucun événement système enregistré.</div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-lg font-black text-secondary uppercase tracking-tight mb-6">Paramètres de Sécurité</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-tris rounded-2xl">
                        <div>
                           <p className="text-sm font-bold text-secondary">Double Authentification (2FA)</p>
                           <p className="text-[10px] text-gray-400">Ajoutez une couche de sécurité via mobile.</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-tris rounded-2xl">
                        <div>
                           <p className="text-sm font-bold text-secondary">Journalisation Avancée</p>
                           <p className="text-[10px] text-gray-400">Historique complet des connexions IP.</p>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer flex justify-end">
                           <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black text-secondary uppercase tracking-tight mb-6">Configuration Plateforme</h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Commission par vente (%)</label>
                          <input type="number" defaultValue={2.5} className="w-full px-5 py-4 bg-tris rounded-2xl border-none font-bold outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Support Global</label>
                          <input type="email" defaultValue="support@sunubutik.com" className="w-full px-5 py-4 bg-tris rounded-2xl border-none font-bold outline-none" />
                       </div>
                       <button className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 transition-all">Mettre à jour la config</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== 'overview' && activeTab !== 'activity' && activeTab !== 'settings' && activeTab !== 'sellers' && activeTab !== 'subscriptions' && activeTab !== 'global-challenges' && (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[40px] border border-gray-100 min-h-[60vh] flex flex-col items-center justify-center text-center p-12 shadow-sm"
              >
                <div className="w-24 h-24 bg-gris rounded-full flex items-center justify-center mb-8 relative">
                  <Box className="w-12 h-12 text-gray-300" />
                  <div className="absolute inset-0 brand-gradient opacity-10 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">Module {sidebarItems.find(i => i.id === activeTab)?.label}</h3>
                <p className="text-gray-500 max-w-sm italic">
                  "Contrôle total en cours de déploiement pour une supervision administrative sans précédent."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, color }: { 
  label: string; 
  value: string; 
  change: string; 
  icon: any; 
  color: 'green' | 'blue' | 'purple' | 'indigo' | 'red' 
}) {
  const colors = {
    green: 'bg-green-50 text-green-500 border-green-100',
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    purple: 'bg-purple-50 text-purple-500 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-500 border-indigo-100',
    red: 'bg-red-50 text-red-500 border-red-100',
  };

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all overflow-hidden relative">
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform ${colors[color].split(' ')[0]}`}></div>
      <div className="flex items-center justify-between mb-8">
        <div className={`p-5 rounded-3xl ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]} shadow-lg shadow-current/5 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>
           Stable {change}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <h4 className="text-3xl font-black text-secondary tracking-tighter group-hover:text-primary transition-colors">{value}</h4>
      </div>
    </div>
  );
}
