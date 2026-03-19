import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { formatMoney } from '../services/database';

export default function ReportDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { aiReports, dashboardSummary, transactions } = useApp();

  const report = aiReports.find(r => r.id === id);
  if (!report) return null;

  // Build real breakdowns
  const incomeCategories: Record<string, { name: string; amount: number; color: string }> = {};
  const expenseCategories: Record<string, { name: string; amount: number; color: string }> = {};
  transactions.forEach(t => {
    const target = t.type === 'income' ? incomeCategories : expenseCategories;
    if (!target[t.categoryId]) {
      target[t.categoryId] = { name: t.categoryName, amount: 0, color: t.categoryColor };
    }
    target[t.categoryId].amount += t.amountUZS;
  });

  const makeBreakdown = (cats: typeof incomeCategories) => {
    const total = Object.values(cats).reduce((s, c) => s + c.amount, 0) || 1;
    return Object.values(cats).sort((a, b) => b.amount - a.amount).map(c => ({ ...c, percentage: Math.round((c.amount / total) * 100) }));
  };

  const incomeBreakdown = makeBreakdown(incomeCategories);
  const expenseBreakdown = makeBreakdown(expenseCategories);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>AI Hisobot</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.aiBadge}>
              <MaterialIcons name="auto-awesome" size={16} color={theme.primary} />
              <Text style={styles.aiBadgeText}>AI tayyorladi</Text>
            </View>
            <Text style={styles.heroDate}>{new Date(report.generatedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
          <Text style={styles.heroTitle}>{report.title}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
            <Text style={styles.statusText}>Tayyor</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>XULOSA</Text>
          <Text style={styles.summaryText}>{report.summary}</Text>
        </View>

        <Text style={styles.sectionTitle}>ASOSIY KO'RSATKICHLAR</Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricItem, { backgroundColor: '#ECFDF5' }]}>
            <Text style={styles.metricLabel}>Umumiy daromad</Text>
            <Text style={[styles.metricValue, { color: theme.success }]}>{formatMoney(dashboardSummary.totalIncome)}</Text>
          </View>
          <View style={[styles.metricItem, { backgroundColor: '#FEF2F2' }]}>
            <Text style={styles.metricLabel}>Umumiy xarajat</Text>
            <Text style={[styles.metricValue, { color: theme.error }]}>{formatMoney(dashboardSummary.totalExpense)}</Text>
          </View>
          <View style={[styles.metricItem, { backgroundColor: theme.primaryGhost }]}>
            <Text style={styles.metricLabel}>Sof foyda</Text>
            <Text style={[styles.metricValue, { color: theme.primary }]}>{formatMoney(dashboardSummary.profit)}</Text>
          </View>
          <View style={[styles.metricItem, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.metricLabel}>Tranzaksiyalar</Text>
            <Text style={[styles.metricValue, { color: '#D97706' }]}>{dashboardSummary.transactionCount}</Text>
          </View>
        </View>

        {incomeBreakdown.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>DAROMAD TARKIBI</Text>
            <View style={styles.breakdownCard}>
              {incomeBreakdown.map((cat, i) => (
                <View key={i} style={styles.breakdownRow}>
                  <View style={[styles.breakdownDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.breakdownName}>{cat.name}</Text>
                  <View style={styles.breakdownBarWrap}>
                    <View style={[styles.breakdownBar, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                  </View>
                  <Text style={styles.breakdownPercent}>{cat.percentage}%</Text>
                  <Text style={styles.breakdownAmount}>{formatMoney(cat.amount)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {expenseBreakdown.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>XARAJAT TARKIBI</Text>
            <View style={styles.breakdownCard}>
              {expenseBreakdown.map((cat, i) => (
                <View key={i} style={styles.breakdownRow}>
                  <View style={[styles.breakdownDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.breakdownName}>{cat.name}</Text>
                  <View style={styles.breakdownBarWrap}>
                    <View style={[styles.breakdownBar, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                  </View>
                  <Text style={styles.breakdownPercent}>{cat.percentage}%</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.recCard}>
          <View style={styles.recHeader}>
            <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
            <Text style={styles.recTitle}>AI Tavsiyalar</Text>
          </View>
          <Text style={styles.recText}>
            1. Marketing xarajatlarini 10% oshiring — sotuv hajmi 15% ga oshishi kutilmoqda.{'\n'}
            2. Material xarajatlarini optimallashtirish uchun yangi yetkazib beruvchilarni qidiring.{'\n'}
            3. Valyuta riskini kamaytirish uchun UZS da ko'proq operatsiya qiling.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, flex: 1, textAlign: 'center' },
  heroCard: { backgroundColor: theme.surface, borderRadius: theme.radiusXL, padding: 24, marginTop: 8, ...theme.shadowElevated },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.primaryGhost, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  aiBadgeText: { fontSize: 12, fontWeight: '600', color: theme.primary },
  heroDate: { fontSize: 12, color: theme.textTertiary },
  heroTitle: { fontSize: 22, fontWeight: '700', color: theme.textPrimary, marginBottom: 12, lineHeight: 28 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600', color: theme.success },
  summaryCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, marginTop: 16, ...theme.shadow },
  summaryLabel: { fontSize: 11, fontWeight: '600', color: theme.textTertiary, letterSpacing: 1, marginBottom: 8 },
  summaryText: { fontSize: 14, lineHeight: 22, color: theme.textPrimary },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: theme.textTertiary, letterSpacing: 1, marginTop: 24, marginBottom: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricItem: { width: '48%', borderRadius: theme.radiusMedium, padding: 16 },
  metricLabel: { fontSize: 12, color: theme.textSecondary, marginBottom: 6 },
  metricValue: { fontSize: 20, fontWeight: '700' },
  breakdownCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, ...theme.shadow },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  breakdownDot: { width: 8, height: 8, borderRadius: 4 },
  breakdownName: { fontSize: 13, fontWeight: '500', color: theme.textPrimary, width: 70 },
  breakdownBarWrap: { flex: 1, height: 6, backgroundColor: theme.backgroundSecondary, borderRadius: 3, overflow: 'hidden' },
  breakdownBar: { height: 6, borderRadius: 3 },
  breakdownPercent: { fontSize: 13, fontWeight: '700', color: theme.textPrimary, width: 36, textAlign: 'right' },
  breakdownAmount: { fontSize: 12, color: theme.textSecondary, width: 60, textAlign: 'right' },
  recCard: { backgroundColor: '#FFFBEB', borderRadius: theme.radiusMedium, padding: 16, marginTop: 20, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  recHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  recTitle: { fontSize: 15, fontWeight: '700', color: '#92400E' },
  recText: { fontSize: 14, lineHeight: 22, color: '#78350F' },
});
