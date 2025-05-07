// lib/types.ts

export interface Property {
  id: string;
  name: string;
  type: 'building' | 'villa' | 'commercial';
  address?: string;
  state?: string;
  city?: string;
  imageUrl?: string;
  annualRent?: number;
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  income?: number;
  expenses?: number;
  operatingCosts?: number;
  profitability?: number;
  units?: Unit[];
  tenantId?: string;
  startDate?: string;
  status?: 'vacant' | 'occupied';
  userId: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  rentAmount: number;
  status: 'vacant' | 'occupied';
  tenantId?: string;
  startDate?: string;
  payments?: { amount: number; date: string }[];
  floorNumber?: number;
  notes?: string;
  unitNumber?: string;
  userId: string;
}

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
  imageUrl?: string;
  userId: string;
}

export interface Payment {
  id: string;
  propertyId: string;
  unitId?: string;
  amount: number;
  paymentDate: string;
  notes?: string;
  userId: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  unitId?: string;
  expenseType: string;
  amount: number;
  expenseDate: string;
  notes?: string;
  userId: string;
}

export interface Lease {
  id: string;
  tenantId: string;
  propertyId?: string;
  unitId?: string;
  startDate: string;
  endDate?: string;
  rentAmount: number;
  terms?: string;
  userId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
}
