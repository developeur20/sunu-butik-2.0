import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Box, Users, Star, Plus, ShieldCheck, Mail, LogOut, 
  Search, Filter, SlidersHorizontal, ChevronRight, TrendingUp, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Package, Archive, Clock, BarChart3,
  Calendar, Info, Edit, Trash2, RotateCcw, CheckCircle, XCircle, FileText, Download,
  Menu, CreditCard, Store, Settings2, Wallet, Tag, Bell, Trophy
} from 'lucide-react';
import { PLANS, PlanId, Product, Employee, ActivityLog } from '../types';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/forms/ProductForm';
import EmployeeForm from '../components/forms/EmployeeForm';
import ExpenseForm from '../components/forms/ExpenseForm';
import ShopSettings from '../components/dashboard/ShopSettings';
import PaymentMethodsList from '../components/dashboard/PaymentMethodsList';
import SubscriptionManager from '../components/dashboard/SubscriptionManager';
import CategoryManager from '../components/dashboard/CategoryManager';
import ReportsModule from '../components/dashboard/ReportsModule';
import ChallengesModule from '../components/dashboard/ChallengesModule';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import { useNotifications } from '../context/NotificationContext';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { 
    currentUser, logout, subscriptions, products, employees, 
    activityLogs, categories, deleteProduct, archiveProduct, restoreProduct,
    addCategory, restoreEmployee, archiveEmployee, updateEmployee,
    notifications
  } = useStore();

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setIsEmployeeModalOpen(true);
  };

  const handleArchiveEmployee = (id: string) => {
    archiveEmployee(id);
    showNotification('info', 'Accès suspendu', 'Le collaborateur a été désactivé.');
  };

  const handleRestoreEmployee = (id: string) => {
    restoreEmployee(id);
    showNotification('success', 'Accès restauré', 'Le collaborateur est à nouveau actif.');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName);
    setNewCategoryName('');
    showNotification('success', 'Catégorie ajoutée', `La catégorie ${newCategoryName} est disponible.`);
  };

  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const userSub = subscriptions.find(s => s.userId === currentUser?.uid);
  const currentPlanId: PlanId = userSub?.planId || 'basic';
  const plan = PLANS[currentPlanId];

  const myProducts = useMemo(() => products.filter(p => p.ownerId === currentUser?.uid && !p.isArchived), [products, currentUser]);
  const archivedProducts = useMemo(() => products.filter(p => p.ownerId === currentUser?.uid && p.isArchived), [products, currentUser]);
  const myEmployees = useMemo(() => employees.filter(e => e.ownerId === currentUser?.uid && !e.isArchived), [employees, currentUser]);
  const myLogs = useMemo(() => activityLogs.filter(l => l.userId === currentUser?.uid).slice(0, 50), [activityLogs, currentUser]);

  const stats = useMemo(() => {
    const total = myProducts.length;
    const stockOut = myProducts.filter(p => p.stock === 0).length;
    const lowStock = myProducts.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const totalValue = myProducts.reduce((acc, p) => acc + (p.stock * p.buyPrice), 0);
    const estimatedValue = myProducts.reduce((acc, p) => acc + (p.stock * p.price), 0);
    const estimatedProfit = estimatedValue - totalValue;

    return { total, stockOut, lowStock, totalValue, estimatedProfit };
  }, [myProducts]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce produit ?')) {
      deleteProduct(id);
      showNotification('success', 'Suppression définitive', 'Le produit a été retiré du système.');
    }
  };

  const handleArchiveProduct = (id: string) => {
    archiveProduct(id);
    showNotification('info', 'Produit archivé', 'Le produit est désormais dans vos archives.');
  };

  const handleRestoreProduct = (id: string) => {
    restoreProduct(id);
    showNotification('success', 'Produit restauré', 'Le produit est à nouveau actif dans votre boutique.');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'inventory', label: 'Espace Produits', icon: Box },
    { id: 'reports', label: 'Rapports & Analyses', icon: BarChart3 },
    { id: 'challenges', label: 'Challenges Équipe', icon: Trophy },
    { id: 'categories', label: 'Gestion Rayons', icon: Tag },
    { id: 'shop', label: 'Ma Boutique', icon: Store },
    { id: 'employees', label: 'Collaborateurs', icon: Users },
    { id: 'expenses', label: 'Dépenses & Flux', icon: CreditCard },
    { id: 'payments', label: 'Moyens de Paiement', icon: Wallet },
    { id: 'archives', label: 'Archives', icon: Archive },
    { id: 'activity', label: 'Journal d\'activités', icon: Clock },
    { id: 'settings', label: 'Paramètres Avancés', icon: Settings2 },
    { id: 'plans', label: 'Mon Abonnement', icon: Star },
  ];

  return (
    <div className="flex h-screen bg-tris overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-secondary border-r border-white/5 relative z-20 flex flex-col pt-4"
      >
        <div className="px-6 mb-12 flex items-center justify-between">
           <div className={isSidebarOpen ? "flex items-center gap-3" : "hidden"}>
             <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center font-black text-white italic">SB</div>
             <span className="font-black text-xl text-white tracking-tighter">SUNU<span className="text-primary italic">BUTIK</span></span>
           </div>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
             <Menu className="w-5 h-5" />
           </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className={`p-4 rounded-2xl bg-white/5 mb-4 ${!isSidebarOpen && 'hidden'}`}>
             <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Plan Actuel</p>
             <p className="text-sm font-bold text-white mb-2">{plan.name}</p>
             <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: '100%' }}></div>
             </div>
             <p className="text-[10px] text-gray-500 mt-2">
               {plan.employeeLimit === Infinity ? 'Employés illimités' : `${plan.employeeLimit - myEmployees.length} places restantes`}
             </p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all font-bold"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">Sortie de l'espace</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden bg-gris/30">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-secondary capitalize">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-xs text-gray-400">Gérez votre boutique en toute sérénité</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-tris rounded-xl border border-gray-100 min-w-[300px]">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..." 
                  className="bg-transparent border-none text-sm outline-none w-full" 
                />
             </div>
             <button 
                onClick={() => setIsNotifOpen(true)}
                className="p-2 bg-tris rounded-xl relative text-secondary hover:bg-primary hover:text-white transition-all group"
             >
                <Bell className="w-5 h-5 group-hover:animate-bounce" />
                {notifications.filter(n => !n.isRead && n.userId === currentUser?.uid).length > 0 && (
                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center">
                      {notifications.filter(n => !n.isRead && n.userId === currentUser?.uid).length}
                   </span>
                )}
             </button>
             <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
               <div className="text-right">
                 <p className="text-sm font-bold text-secondary">{currentUser?.displayName}</p>
                 <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{currentPlanId}</p>
               </div>
               <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                 {currentUser?.displayName?.[0].toUpperCase()}
               </div>
             </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Produits" value={stats.total.toString()} icon={Package} color="blue" />
                  <StatCard label="Ruptures Stock" value={stats.stockOut.toString()} icon={XCircle} color="red" trend={stats.stockOut > 0 ? 'down' : 'up'} />
                  <StatCard label="Stock Faible" value={stats.lowStock.toString()} icon={AlertTriangle} color="yellow" />
                  <StatCard label="Valeur Stock" value={`${stats.totalValue.toLocaleString()} F`} icon={TrendingUp} color="green" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Analysis Summary */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold">Performance du mois</h3>
                      <button className="flex items-center gap-2 text-sm text-primary font-bold hover:underline">
                        Exporter PDF <Download className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-4">
                       {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                         <div key={i} className="flex-grow flex flex-col items-center gap-4">
                           <div className="w-full bg-tris rounded-t-2xl relative group overflow-hidden" style={{ height: `${h}%` }}>
                              <div className="absolute inset-0 brand-gradient opacity-0 group-hover:opacity-100 transition-all"></div>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400">J-{6-i}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Quick Activity */}
                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Activités Récentes</h3>
                    <div className="space-y-4">
                      {myLogs.slice(0, 5).map(log => (
                        <div key={log.id} className="flex gap-4">
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                            log.action === 'create' ? 'bg-green-50 text-green-500' :
                            log.action === 'delete' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            <Box className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-secondary truncate">{log.details}</p>
                            <p className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                      {myLogs.length === 0 && (
                         <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-center">
                            <Clock className="w-12 h-12 mb-4 opacity-10" />
                            <p className="text-sm italic">Aucun historique récent</p>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <button 
                         onClick={handleAddProduct}
                         className="flex items-center gap-2 px-6 py-3 brand-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                       >
                         <Plus className="w-5 h-5" /> Ajouter un produit
                       </button>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100">
                       <input 
                          type="text" 
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nouvelle catégorie..." 
                          className="bg-transparent border-none text-xs outline-none px-3 w-40" 
                       />
                       <button 
                          onClick={handleAddCategory}
                          className="p-2 bg-secondary text-white rounded-xl hover:bg-primary transition-all"
                       ><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-tris transition-all active:scale-95"><Filter className="w-5 h-5 text-gray-500" /></button>
                       <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-gray-500 flex items-center gap-2 hover:bg-tris transition-all"><FileText className="w-4 h-4" /> Exporter</button>
                    </div>
                 </div>

                 <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                   <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-tris/50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-400">
                          <th className="px-8 py-6">Produit</th>
                          <th className="px-6 py-6">Catégorie</th>
                          <th className="px-6 py-6">Prix Vente</th>
                          <th className="px-6 py-6">Stock</th>
                          <th className="px-6 py-6 text-center">Status</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {myProducts.length > 0 ? myProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-tris/50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gris rounded-xl border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                                   {product.images && product.images.length > 0 ? (
                                     <img 
                                       src={product.images[0]} 
                                       alt={product.name}
                                       className="w-full h-full object-cover"
                                       referrerPolicy="no-referrer"
                                     />
                                   ) : (
                                     <Package className="w-6 h-6 text-gray-300" />
                                   )}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-secondary">{product.name}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">Ref: {product.reference}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-bold rounded-full uppercase tracking-wider">{product.category}</span>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-bold text-secondary">{product.price.toLocaleString()} F</p>
                              <p className="text-[10px] text-gray-400 font-bold italic">Bénéfice: {(product.price - product.buyPrice).toLocaleString()} F</p>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <span className={`text-sm font-bold ${
                                  product.stock === 0 ? 'text-red-500' : 
                                  product.stock <= product.lowStockThreshold ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {product.stock} en stock
                                </span>
                                <div className="w-24 h-1.5 bg-gris rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${product.stock === 0 ? 'bg-red-500' : product.stock <= product.lowStockThreshold ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                    style={{ width: `${Math.min((product.stock / (product.lowStockThreshold * 5)) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                {product.stock === 0 ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase"><XCircle className="w-3 h-3" /> Rupture</span>
                                ) : product.stock <= product.lowStockThreshold ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase"><AlertTriangle className="w-3 h-3" /> Critique</span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase"><CheckCircle className="w-3 h-3" /> Actif</span>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => handleEditProduct(product)}
                                   className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-all"
                                   title="Modifier"
                                 ><Edit className="w-4 h-4" /></button>
                                 <button 
                                   onClick={() => handleArchiveProduct(product.id)}
                                   className="p-2 hover:bg-yellow-50 text-yellow-500 rounded-lg transition-all"
                                   title="Archiver"
                                 ><Archive className="w-4 h-4" /></button>
                                 <button 
                                   onClick={() => handleDeleteProduct(product.id)}
                                   className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                                   title="Supprimer"
                                 ><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-8 py-32 text-center text-gray-400">
                              <div className="flex flex-col items-center gap-4">
                                 <Package className="w-16 h-16 opacity-10 mb-4" />
                                 <h4 className="text-xl font-bold text-secondary opacity-50">Aucun produit actif</h4>
                                 <p className="max-w-xs mx-auto text-sm">Commencez par ajouter vos premiers produits pour gérer votre activité.</p>
                                 <button onClick={handleAddProduct} className="mt-4 px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg">Ajouter mon premier produit</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <CategoryManager />
            )}

            {activeTab === 'shop' && (
              <ShopSettings />
            )}

            {activeTab === 'reports' && (
              <ReportsModule />
            )}

            {activeTab === 'challenges' && (
              <ChallengesModule />
            )}
            {activeTab === 'analysis' && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 flex flex-col gap-4 shadow-sm">
                       <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center font-bold">
                          <TrendingUp className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bénéfice estimé (Stock)</h4>
                          <p className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stats.estimatedProfit.toLocaleString()} F</p>
                          <p className="text-[10px] text-green-500 mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp className="w-3 h-3" /> Marge brute moyenne de {stats.totalValue > 0 ? Math.round((stats.estimatedProfit / stats.totalValue) * 100) : 0}%
                          </p>
                       </div>
                    </div>

                    <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                       <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" /> Prévisions Intelligentes des Stocks
                       </h4>
                       <div className="space-y-4">
                          {myProducts.filter(p => p.stock <= p.lowStockThreshold*2).slice(0, 3).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-tris rounded-2xl border border-gray-50 flex-wrap gap-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">{p.name[0]}</div>
                                  <div>
                                     <p className="text-sm font-bold text-secondary">{p.name}</p>
                                     <p className="text-[10px] text-gray-400 italic">Rotation estimée: Rapide</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className={`text-sm font-bold ${p.stock <= p.lowStockThreshold ? 'text-red-500' : 'text-yellow-500'}`}>Rupture imminente</p>
                                  <p className="text-[10px] text-gray-400">Prévision: ~ {Math.max(1, Math.round(p.stock / 5))} jours</p>
                               </div>
                            </div>
                          ))}
                          {myProducts.length === 0 && <p className="text-center py-8 text-gray-400 text-sm italic">Ajoutez des produits pour activer les prévisions.</p>}
                          {myProducts.length > 0 && myProducts.filter(p => p.stock <= p.lowStockThreshold*2).length === 0 && (
                             <div className="py-8 text-center bg-green-50 rounded-2xl text-green-600">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-bold">Tous vos stocks sont sains !</p>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Performance Grids */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                       <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" /> Top Produits (Valeur)
                       </h4>
                       <div className="space-y-6">
                          {myProducts.sort((a, b) => (b.stock * b.price) - (a.stock * a.price)).slice(0, 5).map((p, i) => (
                            <div key={p.id} className="flex items-center gap-6">
                               <span className="text-2xl font-black text-gray-100 italic">0{i+1}</span>
                               <div className="flex-grow">
                                  <div className="flex justify-between mb-2">
                                     <span className="text-sm font-bold text-secondary">{p.name}</span>
                                     <span className="text-xs font-bold text-primary italic">{(p.stock * p.price).toLocaleString()} F</span>
                                  </div>
                                  <div className="w-full bg-tris h-2 rounded-full overflow-hidden">
                                     <div className="h-full brand-gradient transition-all duration-1000" style={{ width: `${Math.random() * 70 + 30}%` }}></div>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                       <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                          <RotateCcw className="w-5 h-5 text-gray-400" /> Évolution du catalogue
                       </h4>
                       <div className="h-[200px] flex items-end gap-2">
                          {[15, 25, 20, 35, 45, 40, 55, 65, 60, 75, 85, 80].map((h, i) => (
                             <div key={i} className="flex-grow bg-tris rounded-t-lg relative group transition-all hover:bg-primary/20" style={{ height: `${h}%` }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-secondary text-white text-[10px] px-2 py-1 rounded-md mb-1 z-10">Mois {i+1}</div>
                                <div className="absolute bottom-0 inset-x-0 brand-gradient opacity-20" style={{ height: '30%' }}></div>
                             </div>
                          ))}
                       </div>
                       <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-black tracking-widest italic">Analyse annuelle des stocks</p>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'archives' && (
              <motion.div 
                key="archives"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold text-secondary">Éléments Supprimés (Soft-Delete)</h3>
                   <span className="px-4 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold">Sécurisé & Réversible</span>
                </div>
                <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-tris/50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-400">
                         <th className="px-8 py-6">Élément archivé</th>
                         <th className="px-6 py-6">Type</th>
                         <th className="px-6 py-6 font-center text-center">Date Archivage</th>
                         <th className="px-8 py-6 text-right">Actions de restauration</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {archivedProducts.length > 0 ? archivedProducts.map((p) => (
                         <tr key={p.id} className="bg-gray-50/20 group">
                           <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                               <Package className="w-5 h-5 text-gray-300" />
                               <p className="text-sm font-bold text-gray-500">{p.name}</p>
                             </div>
                           </td>
                           <td className="px-6 py-5">
                             <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Produit</span>
                           </td>
                           <td className="px-6 py-5 text-[10px] text-gray-400 text-center">{new Date(p.updatedAt).toLocaleDateString()}</td>
                           <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-3">
                                <button 
                                  onClick={() => handleRestoreProduct(p.id)}
                                  className="px-5 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                                ><RotateCcw className="w-3 h-3" /> Réactiver</button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                                  title="Supprimer définitivement"
                                ><Trash2 className="w-4 h-4" /></button>
                             </div>
                           </td>
                         </tr>
                       )) : (
                         <tr>
                           <td colSpan={4} className="px-8 py-32 text-center text-gray-400 italic">
                             <Archive className="w-16 h-16 mx-auto mb-4 opacity-5" />
                             Vos archives sont propres et vides.
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-tris/30">
                       <h3 className="text-lg font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Journal Intelligent d'Activités</h3>
                       <p className="text-xs text-gray-400">Archivage automatique après 30 jours</p>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                       {myLogs.map((log) => (
                         <div key={log.id} className="px-8 py-6 flex items-start gap-6 hover:bg-tris/30 transition-all group">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                               log.action === 'create' ? 'bg-green-50 text-green-500' :
                               log.action === 'delete' ? 'bg-red-50 text-red-500' :
                               log.action === 'archive' ? 'bg-yellow-50 text-yellow-500' :
                               'bg-blue-50 text-blue-500'
                            }`}>
                               {log.action === 'create' ? <Plus className="w-5 h-5" /> :
                                log.action === 'delete' ? <Trash2 className="w-5 h-5" /> :
                                log.action === 'archive' ? <Archive className="w-5 h-5" /> :
                                log.action === 'restore' ? <RotateCcw className="w-5 h-5" /> :
                                <Edit className="w-5 h-5" />}
                            </div>
                            <div className="flex-grow">
                               <p className="text-sm font-bold text-secondary">{log.details}</p>
                               <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                                <span className="p-1 px-2 bg-tris rounded-md font-black uppercase tracking-widest text-[8px]">{log.entityType}</span>
                                🕒 {new Date(log.timestamp).toLocaleString('fr-FR')}
                               </p>
                               {(log.oldValue || log.newValue) && (
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {log.oldValue && (
                                       <div className="p-4 bg-red-50/30 rounded-2xl border border-red-50">
                                          <span className="text-[9px] font-black uppercase text-red-400 block mb-2">Ancienne Valeur</span>
                                          <p className="text-[10px] font-mono text-gray-500 break-all line-clamp-2">{log.oldValue}</p>
                                       </div>
                                     )}
                                     {log.newValue && (
                                       <div className="p-4 bg-green-50/30 rounded-2xl border border-green-50">
                                          <span className="text-[9px] font-black uppercase text-green-400 block mb-2">Nouvelle Valeur</span>
                                          <p className="text-[10px] font-mono text-gray-500 break-all line-clamp-2">{log.newValue}</p>
                                       </div>
                                     )}
                                  </div>
                               )}
                            </div>
                         </div>
                       ))}
                       {myLogs.length === 0 && (
                          <div className="py-20 text-center text-gray-400 italic">
                            <Clock className="w-16 h-16 mx-auto mb-4 opacity-5" />
                            Aucune activité enregistrée. Vos actions apparaîtront ici.
                          </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'expenses' && (
              <motion.div 
                key="expenses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter italic">Gestion de <span className="text-primary italic">Trésorerie</span></h3>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Suivi des charges et versements boutique</p>
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => setIsExpenseModalOpen(true)}
                         className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-2xl font-bold shadow-lg hover:bg-primary transition-all"
                       >
                         <Plus className="w-5 h-5" /> Nouvelle Dépense
                       </button>
                       <button className="px-6 py-3 bg-white border border-gray-100 text-secondary rounded-2xl font-bold hover:bg-tris transition-all">
                         Programmer un Versement
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Dépenses Mois</p>
                       <h4 className="text-3xl font-black text-red-500 tracking-tighter">0 FCFA</h4>
                       <span className="text-[10px] font-bold text-gray-400 mt-2 block italic">Avenant: Aucune charge enregistrée ce mois</span>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm border-l-4 border-l-primary">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Flux de Caisse</p>
                       <h4 className="text-3xl font-black text-secondary tracking-tighter">0 FCFA</h4>
                       <span className="text-[10px] font-bold text-green-500 mt-2 block">Sain: Aucun découvert</span>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Versements à Venir</p>
                       <h4 className="text-3xl font-black text-blue-500 tracking-tighter italic">En attente</h4>
                       <span className="text-[10px] font-bold text-gray-400 mt-2 block">Prochain versement: Non programmé</span>
                    </div>
                 </div>

                 <div className="bg-white rounded-[40px] border border-gray-100 p-8 min-h-[300px] flex flex-col items-center justify-center text-center opacity-50 italic text-gray-300">
                    <CreditCard className="w-16 h-16 mb-4" />
                    <p className="text-sm">Aucune transaction de flux n'a été enregistrée pour le moment.</p>
                 </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <PaymentMethodsList />
            )}

            {activeTab === 'employees' && (
              <motion.div 
                key="employees"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-secondary font-display italic uppercase tracking-tighter">Équipage <span className="text-primary italic">Pro</span></h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Gérez vos collaborateurs ({myEmployees.length} / {plan.employeeLimit === Infinity ? '∞' : plan.employeeLimit})</p>
                  </div>
                  <button 
                    onClick={handleAddEmployee}
                    className="flex items-center gap-2 px-6 py-3 brand-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" /> Ajouter un collaborateur
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {myEmployees.length > 0 ? myEmployees.map((emp) => (
                    <div key={emp.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button onClick={() => handleEditEmployee(emp)} className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleArchiveEmployee(emp.id)} className="p-2 bg-yellow-50 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white transition-all"><Archive className="w-4 h-4" /></button>
                       </div>
                       
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 brand-gradient rounded-2xl flex items-center justify-center text-white font-black text-xl italic shadow-lg">
                             {emp.name?.[0].toUpperCase()}
                          </div>
                          <div>
                             <h4 className="font-black text-secondary uppercase tracking-tight">{emp.name}</h4>
                             <p className="text-[10px] text-primary font-black uppercase tracking-widest">{emp.role}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-3 pt-4 border-t border-gray-50">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                             <div className="flex items-center gap-3">
                                <Mail className="w-3.5 h-3.5" /> {emp.email}
                             </div>
                             <button 
                                onClick={() => {
                                  const newPass = Math.random().toString(36).slice(-6);
                                  updateEmployee(emp.id, { password: newPass });
                                  showNotification('success', 'Code Reset', `Nouveau code pour ${emp.name}: ${newPass}`);
                                }}
                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                             >
                               <RotateCcw className="w-2.5 h-2.5" /> Reset
                             </button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                             <div className="flex items-center gap-3">
                                <ShieldCheck className="w-3.5 h-3.5" /> Code: <span className="font-mono font-bold text-secondary tracking-widest">{emp.password || '123456'}</span>
                             </div>
                             <span className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black uppercase">{emp.isActive ? 'Actif' : 'Suspendu'}</span>
                          </div>
                       </div>

                       <div className="mt-6 flex items-center justify-between">
                          <span className="px-3 py-1 bg-green-50 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-full">En ligne</span>
                          <button className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors underline">Voir l'activité</button>
                       </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                       <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                       <h4 className="text-xl font-bold text-secondary opacity-50">Votre équipe est vide</h4>
                       <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">Déléguez la gestion de votre boutique en ajoutant des vendeurs ou des managers.</p>
                       <button onClick={handleAddEmployee} className="mt-6 px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg text-sm">Embaucher maintenant</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <RoleInfo role="Manager" desc="Contrôle total sur la boutique." />
                  <RoleInfo role="Vendeur" desc="Gère les commandes et clients." />
                  <RoleInfo role="Stockiste" desc="Mise à jour des stocks produits." />
                  <RoleInfo role="Support" desc="Accès au chat et SAV." />
                </div>
              </motion.div>
            )}

            {activeTab === 'plans' && (
               <SubscriptionManager />
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-20 rounded-[40px] border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="w-24 h-24 bg-tris rounded-full flex items-center justify-center mb-8 relative">
                    <Settings2 className="w-12 h-12 text-primary opacity-20" />
                    <div className="absolute inset-0 brand-gradient rounded-full opacity-10 animate-ping"></div>
                 </div>
                 <h3 className="text-2xl font-bold text-secondary mb-3 italic">Paramètres Systèmes</h3>
                 <p className="text-gray-500 max-w-sm mb-8 italic">
                   "Configurez vos emails automatiques, vos intégrations API et la sécurité de vos données."
                 </p>
                 <div className="flex items-center gap-2 px-6 py-2 bg-gris rounded-full text-xs font-bold text-primary">
                    <CheckCircle className="w-3 h-3" /> Intégrations en cours de développement
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? "Modification d'Expertise" : "Nouvelle Acquisition Stock"}
        size="xl"
      >
        <ProductForm 
          product={editingProduct} 
          onSuccess={() => setIsProductModalOpen(false)} 
          categories={categories}
        />
      </Modal>

      {/* Employee Modal */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        title={editingEmployee ? "Profil Collaborateur" : "Recrutement Staff"}
        size="lg"
      >
        <EmployeeForm 
          employee={editingEmployee} 
          onSuccess={() => setIsEmployeeModalOpen(false)} 
        />
      </Modal>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Enregistrement Dépense"
        size="lg"
      >
        <ExpenseForm 
          onSuccess={() => setIsExpenseModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
function RoleInfo({ role, desc }: { role: string, desc: string }) {
  return (
    <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm group hover:border-primary transition-all">
      <p className="font-black text-xs text-secondary uppercase tracking-widest flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-primary" /> {role}
      </p>
      <p className="text-[10px] text-gray-500 mt-2 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
function StatCard({ label, value, icon: Icon, color, trend }: { 
  label: string; 
  value: string; 
  icon: any; 
  color: 'blue' | 'green' | 'red' | 'yellow';
  trend?: 'up' | 'down';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    red: 'bg-red-50 text-red-500',
    yellow: 'bg-yellow-50 text-yellow-500',
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
      <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform ${colors[color]}`}></div>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-5 rounded-3xl ${colors[color]} group-hover:scale-110 transition-transform shadow-lg shadow-current/10`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
           <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
             {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
             {trend === 'up' ? 'ACTIF' : 'ATTENTION'}
           </span>
        )}
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}</h4>
        <p className="text-3xl font-black text-secondary tracking-tighter group-hover:text-primary transition-colors">{value}</p>
      </div>
    </div>
  );
}
