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
  socialLinks: { platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok'; url: string }[];
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

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  adminCount: number;
  employeeLimit: number;
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  basic: {
    id: 'basic',
    name: 'Plan Basic',
    price: 5000,
    adminCount: 1,
    employeeLimit: 1,
    features: ['1 compte administrateur', '1 compte employé', 'Publication limitée', 'Support standard', 'Boutique simple'],
  },
  standard: {
    id: 'standard',
    name: 'Plan Standard',
    price: 15000,
    adminCount: 1,
    employeeLimit: 5,
    features: ['1 compte administrateur', 'Jusqu\'à 5 employés', 'Produits illimités', 'Support prioritaire', 'Promotions avancées', 'Tableau de bord amélioré'],
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium',
    price: 35000,
    adminCount: 1,
    employeeLimit: 15,
    features: ['1 compte administrateur', 'Jusqu\'à 15 employés', 'Boutique premium', 'Mise en avant auto', 'Multi utilisateurs', 'Statistiques avancées', 'Support VIP'],
  },
  business_pro: {
    id: 'business_pro',
    name: 'Plan Business Pro',
    price: 75000,
    adminCount: 1,
    employeeLimit: Infinity,
    features: ['Comptes illimités', 'Marketplace professionnelle', 'Gestion multi boutiques', 'Accès API', 'Dashboard entreprise', 'Gestion équipes avancée', 'Priorité affichage'],
  },
};
