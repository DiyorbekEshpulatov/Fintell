// SmartBuxgalter — Real Database Service
import { getSupabaseClient } from '@/template';

function getClient() {
  return getSupabaseClient();
}

export type TransactionType = 'income' | 'expense';
export type Currency = 'UZS' | 'USD' | 'EUR';

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  currency: Currency;
  amountUZS: number;
  description: string;
  date: string;
  counterparty?: string;
  invoiceNumber?: string;
  tags?: string[];
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  phone?: string;
  email?: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  minStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Invoice {
  id: string;
  number: string;
  type: 'incoming' | 'outgoing';
  counterparty: string;
  amount: number;
  currency: Currency;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: { name: string; qty: number; price: number; total: number }[];
}

export interface AIReport {
  id: string;
  title: string;
  reportType: string;
  generatedAt: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ---- TRANSACTIONS ----
export async function fetchTransactions(): Promise<{ data: Transaction[]; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };

  const mapped: Transaction[] = (data || []).map((r: any) => ({
    id: r.id,
    type: r.type,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categoryIcon: r.category_icon,
    categoryColor: r.category_color,
    amount: Number(r.amount),
    currency: r.currency,
    amountUZS: Number(r.amount_uzs),
    description: r.description,
    date: r.date,
    counterparty: r.counterparty || undefined,
    invoiceNumber: r.invoice_number || undefined,
    tags: r.tags || [],
  }));

  return { data: mapped, error: null };
}

export async function addTransactionDB(userId: string, t: Omit<Transaction, 'id'>): Promise<{ data: Transaction | null; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: t.type,
      category_id: t.categoryId,
      category_name: t.categoryName,
      category_icon: t.categoryIcon,
      category_color: t.categoryColor,
      amount: t.amount,
      currency: t.currency,
      amount_uzs: t.amountUZS,
      description: t.description,
      date: t.date,
      counterparty: t.counterparty || null,
      invoice_number: t.invoiceNumber || null,
      tags: t.tags || [],
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  const r = data as any;
  return {
    data: {
      id: r.id,
      type: r.type,
      categoryId: r.category_id,
      categoryName: r.category_name,
      categoryIcon: r.category_icon,
      categoryColor: r.category_color,
      amount: Number(r.amount),
      currency: r.currency,
      amountUZS: Number(r.amount_uzs),
      description: r.description,
      date: r.date,
      counterparty: r.counterparty || undefined,
      invoiceNumber: r.invoice_number || undefined,
      tags: r.tags || [],
    },
    error: null,
  };
}

export async function deleteTransactionDB(id: string): Promise<{ error: string | null }> {
  const supabase = getClient();
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  return { error: error ? error.message : null };
}

// ---- EMPLOYEES ----
export async function fetchEmployees(): Promise<{ data: Employee[]; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');

  if (error) return { data: [], error: error.message };

  const mapped: Employee[] = (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    position: r.position,
    department: r.department,
    salary: Number(r.salary),
    phone: r.phone || undefined,
    email: r.email || undefined,
    hireDate: r.hire_date,
    status: r.status,
  }));

  return { data: mapped, error: null };
}

export async function addEmployeeDB(userId: string, e: Omit<Employee, 'id'>): Promise<{ data: Employee | null; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('employees')
    .insert({
      user_id: userId,
      name: e.name,
      position: e.position,
      department: e.department,
      salary: e.salary,
      phone: e.phone || null,
      email: e.email || null,
      hire_date: e.hireDate,
      status: e.status,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  const r = data as any;
  return {
    data: {
      id: r.id, name: r.name, position: r.position, department: r.department,
      salary: Number(r.salary), phone: r.phone, email: r.email,
      hireDate: r.hire_date, status: r.status,
    },
    error: null,
  };
}

export async function updateEmployeeDB(id: string, e: Partial<Omit<Employee, 'id'>>): Promise<{ data: Employee | null; error: string | null }> {
  const supabase = getClient();
  const updateObj: any = {};
  if (e.name !== undefined) updateObj.name = e.name;
  if (e.position !== undefined) updateObj.position = e.position;
  if (e.department !== undefined) updateObj.department = e.department;
  if (e.salary !== undefined) updateObj.salary = e.salary;
  if (e.phone !== undefined) updateObj.phone = e.phone || null;
  if (e.email !== undefined) updateObj.email = e.email || null;
  if (e.hireDate !== undefined) updateObj.hire_date = e.hireDate;
  if (e.status !== undefined) updateObj.status = e.status;

  const { data, error } = await supabase
    .from('employees')
    .update(updateObj)
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  const r = data as any;
  return {
    data: {
      id: r.id, name: r.name, position: r.position, department: r.department,
      salary: Number(r.salary), phone: r.phone, email: r.email,
      hireDate: r.hire_date, status: r.status,
    },
    error: null,
  };
}

export async function deleteEmployeeDB(id: string): Promise<{ error: string | null }> {
  const supabase = getClient();
  const { error } = await supabase.from('employees').delete().eq('id', id);
  return { error: error ? error.message : null };
}

// ---- INVENTORY ----
export async function fetchInventory(): Promise<{ data: InventoryItem[]; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name');

  if (error) return { data: [], error: error.message };

  const mapped: InventoryItem[] = (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    sku: r.sku,
    category: r.category,
    quantity: Number(r.quantity),
    unit: r.unit,
    unitPrice: Number(r.unit_price),
    totalValue: Number(r.total_value),
    minStock: Number(r.min_stock),
    status: r.status,
  }));

  return { data: mapped, error: null };
}

export async function addInventoryDB(userId: string, item: Omit<InventoryItem, 'id'>): Promise<{ error: string | null }> {
  const supabase = getClient();
  const { error } = await supabase
    .from('inventory')
    .insert({
      user_id: userId,
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unitPrice,
      total_value: item.totalValue,
      min_stock: item.minStock,
      status: item.status,
    });
  return { error: error ? error.message : null };
}

// ---- INVOICES ----
export async function fetchInvoices(): Promise<{ data: Invoice[]; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('invoices')
    .select(`*, invoice_items(*)`)
    .order('date', { ascending: false });

  if (error) return { data: [], error: error.message };

  const mapped: Invoice[] = (data || []).map((r: any) => ({
    id: r.id,
    number: r.number,
    type: r.type,
    counterparty: r.counterparty,
    amount: Number(r.amount),
    currency: r.currency,
    date: r.date,
    dueDate: r.due_date,
    status: r.status,
    items: (r.invoice_items || []).map((it: any) => ({
      name: it.name,
      qty: Number(it.qty),
      price: Number(it.price),
      total: Number(it.total),
    })),
  }));

  return { data: mapped, error: null };
}

export async function addInvoiceDB(
  userId: string,
  inv: Omit<Invoice, 'id'>
): Promise<{ error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: userId,
      number: inv.number,
      type: inv.type,
      counterparty: inv.counterparty,
      amount: inv.amount,
      currency: inv.currency,
      date: inv.date,
      due_date: inv.dueDate,
      status: inv.status,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  if (inv.items.length > 0) {
    const { error: itemsError } = await getClient()
      .from('invoice_items')
      .insert(inv.items.map(it => ({
        invoice_id: (data as any).id,
        name: it.name,
        qty: it.qty,
        price: it.price,
        total: it.total,
      })));
    if (itemsError) return { error: itemsError.message };
  }

  return { error: null };
}

// ---- AI REPORTS ----
export async function fetchAIReports(): Promise<{ data: AIReport[]; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    .order('generated_at', { ascending: false });

  if (error) return { data: [], error: error.message };

  const mapped: AIReport[] = (data || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    reportType: r.report_type,
    generatedAt: r.generated_at,
    summary: r.summary,
  }));

  return { data: mapped, error: null };
}

export async function addAIReportDB(userId: string, report: Omit<AIReport, 'id'>): Promise<{ error: string | null }> {
  const supabase = getClient();
  const { error } = await supabase
    .from('ai_reports')
    .insert({
      user_id: userId,
      title: report.title,
      report_type: report.reportType,
      summary: report.summary,
    });
  return { error: error ? error.message : null };
}

// ---- SEED DATA (first-time) ----
export async function seedInitialData(userId: string): Promise<void> {
  const supabase = getClient();
  // Check if user already has data
  const { data: existing } = await supabase
    .from('transactions')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (existing && existing.length > 0) return;

  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  // Seed transactions
  const txRows = [
    { user_id: userId, type: 'income', category_id: 'sales', category_name: 'Sotuv', category_icon: 'shopping-cart', category_color: '#10B981', amount: 45000000, currency: 'UZS', amount_uzs: 45000000, description: 'Elektron jihozlar sotildi', date: daysAgo(0), counterparty: 'TechMarket LLC', invoice_number: 'INV-2024-001', tags: ['elektron'] },
    { user_id: userId, type: 'expense', category_id: 'salary', category_name: 'Ish haqi', category_icon: 'people', category_color: '#EF4444', amount: 28000000, currency: 'UZS', amount_uzs: 28000000, description: 'Yanvar oyi ish haqi', date: daysAgo(0), tags: ['oylik'] },
    { user_id: userId, type: 'income', category_id: 'services', category_name: 'Xizmatlar', category_icon: 'build', category_color: '#06B6D4', amount: 3500, currency: 'USD', amount_uzs: 44275000, description: 'IT konsalting xizmati', date: daysAgo(1), counterparty: 'GlobalTech Inc' },
    { user_id: userId, type: 'expense', category_id: 'rent', category_name: 'Ijara', category_icon: 'home', category_color: '#F59E0B', amount: 8000000, currency: 'UZS', amount_uzs: 8000000, description: 'Ofis ijara haqi', date: daysAgo(1), counterparty: 'Tashkent Tower' },
    { user_id: userId, type: 'expense', category_id: 'materials', category_name: 'Materiallar', category_icon: 'inventory', category_color: '#EC4899', amount: 12500000, currency: 'UZS', amount_uzs: 12500000, description: 'Ish materiallari sotib olindi', date: daysAgo(2), counterparty: 'BuildMart' },
    { user_id: userId, type: 'income', category_id: 'sales', category_name: 'Sotuv', category_icon: 'shopping-cart', category_color: '#10B981', amount: 67000000, currency: 'UZS', amount_uzs: 67000000, description: 'Ulgurji sotuv', date: daysAgo(2), counterparty: 'MegaStore', invoice_number: 'INV-2024-002' },
    { user_id: userId, type: 'expense', category_id: 'taxes', category_name: 'Soliqlar', category_icon: 'account-balance', category_color: '#6366F1', amount: 15000000, currency: 'UZS', amount_uzs: 15000000, description: 'QQS to\'lov', date: daysAgo(3) },
    { user_id: userId, type: 'income', category_id: 'investment', category_name: 'Investitsiya', category_icon: 'trending-up', category_color: '#8B5CF6', amount: 5000, currency: 'EUR', amount_uzs: 69100000, description: 'Investitsiya daromadi', date: daysAgo(3), counterparty: 'EuroInvest AG' },
    { user_id: userId, type: 'expense', category_id: 'utilities', category_name: 'Kommunal', category_icon: 'flash-on', category_color: '#14B8A6', amount: 3200000, currency: 'UZS', amount_uzs: 3200000, description: 'Elektr, gaz, suv', date: daysAgo(4) },
    { user_id: userId, type: 'income', category_id: 'sales', category_name: 'Sotuv', category_icon: 'shopping-cart', category_color: '#10B981', amount: 23000000, currency: 'UZS', amount_uzs: 23000000, description: 'Chakana sotuv', date: daysAgo(5), counterparty: 'Mini Market' },
  ];
  await supabase.from('transactions').insert(txRows);

  // Seed employees
  const empRows = [
    { user_id: userId, name: 'Abdullayev Botir', position: 'Bosh direktor', department: 'Boshqaruv', salary: 12000000, hire_date: '2020-03-15', status: 'active' },
    { user_id: userId, name: 'Karimova Nilufar', position: 'Bosh buxgalter', department: 'Buxgalteriya', salary: 8500000, hire_date: '2020-06-01', status: 'active' },
    { user_id: userId, name: 'Toshmatov Sardor', position: 'Sotuvchi', department: 'Sotuv', salary: 6000000, hire_date: '2021-01-10', status: 'active' },
    { user_id: userId, name: 'Rahimova Dilorom', position: 'HR menejer', department: 'HR', salary: 7000000, hire_date: '2021-04-20', status: 'active' },
    { user_id: userId, name: 'Nazarov Jasur', position: 'Dasturchi', department: 'IT', salary: 9500000, hire_date: '2022-02-01', status: 'active' },
  ];
  await supabase.from('employees').insert(empRows);

  // Seed inventory
  const invRows = [
    { user_id: userId, name: 'Noutbuk HP ProBook', sku: 'HP-PB-450', category: 'Elektron', quantity: 45, unit: 'dona', unit_price: 8500000, total_value: 382500000, min_stock: 10, status: 'in_stock' },
    { user_id: userId, name: 'Monitor Samsung 27"', sku: 'SM-M27-F', category: 'Elektron', quantity: 32, unit: 'dona', unit_price: 3200000, total_value: 102400000, min_stock: 5, status: 'in_stock' },
    { user_id: userId, name: 'A4 Qog\'oz (500 varoq)', sku: 'PAP-A4-500', category: 'Materiallar', quantity: 3, unit: 'pachka', unit_price: 65000, total_value: 195000, min_stock: 10, status: 'low_stock' },
    { user_id: userId, name: 'Klaviatura Logitech', sku: 'LG-KB-PRO', category: 'Aksesuar', quantity: 0, unit: 'dona', unit_price: 450000, total_value: 0, min_stock: 5, status: 'out_of_stock' },
  ];
  await supabase.from('inventory').insert(invRows);

  // Seed invoices + items
  const invoiceData = {
    user_id: userId, number: 'SF-2024-0001', type: 'outgoing', counterparty: 'TechMarket LLC',
    amount: 45000000, currency: 'UZS', date: daysAgo(0), due_date: daysAgo(-15), status: 'pending',
  };
  const { data: invResult } = await supabase.from('invoices').insert(invoiceData).select().single();
  if (invResult) {
    await supabase.from('invoice_items').insert([
      { invoice_id: (invResult as any).id, name: 'Noutbuk HP', qty: 5, price: 8500000, total: 42500000 },
      { invoice_id: (invResult as any).id, name: 'Yetkazish', qty: 1, price: 2500000, total: 2500000 },
    ]);
  }

  // Seed AI reports
  const reportRows = [
    { user_id: userId, title: 'Yanvar oyi foyda va zarar hisoboti', report_type: 'pnl', summary: 'Umumiy daromad ijobiy tendentsiyada. Sotuv bo\'limi eng ko\'p daromad keltirdi.' },
    { user_id: userId, title: 'Haftalik pul oqimi tahlili', report_type: 'cashflow', summary: 'Kirim tendentsiyasi ijobiy. Haftalik operatsiyalar barqaror.' },
    { user_id: userId, title: 'Inventar holati hisoboti', report_type: 'inventory', summary: 'Omborda kam qolgan tovarlar mavjud. Buyurtma kerak.' },
  ];
  await supabase.from('ai_reports').insert(reportRows);
}

// ---- HELPERS ----
export function formatMoney(amount: number, currency: Currency = 'UZS'): string {
  if (currency === 'UZS') {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M so'm`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K so'm`;
    return `${amount.toLocaleString()} so'm`;
  }
  const symbols: Record<string, string> = { USD: '$', EUR: '\u20AC' };
  return `${symbols[currency] || ''}${amount.toLocaleString()}`;
}

export function formatFullMoney(amount: number, currency: Currency = 'UZS'): string {
  if (currency === 'UZS') return `${amount.toLocaleString()} so'm`;
  const symbols: Record<string, string> = { USD: '$', EUR: '\u20AC' };
  return `${symbols[currency] || ''}${amount.toLocaleString()}`;
}
