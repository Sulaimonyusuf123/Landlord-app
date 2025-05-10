// lib/db.ts
import { databases, ID, DATABASE_ID, COLLECTIONS, Query } from './appwrite';
import type { Property, Unit, Tenant, Payment, Expense, Notification } from './types';

// Helper to map Appwrite document
const mapDoc = (doc: any) => ({ ...doc, id: doc.$id });

// ========== Utility ==========
const calculateProfitability = (income: number, expenses: number): number => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

const createNotification = async (userId: string, title: string, message: string) => {
  await databases.createDocument(DATABASE_ID, COLLECTIONS.notifications, ID.unique(), {
    userId,
    title,
    message,
  });
};

// ========== PROPERTIES ==========
export const createProperty = async (property: any) => {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.properties, ID.unique(), property);
  await createNotification(property.ownerId, 'Property Added', `Property "${property.name}" was added.`);
  return mapDoc(doc);
};

export const getAllProperties = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.properties, [Query.equal('userId', userId)]);
  return res.documents.map(mapDoc);
};

export const getPropertyById = async (id: string, userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.properties, [
    Query.equal('$id', id),
    Query.equal('userId', userId),
  ]);
  if (!res.documents.length) throw new Error('Property not found or access denied');
  return mapDoc(res.documents[0]);
};

export const updateProperty = async (id: string, data: any) => mapDoc(await databases.updateDocument(DATABASE_ID, COLLECTIONS.properties, id, data));

export const deleteProperty = async (id: string) => databases.deleteDocument(DATABASE_ID, COLLECTIONS.properties, id);

// ========== UNITS ==========
export const createUnit = async (unit: any) => {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.units, ID.unique(), unit);
  await createNotification(unit.userId, 'Unit Added', `A new unit was added to property ${unit.propertyId}.`);
  return mapDoc(doc);
};

export const getUnitsOfProperty = async (propertyId: string, userId: string) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.units,
    [Query.equal('propertyId', propertyId), Query.equal('userId', userId)]
  );
  return res.documents.map(mapDoc);
};

export const getUnitById = async (id: string, userId: string) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.units,
    [Query.equal('$id', id), Query.equal('userId', userId)]
  );
  if (!res.documents.length) throw new Error('Unit not found or access denied');
  return mapDoc(res.documents[0]);
};

export const updateUnit = async (id: string, data: any) => mapDoc(await databases.updateDocument(DATABASE_ID, COLLECTIONS.units, id, data));

export const deleteUnit = async (id: string) => databases.deleteDocument(DATABASE_ID, COLLECTIONS.units, id);

// ========== TENANTS ==========
export const createTenant = async (tenant: any) => {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.tenants, ID.unique(), tenant);
  await createNotification(tenant.userId, 'Tenant Added', `Tenant "${tenant.name}" was added.`);
  return mapDoc(doc);
};

export const getAllTenants = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.tenants, [Query.equal('userId', userId)]);
  return res.documents.map(mapDoc);
};

export const getTenantById = async (id: string, userId: string) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.tenants,
    [Query.equal('$id', id), Query.equal('userId', userId)]
  );
  if (!res.documents.length) throw new Error('Tenant not found or access denied');
  return mapDoc(res.documents[0]);
};

export const updateTenant = async (id: string, data: any) => mapDoc(await databases.updateDocument(DATABASE_ID, COLLECTIONS.tenants, id, data));

export const deleteTenant = async (id: string) => databases.deleteDocument(DATABASE_ID, COLLECTIONS.tenants, id);

// ========== LEASES ==========
export const createLease = async (lease: any) => {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.leases, ID.unique(), lease);
  await createNotification(lease.userId, 'Lease Created', `A new lease was created for unit/property ID: ${lease.unitId || lease.propertyId}`);
  return mapDoc(doc);
};

export const getLeasesByUser = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.leases, [Query.equal('userId', userId)]);
  return res.documents.map(mapDoc);
};

export const getLeaseById = async (id: string, userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.leases, [
    Query.equal('$id', id),
    Query.equal('userId', userId),
  ]);
  if (!res.documents.length) throw new Error('Lease not found or access denied');
  return mapDoc(res.documents[0]);
};

export const updateLease = async (id: string, data: any) => mapDoc(await databases.updateDocument(DATABASE_ID, COLLECTIONS.leases, id, data));

export const deleteLease = async (id: string) => databases.deleteDocument(DATABASE_ID, COLLECTIONS.leases, id);

// ========== PAYMENTS ==========
export const createPayment = async (payment: any) => {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.payments, ID.unique(), payment);

  const property = await getPropertyById(payment.propertyId, payment.userId);
  const newIncome = (property.income || 0) + payment.amount;
  const profitability = calculateProfitability(newIncome, property.expenses || 0);
  await updateProperty(property.id, { income: newIncome, profitability });

  await createNotification(payment.userId, 'Payment Recorded', `Payment of ${payment.amount} recorded for property ${property.name}.`);
  return mapDoc(doc);
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.payments, [
    Query.equal('$id', id)
  ]);
  if (!res.documents.length) throw new Error("Payment not found");

  const doc = res.documents[0];
  return {
    id: doc.$id,
    propertyId: doc.propertyId,
    unitId: doc.unitId ?? undefined,
    amount: doc.amount,
    paymentDate: doc.paymentDate,
    notes: doc.notes ?? '',
    userId: doc.userId,
  };
};



export const getAllPayments = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.payments, [Query.equal('userId', userId)]);
  return res.documents.map(mapDoc);
};

export const updatePayment = async (id: string, data: any) => {
  const old = await databases.getDocument(DATABASE_ID, COLLECTIONS.payments, id);
  const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.payments, id, data);

  const property = await getPropertyById(old.propertyId, old.userId);
  const oldAmount = old.amount;
  const newAmount = data.amount ?? oldAmount;
  const income = (property.income || 0) - oldAmount + newAmount;
  const profitability = calculateProfitability(income, property.expenses || 0);
  await updateProperty(property.id, { income, profitability });

  await createNotification(old.userId, 'Payment Updated', `Payment updated to ${newAmount} for property ${property.name}.`);
  return mapDoc(updated);
};

export const deletePayment = async (id: string) => {
  const payment = await databases.getDocument(DATABASE_ID, COLLECTIONS.payments, id);
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.payments, id);

  const property = await getPropertyById(payment.propertyId, payment.userId);
  const income = (property.income || 0) - payment.amount;
  const profitability = calculateProfitability(income, property.expenses || 0);
  await updateProperty(property.id, { income, profitability });

  await createNotification(payment.userId, 'Payment Deleted', `Deleted payment of ${payment.amount} from property ${property.name}.`);
};

// ========== EXPENSES ==========
export const createExpense = async (expense: any) => {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.expenses, ID.unique(), expense);

  const property = await getPropertyById(expense.propertyId, expense.userId);
  const newExpenses = (property.expenses || 0) + expense.amount;
  const profitability = calculateProfitability(property.income || 0, newExpenses);
  await updateProperty(property.id, { expenses: newExpenses, profitability });

  await createNotification(expense.userId, 'Expense Added', `Expense of ${expense.amount} added to property ${property.name}.`);
  return mapDoc(doc);
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.expenses,
    [Query.equal('$id', id)]
  );
  if (!res.documents.length) throw new Error('Expense not found');

  const doc = res.documents[0];
  return {
    id: doc.$id,
    propertyId: doc.propertyId,
    unitId: doc.unitId ?? undefined,
    expenseType: doc.expenseType,
    amount: doc.amount,
    expenseDate: doc.expenseDate,
    notes: doc.notes ?? '',
    userId: doc.userId,
  };
};

export const getAllExpenses = async (userId: string): Promise<Expense[]> => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.expenses,
    [Query.equal('userId', userId)]
  );
  return res.documents.map(mapDoc);
};

export const updateExpense = async (id: string, data: any) => {
  const old = await databases.getDocument(DATABASE_ID, COLLECTIONS.expenses, id);
  const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.expenses, id, data);

  const property = await getPropertyById(old.propertyId, old.userId);
  const oldAmount = old.amount;
  const newAmount = data.amount ?? oldAmount;
  const expenses = (property.expenses || 0) - oldAmount + newAmount;
  const profitability = calculateProfitability(property.income || 0, expenses);
  await updateProperty(property.id, { expenses, profitability });

  await createNotification(old.userId, 'Expense Updated', `Expense updated to ${newAmount} for property ${property.name}.`);
  return mapDoc(updated);
};

export const deleteExpense = async (id: string) => {
  const expense = await databases.getDocument(DATABASE_ID, COLLECTIONS.expenses, id);
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.expenses, id);

  const property = await getPropertyById(expense.propertyId, expense.userId);
  const expenses = (property.expenses || 0) - expense.amount;
  const profitability = calculateProfitability(property.income || 0, expenses);
  await updateProperty(property.id, { expenses, profitability });

  await createNotification(expense.userId, 'Expense Deleted', `Deleted expense of ${expense.amount} from property ${property.name}.`);
};

// ========== TENANT ASSIGNMENTS ==========
export const assignTenantToUnit = async (unitId: string, tenantId: string, userId: string) => {
  const now = new Date().toISOString();
  const unit = await updateUnit(unitId, {
    tenantId,
    userId,
    status: 'occupied',
    startDate: now,
  });
  await createNotification(userId, 'Tenant Assigned', `Tenant assigned to unit ${unitId}.`);
  return unit;
};

export const removeTenantFromUnit = async (unitId: string, $id: string) => {
  const unit = await updateUnit(unitId, {
    tenantId: null,
    status: 'vacant',
    startDate: null,
  });
  await createNotification(unit.userId, 'Tenant Removed', `Tenant removed from unit ${unitId}.`);
  return unit;
};

export const assignTenantToProperty = async (propertyId: string, tenantId: string, userId: string) => {
  const now = new Date().toISOString();
  const property = await updateProperty(propertyId, {
    tenantId,
    userId,
    status: 'occupied',
    startDate: now,
  });
  await createNotification(userId, 'Tenant Assigned', `Tenant assigned to property ${propertyId}.`);
  return property;
};

export const removeTenantFromProperty = async (propertyId: string) => {
  const property = await updateProperty(propertyId, {
    tenantId: null,
    status: 'vacant',
    startDate: null,
  });
  await createNotification(property.userId, 'Tenant Removed', `Tenant removed from property ${propertyId}.`);
  return property;
};

// ========== NOTIFICATIONS ==========
export const getNotificationsByUser = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.notifications, [
    Query.equal('userId', userId),
    Query.orderDesc('$createdAt')
  ]);
  return res.documents.map(mapDoc);
};

export const deleteNotification = async (id: string) => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.notifications, id);
};
