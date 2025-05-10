// lib/mockData.ts

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
}


export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  state?: string;
  city?: string;
  imageUrl?: string;
}

export interface Payment {
  id: string;
  propertyId: string;
  unitId?: string;
  amount: number;
  paymentDate: string;
  notes?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  unitId?: string;
  expenseType: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}

const mockProperties: Property[] = [];
const mockPayments: Payment[] = [];
const mockExpenses: Expense[] = [];
const mockTenants: Tenant[] = [];

const calculateProfitability = (income: number, expenses: number): number => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

// Properties
export const savePropertyToMock = async (property: Property): Promise<void> => {
  const index = mockProperties.findIndex((p) => p.id === property.id);
  if (index !== -1) {
    mockProperties[index] = { ...mockProperties[index], ...property };
  } else {
    mockProperties.push(property);
  }
};

export const getAllProperties = async (): Promise<Property[]> => mockProperties;

export const getPropertyById = async (propertyId: string): Promise<Property | undefined> =>
  mockProperties.find((p) => p.id === propertyId);

export const updatePropertyInMock = async (propertyId: string, updatedData: Partial<Property>): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (property) Object.assign(property, updatedData);
};

export const deletePropertyFromMock = async (propertyId: string): Promise<void> => {
  const index = mockProperties.findIndex((p) => p.id === propertyId);
  if (index !== -1) mockProperties.splice(index, 1);
};

// Units
export const addUnitToProperty = async (propertyId: string, unit: Unit): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (!property || property.type !== 'building') throw new Error('Property not found or not a building');
  if (!property.units) property.units = [];
  property.units.push(unit);
};

export const getUnitsOfProperty = async (propertyId: string): Promise<Unit[]> => {
  const property = await getPropertyById(propertyId);
  if (!property || property.type !== 'building') throw new Error('Property not found or not a building');
  return property.units || [];
};

export const getUnitById = async (propertyId: string, unitId: string): Promise<Unit | undefined> => {
  const units = await getUnitsOfProperty(propertyId);
  return units.find((u) => u.id === unitId);
};

export const updateUnitOfProperty = async (propertyId: string, unitId: string, updatedData: Partial<Unit>): Promise<void> => {
  const unit = await getUnitById(propertyId, unitId);
  if (unit) Object.assign(unit, updatedData);
};

export const deleteUnitFromProperty = async (propertyId: string, unitId: string): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (property?.units) {
    property.units = property.units.filter((u) => u.id !== unitId);
  }
};

// Tenants
export const saveTenantToMock = async (propertyId: string, unitId: string, tenant: Tenant): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (!property) throw new Error('Property not found');

  const unit = property.units?.find(u => u.id === unitId);
  if (!unit) throw new Error('Unit not found');

  const index = mockTenants.findIndex((t) => t.id === tenant.id);
  if (index !== -1) {
    mockTenants[index] = { ...mockTenants[index], ...tenant };
  } else {
    mockTenants.push(tenant);
  }

  unit.tenantId = tenant.id;
  unit.status = 'occupied';
  unit.startDate = new Date().toISOString();
};

export const saveTenantToProperty = async (propertyId: string, tenant: Tenant): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (!property || property.type === 'building') throw new Error('Invalid property type for direct tenant');

  const index = mockTenants.findIndex((t) => t.id === tenant.id);
  if (index !== -1) {
    mockTenants[index] = { ...mockTenants[index], ...tenant };
  } else {
    mockTenants.push(tenant);
  }

  property.tenantId = tenant.id;
  property.status = 'occupied';
  property.startDate = new Date().toISOString();
};

export const removeTenantFromProperty = async (propertyId: string): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (!property || property.type === 'building') throw new Error('Invalid property type for tenant removal');

  property.tenantId = undefined;
  property.startDate = undefined;
  property.status = 'vacant';
};

export const getAllTenants = async (): Promise<Tenant[]> => mockTenants;

export const getTenantById = async (tenantId: string): Promise<Tenant | undefined> =>
  mockTenants.find((t) => t.id === tenantId);

export const updateTenantInMock = async (tenantId: string, updatedData: Partial<Tenant>): Promise<void> => {
  const tenant = await getTenantById(tenantId);
  if (tenant) Object.assign(tenant, updatedData);
};

export const deleteTenantFromMock = async (tenantId: string): Promise<void> => {
  const index = mockTenants.findIndex((t) => t.id === tenantId);
  if (index !== -1) mockTenants.splice(index, 1);
};

export const removeTenantFromUnit = async (propertyId: string, unitId: string): Promise<void> => {
  const property = await getPropertyById(propertyId);
  if (!property) throw new Error('Property not found');
  const unit = property.units?.find(u => u.id === unitId);
  if (!unit) throw new Error('Unit not found');

  unit.tenantId = undefined;
  unit.status = 'vacant';
  unit.startDate = undefined;
};

// Payments
export const savePaymentToMock = async (payment: Payment): Promise<void> => {
  const index = mockPayments.findIndex((p) => p.id === payment.id);
  if (index !== -1) {
    mockPayments[index] = { ...mockPayments[index], ...payment };
  } else {
    mockPayments.push(payment);
  }

  const property = await getPropertyById(payment.propertyId);
  if (property) {
    property.income = (property.income || 0) + payment.amount;
    property.profitability = calculateProfitability(property.income || 0, property.expenses || 0);
  }
};

export const getAllPayments = async (): Promise<Payment[]> => mockPayments;

export const updatePaymentInMock = async (paymentId: string, updatedData: Partial<Payment>): Promise<void> => {
  const payment = mockPayments.find((p) => p.id === paymentId);
  if (payment) Object.assign(payment, updatedData);
};

export const deletePaymentFromMock = async (paymentId: string): Promise<void> => {
  const index = mockPayments.findIndex((p) => p.id === paymentId);
  if (index !== -1) {
    const payment = mockPayments[index];
    const property = await getPropertyById(payment.propertyId);
    if (property) {
      property.income = (property.income || 0) - payment.amount;
      property.profitability = calculateProfitability(property.income || 0, property.expenses || 0);
    }
    mockPayments.splice(index, 1);
  }
};

// Expenses
export const saveExpenseToMock = async (expense: Expense): Promise<void> => {
  const index = mockExpenses.findIndex((e) => e.id === expense.id);
  if (index !== -1) {
    mockExpenses[index] = { ...mockExpenses[index], ...expense };
  } else {
    mockExpenses.push(expense);
  }

  const property = await getPropertyById(expense.propertyId);
  if (property) {
    property.expenses = (property.expenses || 0) + expense.amount;
    property.profitability = calculateProfitability(property.income || 0, property.expenses || 0);
  }
};

export const getAllExpenses = async (): Promise<Expense[]> => mockExpenses;

export const updateExpenseInMock = async (expenseId: string, updatedData: Partial<Expense>): Promise<void> => {
  const expense = mockExpenses.find((e) => e.id === expenseId);
  if (expense) Object.assign(expense, updatedData);
};

export const deleteExpenseFromMock = async (expenseId: string): Promise<void> => {
  const index = mockExpenses.findIndex((e) => e.id === expenseId);
  if (index !== -1) {
    const expense = mockExpenses[index];
    const property = await getPropertyById(expense.propertyId);
    if (property) {
      property.expenses = (property.expenses || 0) - expense.amount;
      property.profitability = calculateProfitability(property.income || 0, property.expenses || 0);
    }
    mockExpenses.splice(index, 1);
  }
};

export default {
  mockProperties,
  mockPayments,
  mockExpenses,
  mockTenants,
  savePropertyToMock,
  getAllProperties,
  getPropertyById,
  updatePropertyInMock,
  deletePropertyFromMock,
  addUnitToProperty,
  getUnitsOfProperty,
  getUnitById,
  updateUnitOfProperty,
  deleteUnitFromProperty,
  saveTenantToMock,
  saveTenantToProperty,
  removeTenantFromProperty,
  getAllTenants,
  getTenantById,
  updateTenantInMock,
  deleteTenantFromMock,
  removeTenantFromUnit,
  savePaymentToMock,
  getAllPayments,
  updatePaymentInMock,
  deletePaymentFromMock,
  saveExpenseToMock,
  getAllExpenses,
  updateExpenseInMock,
  deleteExpenseFromMock,
};