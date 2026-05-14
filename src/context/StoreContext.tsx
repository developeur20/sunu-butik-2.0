import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Product, Subscription, Employee, Role, ActivityLog, 
  Category, PLANS, ShopConfig, PaymentMethod, PlanId,
  Sale, Expense, Challenge, Notification, Report, Transaction 
} from '../types';

interface StoreContextType {
  currentUser: User | null;
  products: Product[];
  subscriptions: Subscription[];
  employees: Employee[];
  activityLogs: ActivityLog[];
  categories: Category[];
  sales: Sale[];
  expenses: Expense[];
  challenges: Challenge[];
  notifications: Notification[];
  reports: Report[];
  allUsers: User[];
  transactions: Transaction[];
  login: (email: string, role: Role) => void;
  logout: () => void;
  // User/Admin Operations
  suspendUser: (uid: string) => void;
  activateUser: (uid: string) => void;
  // User/Shop
  updateShopSettings: (settings: Partial<ShopConfig>) => void;
  // Payment Methods
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'isActive'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isArchived'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
  // Employees
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  archiveEmployee: (id: string) => void;
  restoreEmployee: (id: string) => void;
  // Categories
  addCategory: (name: string, parentId?: string) => void;
  toggleCategory: (id: string, active: boolean) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  // Sales & Expenses
  addSale: (sale: Omit<Sale, 'id' | 'timestamp' | 'shopId'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'recordedBy' | 'shopId'>) => void;
  // Challenges
  addChallenge: (challenge: Omit<Challenge, 'id' | 'shopId' | 'status'>) => void;
  updateChallengeStatus: (id: string, status: Challenge['status'], winners?: string[]) => void;
  // Notifications
  addNotification: (userId: string, notif: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'userId'>) => void;
  markNotificationRead: (id: string) => void;
  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  // Subscriptions
  updateSubscription: (userId: string, planId: PlanId, months?: number, cycle?: 'monthly' | 'yearly') => void;
  extendSubscription: (userId: string, months: number) => void;
  // Logs
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Téléphones', count: 0 },
    { id: '2', name: 'Informatique', count: 0 },
    { id: '3', name: 'Mode', count: 0 },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sb2_user');
    const savedProducts = localStorage.getItem('sb2_products');
    const savedSubs = localStorage.getItem('sb2_subscriptions');
    const savedEmployees = localStorage.getItem('sb2_employees');
    const savedLogs = localStorage.getItem('sb2_logs');
    const savedCats = localStorage.getItem('sb2_categories');
    const savedSales = localStorage.getItem('sb2_sales');
    const savedExpenses = localStorage.getItem('sb2_expenses');
    const savedChallenges = localStorage.getItem('sb2_challenges');
    const savedNotifs = localStorage.getItem('sb2_notifications');
    const savedAllUsers = localStorage.getItem('sb2_all_users');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSubs) setSubscriptions(JSON.parse(savedSubs));
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    
    if (savedAllUsers) {
      setAllUsers(JSON.parse(savedAllUsers));
    } else {
      // Seed with some users if empty
      const initialUsers: User[] = [
        { uid: 'admin-001', email: 'admin@sunubutik.com', displayName: 'Master Admin', role: 'admin', createdAt: new Date().toISOString(), isActive: true }
      ];
      setAllUsers(initialUsers);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem('sb2_user', JSON.stringify(currentUser));
    else localStorage.removeItem('sb2_user');
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('sb2_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sb2_subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('sb2_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('sb2_logs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('sb2_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('sb2_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('sb2_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('sb2_challenges', JSON.stringify(challenges)); }, [challenges]);
  useEffect(() => { localStorage.setItem('sb2_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('sb2_all_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('sb2_transactions', JSON.stringify(transactions)); }, [transactions]);

  const addLog = (logData: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.uid,
      userName: currentUser.displayName,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const login = (email: string, role: Role) => {
    // Check if user already exists
    let existingUser = allUsers.find(u => u.email === email);
    
    if (!existingUser) {
      existingUser = {
        uid: Math.random().toString(36).substr(2, 9),
        email,
        displayName: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      setAllUsers(prev => [...prev, existingUser!]);
    }

    if (!existingUser.isActive) {
      throw new Error("Votre compte est actuellement suspendu. Veuillez contacter l'administration.");
    }

    setCurrentUser(existingUser);
  };

  const updateShopSettings = (settings: Partial<ShopConfig>) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      shopConfig: {
        ...(currentUser.shopConfig || {
          name: currentUser.displayName + "'s Shop",
          description: '',
          address: '',
          phones: [],
          supportEmail: currentUser.email,
          complaintEmail: currentUser.email,
          deliveryZones: [],
          socialLinks: [],
          openingHours: []
        }),
        ...settings
      } as ShopConfig
    };
    setCurrentUser(updatedUser);
    addLog({
      action: 'update',
      entityType: 'shop',
      entityId: currentUser.uid,
      details: 'Paramètres de la boutique mis à jour.'
    });
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id' | 'isActive'>) => {
    if (!currentUser) return;
    const newMethod: PaymentMethod = {
      ...method,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true
    };
    const updatedUser = {
      ...currentUser,
      paymentMethods: [...(currentUser.paymentMethods || []), newMethod]
    };
    setCurrentUser(updatedUser);
    addLog({
      action: 'create',
      entityType: 'shop',
      entityId: newMethod.id,
      details: `Moyen de paiement ${method.type} ajouté.`
    });
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      paymentMethods: (currentUser.paymentMethods || []).map(m => m.id === id ? { ...m, ...updates } : m)
    };
    setCurrentUser(updatedUser);
  };

  const deletePaymentMethod = (id: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      paymentMethods: (currentUser.paymentMethods || []).filter(m => m.id !== id)
    };
    setCurrentUser(updatedUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const suspendUser = (uid: string) => {
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, isActive: false } : u));
  };

  const activateUser = (uid: string) => {
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, isActive: true } : u));
  };

  // Product Operations
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isArchived'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    addLog({
      action: 'create',
      entityType: 'product',
      entityId: newProduct.id,
      details: `Produit "${newProduct.name}" ajouté.`
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
        addLog({
          action: 'update',
          entityType: 'product',
          entityId: id,
          details: `Produit "${p.name}" mis à jour.`,
          oldValue: JSON.stringify(p),
          newValue: JSON.stringify(updated)
        });
        return updated;
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) {
      addLog({
        action: 'delete',
        entityType: 'product',
        entityId: id,
        details: `Produit "${product.name}" supprimé définitivement.`
      });
    }
  };

  const archiveProduct = (id: string) => {
    updateProduct(id, { isArchived: true, isActive: false });
    addLog({
      action: 'archive',
      entityType: 'product',
      entityId: id,
      details: 'Produit archivé.'
    });
  };

  const restoreProduct = (id: string) => {
    updateProduct(id, { isArchived: false, isActive: true });
    addLog({
      action: 'restore',
      entityType: 'product',
      entityId: id,
      details: 'Produit restauré.'
    });
  };

  // Employee Operations
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...employee,
      id: Math.random().toString(36).substr(2, 9),
      isArchived: false
    };
    setEmployees(prev => [...prev, newEmp]);
    addLog({
      action: 'create',
      entityType: 'employee',
      entityId: newEmp.id,
      details: `Employé ${newEmp.email} ajouté.`
    });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addLog({
      action: 'update',
      entityType: 'employee',
      entityId: id,
      details: `Accès de l'employé ${employees.find(e => e.id === id)?.email} mis à jour.`
    });
  };

  const archiveEmployee = (id: string) => {
    updateEmployee(id, { isArchived: true, isActive: false });
  };

  const restoreEmployee = (id: string) => {
    updateEmployee(id, { isArchived: false, isActive: true });
  };

  // Category Operations
  const addCategory = (name: string, parentId?: string) => {
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      count: 0,
      isActive: true,
      parentId
    };
    setCategories(prev => [...prev, newCat]);
    addLog({
      action: 'create',
      entityType: 'category',
      entityId: newCat.id,
      details: `Catégorie "${name}" créée.`
    });
  };

  const toggleCategory = (id: string, active: boolean) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: active } : c));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Sales & Expenses
  const addSale = (saleData: Omit<Sale, 'id' | 'timestamp' | 'shopId'>) => {
    if (!currentUser) return;
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      shopId: currentUser.uid,
      timestamp: new Date().toISOString()
    };
    setSales(prev => [...prev, newSale]);
    addLog({
      action: 'create',
      entityType: 'shop', // Using shop for general sales
      entityId: newSale.id,
      details: `Vente de ${newSale.total} FCFA enregistrée.`
    });
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'recordedBy' | 'shopId'>) => {
    if (!currentUser) return;
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
      recordedBy: currentUser.displayName,
      shopId: currentUser.uid
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  // Challenges
  const addChallenge = (challengeData: Omit<Challenge, 'id' | 'shopId' | 'status'>) => {
    if (!currentUser) return;
    const newChallenge: Challenge = {
      ...challengeData,
      id: Math.random().toString(36).substr(2, 9),
      shopId: currentUser.uid,
      status: 'active'
    };
    setChallenges(prev => [...prev, newChallenge]);
  };

  const updateChallengeStatus = (id: string, status: Challenge['status'], winners?: string[]) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status, winners } : c));
  };

  // Notifications
  const addNotification = (userId: string, notif: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'userId'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      userId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateSubscription = (userId: PlanId | string, planId: PlanId, months: number = 1, cycle: 'monthly' | 'yearly' = 'monthly') => {
    const plan = PLANS[planId];
    const startDate = new Date();
    const endDate = new Date();
    
    if (cycle === 'yearly') {
      endDate.setFullYear(startDate.getFullYear() + months);
    } else {
      endDate.setMonth(startDate.getMonth() + months);
    }

    const price = plan.price * months * (cycle === 'yearly' ? 10 : 1); // 2 months free for yearly
    
    const newSub: Subscription = {
      id: Math.random().toString(36).substr(2, 9),
      userId: userId as string,
      planId,
      status: 'active',
      billingCycle: cycle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      paymentHistory: [{
        id: Math.random().toString(36).substr(2, 9),
        amount: price,
        date: startDate.toISOString(),
        period: `${months} ${cycle === 'yearly' ? 'an(s)' : 'mois'}`,
        method: 'Orange Money' // Default fallback
      }]
    };
    setSubscriptions(prev => [...prev.filter(s => s.userId !== userId), newSub]);
    
    if (currentUser?.uid === userId) {
      setCurrentUser({ ...currentUser, subscriptionId: newSub.id, role: 'owner' });
    }

    addLog({
      action: 'payment',
      entityType: 'subscription',
      entityId: newSub.id,
      details: `Abonnement ${planId} activé pour ${months} ${cycle}.`
    });
  };

  const extendSubscription = (userId: string, months: number) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.userId === userId) {
        const currentEnd = new Date(s.endDate);
        if (s.billingCycle === 'yearly') {
          currentEnd.setFullYear(currentEnd.getFullYear() + months);
        } else {
          currentEnd.setMonth(currentEnd.getMonth() + months);
        }
        
        const price = PLANS[s.planId].price * months * (s.billingCycle === 'yearly' ? 10 : 1);
        
        return {
          ...s,
          endDate: currentEnd.toISOString(),
          paymentHistory: [
            ...s.paymentHistory,
            {
              id: Math.random().toString(36).substr(2, 9),
              amount: price,
              date: new Date().toISOString(),
              period: `${months} ${s.billingCycle === 'yearly' ? 'an(s)' : 'mois'} supplémentaire(s)`,
              method: 'Orange Money'
            }
          ]
        };
      }
      return s;
    }));
  };

  return (
    <StoreContext.Provider value={{ 
      currentUser, products, subscriptions, employees, activityLogs, categories,
      sales, expenses, challenges, notifications, reports, allUsers, transactions,
      login, logout, suspendUser, activateUser, addProduct, updateProduct, deleteProduct, archiveProduct, restoreProduct,
      addEmployee, updateEmployee, archiveEmployee, restoreEmployee,
      addCategory, toggleCategory, updateCategory, 
      addSale, addExpense, addChallenge, updateChallengeStatus, addNotification, markNotificationRead,
      addTransaction, updateSubscription, extendSubscription, addLog,
      updateShopSettings, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
