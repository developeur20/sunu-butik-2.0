export type Role = 'admin' | 'owner' | 'customer' | 'manager' | 'stock' | 'service' | 'accountant' | 'collaborator';

export type PlanId = 'basic' | 'standard' | 'premium' | 'business_pro';

export interface ShopConfig {
  logo?: string;
  name: string;
  description: string;
  address: string;
  phones: string[];
  whatsapp?: string;
  supportEmail: string;
  complaintEmail: string;
  deliveryZones: { zone: string; price: number }[];
  socialLinks: { platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'youtube'; url: string }[];
  openingHours: { day: string; open: string; close: string; isClosed: boolean }[];
}

export interface PaymentMethod {
  id: string;
  type: 'wave' | 'orange_money' | 'free_money' | 'bank' | 'cash' | 'delivery';
  provider: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., 'Size', 'Color'
  options: { name: string; priceModifier?: number; stock?: number }[];
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  subscriptionId?: string;
  shopConfig?: ShopConfig;
  paymentMethods?: PaymentMethod[];
  createdAt: string;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'restore' | 'payment';
  entityType: 'product' | 'employee' | 'category' | 'subscription' | 'customer' | 'expense' | 'shop';
  entityId: string;
  details: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count: number;
  isActive: boolean;
  parentId?: string;
}

export interface Product {
  id: string;
  reference: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  buyPrice: number;
  category: string;
  subCategory?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  ownerId: string;
  isPromo: boolean;
  isActive: boolean;
  isArchived: boolean;
  variants?: ProductVariant[];
  supplier?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: 'active' | 'suspended' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  paymentHistory: {
    id: string;
    amount: number;
    date: string;
    period: string;
    method: string;
  }[];
}

export interface Employee {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
  isArchived: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  planId: PlanId;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'card' | 'google_pay';
  timestamp: string;
}

export interface Sale {
  id: string;
  shopId: string;
  sellerId: string;
  customerId?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    buyPrice: number; // For profit calculation
  }[];
  total: number;
  subTotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  status: 'completed' | 'cancelled' | 'refunded';
  timestamp: string;
}

export interface Expense {
  id: string;
  shopId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface Challenge {
  id: string;
  shopId: string;
  title: string;
  description: string;
  targetType: 'sales_count' | 'revenue' | 'new_customers';
  targetValue: number;
  reward: string;
  startDate: string;
  endDate: string;
  participants: string[]; // employee ids
  status: 'active' | 'completed' | 'cancelled';
  winners?: string[];
  rules: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'report' | 'challenge' | 'subscription' | 'payment' | 'security' | 'performance';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

export interface Report {
  id: string;
  shopId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string;
  data: {
    revenue: number;
    profit: number;
    expenses: number;
    salesCount: number;
    topProducts: { id: string; name: string; count: number }[];
    employeePerformance: { id: string; name: string; sales: number; revenue: number }[];
  }
}

export interface SuperAdminStats {
  totalShops: number;
  activeSubscriptions: number;
  totalRevenue: number;
  newShopsThisMonth: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  adminCount: number;
  employeeLimit: number;
  features: string[];
  isActive: boolean; // For Super Admin to enable/disable plans
}

export const PLANS: Record<PlanId, Plan> = {
  basic: {
    id: 'basic',
    name: 'Plan Basic',
    price: 5000,
    adminCount: 1,
    employeeLimit: 1,
    features: ['1 compte administrateur', '1 compte employé', 'Publication limitée', 'Support standard', 'Boutique simple'],
    isActive: true
  },
  standard: {
    id: 'standard',
    name: 'Plan Standard',
    price: 15000,
    adminCount: 1,
    employeeLimit: 5,
    features: ['1 compte administrateur', 'Jusqu\'à 5 employés', 'Produits illimités', 'Support prioritaire', 'Promotions avancées', 'Tableau de bord amélioré'],
    isActive: true
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium',
    price: 35000,
    adminCount: 1,
    employeeLimit: 15,
    features: ['1 compte administrateur', 'Jusqu\'à 15 employés', 'Boutique premium', 'Mise en avant auto', 'Multi utilisateurs', 'Statistiques avancées', 'Support VIP'],
    isActive: true
  },
  business_pro: {
    id: 'business_pro',
    name: 'Plan Business Pro',
    price: 75000,
    adminCount: 1,
    employeeLimit: Infinity,
    features: ['Comptes illimités', 'Marketplace professionnelle', 'Gestion multi boutiques', 'Accès API', 'Dashboard entreprise', 'Gestion équipes avancée', 'Priorité affichage'],
    isActive: true
  },
};
