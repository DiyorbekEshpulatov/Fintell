import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { formatMoney } from '../../services/database';
import TransactionRow from '../../components/ui/TransactionRow';

type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions, dashboardSummary } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    filtered.forEach(tx => {
      const key = tx.date;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Barchasi' },
    { key: 'income', label: 'Kirim' },
    { key: 'expense', label: 'Chiqim' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Tranzaksiyalar</Text>
        <Pressable style={styles.addBtn} onPress={() => router.push('/add-transaction')}>
          <MaterialIcons name="add" size={22} color="#FFF" />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#ECFDF5' }]}>
          <MaterialIcons name="arrow-downward" size={16} color={theme.success} />
          <Text style={[styles.summaryValue, { color: theme.success }]}>{formatMoney(dashboardSummary.totalIncome)}</Text>
          <Text style={styles.summaryLabel}>Kirim</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FEF2F2' }]}>
          <MaterialIcons name="arrow-upward" size={16} color={theme.error} />
          <Text style={[styles.summaryValue, { color: theme.error }]}>{formatMoney(dashboardSummary.totalExpense)}</Text>
          <Text style={styles.summaryLabel}>Chiqim</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <Pressable key={f.key} style={[styles.filterChip, filter === f.key && styles.filterActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {grouped.map(([date, txs]) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{new Date(date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}</Text>
            <View style={styles.txCard}>
              {txs.map((tx, i) => (
                <React.Fragment key={tx.id}>
                  <TransactionRow transaction={tx} onPress={() => router.push({ pathname: '/transaction-detail', params: { id: tx.id } })} />
                  {i < txs.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
        {transactions.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <MaterialIcons name="receipt-long" size={48} color={theme.textTertiary} />
            <Text style={{ marginTop: 12, fontSize: 15, color: theme.textSecondary }}>Hozircha tranzaksiya yo'q</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: theme.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  summaryCard: { flex: 1, borderRadius: theme.radiusMedium, padding: 14, gap: 4 },
  summaryValue: { fontSize: 18, fontWeight: '700' },
  summaryLabel: { fontSize: 12, color: theme.textSecondary },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.backgroundSecondary },
  filterActive: { backgroundColor: theme.primary },
  filterText: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
  filterTextActive: { color: '#FFF' },
  dateHeader: { fontSize: 14, fontWeight: '600', color: theme.textSecondary, marginTop: 20, marginBottom: 8 },
  txCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, paddingHorizontal: 12, ...theme.shadow },
  divider: { height: 1, backgroundColor: theme.borderLight, marginLeft: 56 },
});
