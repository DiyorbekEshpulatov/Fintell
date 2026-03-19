import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { formatFullMoney } from '../services/database';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  paid: { label: "To'langan", color: '#10B981', bg: '#D1FAE5', icon: 'check-circle' },
  pending: { label: 'Kutilmoqda', color: '#F59E0B', bg: '#FEF3C7', icon: 'schedule' },
  overdue: { label: "Muddati o'tgan", color: '#EF4444', bg: '#FEE2E2', icon: 'error' },
};

export default function InvoicesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { invoices } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Schyot-fakturalar</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: theme.warning }]}>
          <Text style={styles.summaryLabel}>Kutilmoqda</Text>
          <Text style={[styles.summaryValue, { color: theme.warning }]}>{formatFullMoney(totalPending, 'UZS')}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: theme.error }]}>
          <Text style={styles.summaryLabel}>Muddati o'tgan</Text>
          <Text style={[styles.summaryValue, { color: theme.error }]}>{formatFullMoney(totalOverdue, 'UZS')}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {invoices.map((inv) => {
          const st = STATUS_MAP[inv.status];
          const isExpanded = expandedId === inv.id;
          return (
            <Pressable key={inv.id} style={styles.invCard} onPress={() => setExpandedId(isExpanded ? null : inv.id)}>
              <View style={styles.invTop}>
                <View style={styles.invInfo}>
                  <View style={styles.invNumRow}>
                    <Text style={styles.invNum}>{inv.number}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: inv.type === 'outgoing' ? '#EEF2FF' : '#FFF7ED' }]}>
                      <Text style={[styles.typeText, { color: inv.type === 'outgoing' ? theme.primary : '#D97706' }]}>
                        {inv.type === 'outgoing' ? 'Chiquvchi' : 'Kiruvchi'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.invCounterparty}>{inv.counterparty}</Text>
                </View>
                <View style={styles.invRight}>
                  <Text style={styles.invAmount}>{formatFullMoney(inv.amount, inv.currency)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                    <MaterialIcons name={st.icon as any} size={12} color={st.color} />
                    <Text style={[styles.statusLabel, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.invDates}>
                <Text style={styles.invDate}>Sana: {new Date(inv.date).toLocaleDateString('uz-UZ')}</Text>
                <Text style={styles.invDate}>Muddat: {new Date(inv.dueDate).toLocaleDateString('uz-UZ')}</Text>
              </View>

              {isExpanded && inv.items.length > 0 && (
                <View style={styles.expandedSection}>
                  <View style={styles.expandDivider} />
                  <Text style={styles.expandTitle}>TARKIBI</Text>
                  {inv.items.map((item, i) => (
                    <View key={i} style={styles.lineItem}>
                      <Text style={styles.lineItemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.lineItemQty}>{item.qty}x</Text>
                      <Text style={styles.lineItemTotal}>{formatFullMoney(item.total, 'UZS')}</Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Jami:</Text>
                    <Text style={styles.totalValue}>{formatFullMoney(inv.amount, inv.currency)}</Text>
                  </View>
                </View>
              )}

              <View style={styles.expandIndicator}>
                <MaterialIcons name={isExpanded ? 'expand-less' : 'expand-more'} size={20} color={theme.textTertiary} />
              </View>
            </Pressable>
          );
        })}

        {invoices.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <MaterialIcons name="description" size={48} color={theme.textTertiary} />
            <Text style={{ marginTop: 12, fontSize: 15, color: theme.textSecondary }}>Hozircha faktura yo'q</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 14, ...theme.shadow },
  summaryLabel: { fontSize: 12, color: theme.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700' },
  invCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, marginBottom: 10, ...theme.shadow },
  invTop: { flexDirection: 'row', justifyContent: 'space-between' },
  invInfo: { flex: 1, marginRight: 12 },
  invNumRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  invNum: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 10, fontWeight: '700' },
  invCounterparty: { fontSize: 13, color: theme.textSecondary },
  invRight: { alignItems: 'flex-end', gap: 6 },
  invAmount: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusLabel: { fontSize: 11, fontWeight: '600' },
  invDates: { flexDirection: 'row', gap: 16, marginTop: 10 },
  invDate: { fontSize: 12, color: theme.textTertiary },
  expandedSection: { marginTop: 8 },
  expandDivider: { height: 1, backgroundColor: theme.border, marginBottom: 12 },
  expandTitle: { fontSize: 11, fontWeight: '600', color: theme.textTertiary, letterSpacing: 1, marginBottom: 8 },
  lineItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  lineItemName: { flex: 1, fontSize: 14, color: theme.textPrimary },
  lineItemQty: { fontSize: 13, color: theme.textSecondary, marginHorizontal: 12 },
  lineItemTotal: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.border },
  totalLabel: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  totalValue: { fontSize: 15, fontWeight: '700', color: theme.primary },
  expandIndicator: { alignItems: 'center', marginTop: 4 },
});
