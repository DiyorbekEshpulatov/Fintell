// SmartBuxgalter — AI Agent Service (OnSpace AI)
import { getSupabaseClient } from '@/template';
import { Transaction, Employee, InventoryItem, Invoice } from './database';

interface BusinessData {
  transactions: Transaction[];
  employees: Employee[];
  inventory: InventoryItem[];
  invoices: Invoice[];
}

function buildBusinessContext(data: BusinessData): string {
  const { transactions, employees, inventory, invoices } = data;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUZS, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUZS, 0);
  const profit = totalIncome - totalExpense;

  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};
  transactions.forEach(t => {
    const target = t.type === 'income' ? incomeByCategory : expenseByCategory;
    target[t.categoryName] = (target[t.categoryName] || 0) + t.amountUZS;
  });

  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const totalInventoryValue = inventory.reduce((s, i) => s + i.totalValue, 0);
  const lowStockItems = inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock');
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');

  const formatM = (n: number) => `${(n / 1000000).toFixed(1)}M`;

  let ctx = `--- MOLIYAVIY HOLAT ---
Umumiy daromad: ${formatM(totalIncome)} so'm
Umumiy xarajat: ${formatM(totalExpense)} so'm
Sof foyda: ${formatM(profit)} so'm
Tranzaksiyalar soni: ${transactions.length}

--- DAROMAD TARKIBI ---
${Object.entries(incomeByCategory).map(([k, v]) => `${k}: ${formatM(v)} so'm`).join('\n')}

--- XARAJAT TARKIBI ---
${Object.entries(expenseByCategory).map(([k, v]) => `${k}: ${formatM(v)} so'm`).join('\n')}

--- XODIMLAR ---
Jami: ${employees.length} nafar
Ish haqi fondi: ${formatM(totalSalary)} so'm/oy
${employees.map(e => `${e.name} - ${e.position} (${e.department}) - ${formatM(e.salary)} so'm`).join('\n')}

--- INVENTAR ---
Jami: ${inventory.length} tur, qiymat: ${formatM(totalInventoryValue)} so'm
${lowStockItems.length > 0 ? `Kam/tugagan: ${lowStockItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}` : 'Barcha tovarlar yetarli'}

--- FAKTURALAR ---
Kutilmoqda: ${pendingInvoices.length} ta, jami: ${formatM(pendingInvoices.reduce((s, i) => s + i.amount, 0))} so'm
Muddati o'tgan: ${overdueInvoices.length} ta`;

  return ctx;
}

export interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendAIMessage(
  chatHistory: ChatMsg[],
  businessData: BusinessData,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  const businessContext = buildBusinessContext(businessData);

  try {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || '';

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const url = `${supabaseUrl}/functions/v1/ai-chat`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
      },
      body: JSON.stringify({
        messages: chatHistory,
        businessContext,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      onError(`AI xatosi (${response.status}): ${errText}`);
      return;
    }

    const reader = response.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(payload);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch {
            // skip unparseable chunks
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          } catch {
            // skip
          }
        }
      }
      onDone();
    } else {
      // Fallback: non-streaming
      const fullText = await response.text();
      let fullContent = '';
      const lines = fullText.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') break;
        try {
          const parsed = JSON.parse(payload);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) fullContent += content;
        } catch {
          // skip
        }
      }
      if (fullContent) {
        onChunk(fullContent);
      }
      onDone();
    }
  } catch (err) {
    onError(`Tarmoq xatosi: ${(err as Error).message}`);
  }
}
