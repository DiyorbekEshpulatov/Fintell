import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAlert } from '@/template';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { formatFullMoney } from '../services/database';

export default function TransactionDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, deleteTransaction } = useApp();
  const { showAlert } = useAlert();

  const tx = transactions.find(t => t.id === id);
  if (!tx) return null;

  const isIncome = tx.type === 'income';

  const handleDelete = () => {
    showAlert(
      "O'chirish",
      "Bu operatsiyani o'chirmoqchimisiz?",
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: "O'chirish",
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(tx.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.back();
          },
        },
      ]
    );
  };

  const details = [
    { label: 'Turi', value: isIncome ? 'Kirim' : 'Chiqim', icon: isIncome ? 'arrow-downward' : 'arrow-upward' },
    { label: 'Kategoriya', value: tx.categoryName, icon: tx.categoryIcon },
    { label: 'Sana', value: new Date(tx.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }), icon: 'calendar-today' },
    ...(tx.counterparty ? [{ label: 'Kontragent', value: tx.counterparty, icon: 'business' }] : []),
    ...(tx.invoiceNumber ? [{ label: 'Faktura raqami', value: tx.invoiceNumber, icon: 'receipt' }] : []),
    ...(tx.currency !== 'UZS' ? [{ label: "So'mdagi qiymati", value: formatFullMoney(tx.amountUZS, 'UZS'), icon: 'swap-horiz' }] : []),
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Operatsiya</Text>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <MaterialIcons name="delete-outline" size={22} color={theme.error} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={[styles.heroIcon, { backgroundColor: tx.categoryColor + '18' }]}>
            <MaterialIcons name={tx.categoryIcon as any} size={32} color={tx.categoryColor} />
          </View>
          <Text style={[styles.heroAmount, { color: isIncome ? theme.success : theme.error }]}>
            {isIncome ? '+' : '-'}{formatFullMoney(tx.amount, tx.currency)}
          </Text>
          <Text style={styles.heroDesc}>{tx.description}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isIncome ? theme.successLight : theme.errorLight }]}>
            <Text style={[styles.statusText, { color: isIncome ? theme.success : theme.error }]}>
              {isIncome ? 'KIRIM' : 'CHIQIM'}
            </Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          {details.map((d, i) => (
            <React.Fragment key={i}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <MaterialIcons name={d.icon as any} size={20} color={theme.textTertiary} />
                  <Text style={styles.detailLabel}>{d.label}</Text>
                </View>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
              {i < details.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {tx.tags && tx.tags.length > 0 && (
          <View style={styles.tagsWrap}>
            <Text style={styles.tagsLabel}>Teglar</Text>
            <View style={styles.tagsRow}>
              {tx.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  deleteBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.errorLight, alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: theme.surface, borderRadius: theme.radiusXL, padding: 28, alignItems: 'center', marginTop: 8, ...theme.shadowElevated },
  heroIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroAmount: { fontSize: 36, fontWeight: '700', marginBottom: 8 },
  heroDesc: { fontSize: 16, color: theme.textSecondary, textAlign: 'center', marginBottom: 16 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  statusText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  detailCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, marginTop: 20, ...theme.shadow },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { fontSize: 14, color: theme.textSecondary },
  detailValue: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  divider: { height: 1, backgroundColor: theme.borderLight },
  tagsWrap: { marginTop: 20 },
  tagsLabel: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: theme.primaryGhost, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { fontSize: 13, fontWeight: '600', color: theme.primary },
});
