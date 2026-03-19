// SmartBuxgalter Configuration
export const config = {
  appName: 'SmartBuxgalter',
  version: '1.0.0',
  tagline: 'AI Agent Buxgalteriya Tizimi',
  description: '1C + Excel + AI — Barcha buxgalteriya bir ilovada',
  
  currencies: [
    { code: 'UZS', symbol: "so'm", name: "O'zbek so'mi", flag: '🇺🇿', rate: 1 },
    { code: 'USD', symbol: '$', name: 'AQSH dollari', flag: '🇺🇸', rate: 12650 },
    { code: 'EUR', symbol: '€', name: 'Yevro', flag: '🇪🇺', rate: 13820 },
  ],
  
  defaultCurrency: 'UZS',
  
  transactionCategories: {
    income: [
      { id: 'sales', name: 'Sotuv', icon: 'shopping-cart', color: '#10B981' },
      { id: 'services', name: 'Xizmatlar', icon: 'build', color: '#06B6D4' },
      { id: 'investment', name: 'Investitsiya', icon: 'trending-up', color: '#8B5CF6' },
      { id: 'other_income', name: 'Boshqa kirim', icon: 'add-circle', color: '#3B82F6' },
    ],
    expense: [
      { id: 'salary', name: 'Ish haqi', icon: 'people', color: '#EF4444' },
      { id: 'rent', name: 'Ijara', icon: 'home', color: '#F59E0B' },
      { id: 'materials', name: 'Materiallar', icon: 'inventory', color: '#EC4899' },
      { id: 'taxes', name: 'Soliqlar', icon: 'account-balance', color: '#6366F1' },
      { id: 'utilities', name: 'Kommunal', icon: 'flash-on', color: '#14B8A6' },
      { id: 'transport', name: 'Transport', icon: 'directions-car', color: '#F97316' },
      { id: 'marketing', name: 'Marketing', icon: 'campaign', color: '#A855F7' },
      { id: 'other_expense', name: 'Boshqa chiqim', icon: 'remove-circle', color: '#64748B' },
    ],
  },
  
  reportTypes: [
    { id: 'pnl', name: 'Foyda va Zarar', icon: 'assessment', description: 'Daromad va xarajatlar tahlili' },
    { id: 'balance', name: 'Balans', icon: 'account-balance-wallet', description: 'Aktivlar va passivlar' },
    { id: 'cashflow', name: 'Pul oqimi', icon: 'swap-vert', description: 'Kirim-chiqim harakati' },
    { id: 'tax', name: 'Soliq hisoboti', icon: 'receipt-long', description: 'Soliq hisob-kitobi' },
    { id: 'salary', name: 'Ish haqi hisoboti', icon: 'people', description: 'Xodimlar ish haqi' },
    { id: 'inventory', name: 'Inventar hisoboti', icon: 'inventory-2', description: 'Ombor holati' },
  ],
  
  aiAgentCapabilities: [
    'Avtomatik hisobot tayyorlash',
    'Soliq hisoblash',
    'Moliyaviy tahlil va bashorat',
    'Xarajatlarni optimallashtirish',
    'Ish haqi hisoblash',
    'Valyuta konvertatsiyasi',
  ],
};
