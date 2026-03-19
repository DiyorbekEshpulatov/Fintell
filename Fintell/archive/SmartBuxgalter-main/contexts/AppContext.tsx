import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/template';
import {
  Transaction, Employee, InventoryItem, Invoice, AIReport, ChatMessage,
  fetchTransactions, fetchEmployees, fetchInventory, fetchInvoices, fetchAIReports,
  addTransactionDB, deleteTransactionDB, addEmployeeDB, updateEmployeeDB, deleteEmployeeDB,
  addAIReportDB, seedInitialData,
} from '../services/database';
import { sendAIMessage, ChatMsg } from '../services/aiService';

interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  transactionCount: number;
  employeeCount: number;
  inventoryCount: number;
  lowStockCount: number;
  pendingInvoices: number;
}

interface AppState {
  transactions: Transaction[];
  employees: Employee[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  aiReports: AIReport[];
  chatMessages: ChatMessage[];
  dashboardSummary: DashboardSummary;
  loading: boolean;
  aiStreaming: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addEmployee: (e: Omit<Employee, 'id'>) => Promise<{ error: string | null }>;
  updateEmployee: (id: string, e: Partial<Omit<Employee, 'id'>>) => Promise<{ error: string | null }>;
  deleteEmployee: (id: string) => Promise<{ error: string | null }>;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  generateAIResponse: (userMessage: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [aiReports, setAiReports] = useState<AIReport[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      role: 'assistant',
      content: 'Assalomu alaykum! Men SmartBuxgalter AI agentman. Sizga moliyaviy hisobot tayyorlash, soliq maslahat berish, xarajatlarni tahlil qilish yoki bashorat qilishda yordam bera olaman. Nimani bilmoqchisiz?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [aiStreaming, setAiStreaming] = useState(false);
  const streamingMsgRef = useRef<string>('');

  const loadAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await seedInitialData(user.id);
      const [txRes, empRes, invRes, invoiceRes, reportRes] = await Promise.all([
        fetchTransactions(),
        fetchEmployees(),
        fetchInventory(),
        fetchInvoices(),
        fetchAIReports(),
      ]);
      setTransactions(txRes.data);
      setEmployees(empRes.data);
      setInventory(invRes.data);
      setInvoices(invoiceRes.data);
      setAiReports(reportRes.data);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [user, loadAllData]);

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const { data, error } = await addTransactionDB(user.id, t);
    if (data && !error) {
      setTransactions(prev => [data, ...prev]);
    }
  }, [user]);

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await deleteTransactionDB(id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  }, []);

  const addEmployee = useCallback(async (e: Omit<Employee, 'id'>): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Foydalanuvchi topilmadi' };
    const { data, error } = await addEmployeeDB(user.id, e);
    if (data && !error) {
      setEmployees(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    }
    return { error };
  }, [user]);

  const updateEmployee = useCallback(async (id: string, e: Partial<Omit<Employee, 'id'>>): Promise<{ error: string | null }> => {
    const { data, error } = await updateEmployeeDB(id, e);
    if (data && !error) {
      setEmployees(prev => prev.map(emp => emp.id === id ? data : emp));
    }
    return { error };
  }, []);

  const deleteEmployee = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const { error } = await deleteEmployeeDB(id);
    if (!error) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
    return { error };
  }, []);

  const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMsg]);
  }, []);

  const generateAIResponse = useCallback((userMessage: string) => {
    if (aiStreaming) return;
    setAiStreaming(true);
    streamingMsgRef.current = '';

    const streamMsgId = `ai_${Date.now()}`;

    // Add empty AI message placeholder
    const placeholder: ChatMessage = {
      id: streamMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, placeholder]);

    // Build chat history (last 10 messages for context)
    const recentMessages: ChatMsg[] = chatMessages
      .filter(m => m.id !== 'c1')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));
    recentMessages.push({ role: 'user', content: userMessage });

    sendAIMessage(
      recentMessages,
      { transactions, employees, inventory, invoices },
      // onChunk
      (chunk: string) => {
        streamingMsgRef.current += chunk;
        const currentText = streamingMsgRef.current;
        setChatMessages(prev =>
          prev.map(m => m.id === streamMsgId ? { ...m, content: currentText } : m)
        );
      },
      // onDone
      () => {
        setAiStreaming(false);

        // Save report if it was a report request
        const lower = userMessage.toLowerCase();
        if (
          user &&
          (lower.includes('hisobot') || lower.includes('report') || lower.includes('tahlil'))
        ) {
          const finalContent = streamingMsgRef.current;
          if (finalContent.length > 50) {
            addAIReportDB(user.id, {
              title: userMessage.slice(0, 100),
              reportType: 'ai_chat',
              generatedAt: new Date().toISOString(),
              summary: finalContent.slice(0, 500),
            }).then(() => {
              fetchAIReports().then(res => {
                if (res.data.length > 0) setAiReports(res.data);
              });
            });
          }
        }
      },
      // onError
      (error: string) => {
        setAiStreaming(false);
        setChatMessages(prev =>
          prev.map(m => m.id === streamMsgId
            ? { ...m, content: `Xatolik yuz berdi: ${error}\n\nIltimos, qayta urinib ko'ring.` }
            : m
          )
        );
      }
    );
  }, [aiStreaming, chatMessages, transactions, employees, inventory, invoices, user]);

  const dashboardSummary: DashboardSummary = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUZS, 0),
    totalExpense: transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUZS, 0),
    profit: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUZS, 0) -
            transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUZS, 0),
    transactionCount: transactions.length,
    employeeCount: employees.filter(e => e.status === 'active').length,
    inventoryCount: inventory.length,
    lowStockCount: inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length,
    pendingInvoices: invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length,
  };

  return (
    <AppContext.Provider value={{
      transactions, employees, inventory, invoices, aiReports, chatMessages,
      dashboardSummary, loading, aiStreaming,
      addTransaction, deleteTransaction,
      addEmployee, updateEmployee, deleteEmployee,
      addChatMessage, generateAIResponse,
      refreshData: loadAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
