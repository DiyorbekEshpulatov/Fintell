import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { formatMoney } from '../../services/database';
import MetricCard from '../../components/ui/MetricCard';
import SectionHeader from '../../components/ui/SectionHeader';
import TransactionRow from '../../components/ui/TransactionRow';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions, dashboardSummary, aiReports, loading } = useApp();
  const recentTx = transactions.slice(0, 5);

  // Calculate weekly data from real transactions
  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  const weeklyData = days.map((day, i) => {
    const dayTxs = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getDay() === (i + 1) % 7;
    });
    return {
      day,
      income: dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUZS, 0),
      expense: dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUZS, 0),
    };
  });
  const maxBar = Math.max(...weeklyData.map(d => d.income + d.expense), 1);

  // Category breakdown from real data
  const incomeCategories: Record<string, { name: string; amount: number; color: string }> = {};
  transactions.filter(t => t.type === 'income').forEach(t => {
    if (!incomeCategories[t.categoryId]) {
      incomeCategories[t.categoryId] = { name: t.categoryName, amount: 0, color: t.categoryColor };
    }
    incomeCategories[t.categoryId].amount += t.amountUZS;
  });
  const catTotal = Object.values(incomeCategories).reduce((s, c) => s + c.amount, 0) || 1;
  const categories = Object.values(incomeCategories)
    .sort((a, b) => b.amount - a.amount)
    .map(c => ({ ...c, percentage: Math.round((c.amount / catTotal) * 100) }));

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 12, color: theme.textSecondary }}>Ma'lumotlar yuklanmoqda...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>SmartBuxgalter</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
          <Pressable style={styles.aiBtn} onPress={() => router.push('/(tabs)/ai-agent')}>
            <MaterialIcons name="auto-awesome" size={20} color="#FFF" />
          </Pressable>
        </View>

        {/* Hero Balance Card */}
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={[theme.primary, theme.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>SOF FOYDA</Text>
              <View style={styles.profitBadge}>
                <MaterialIcons name={dashboardSummary.profit >= 0 ? 'trending-up' : 'trending-down'} size={14} color={dashboardSummary.profit >= 0 ? theme.success : theme.error} />
                <Text style={[styles.profitText, { color: dashboardSummary.profit >= 0 ? '#10B981' : '#EF4444' }]}>
                  {dashboardSummary.profit >= 0 ? '+' : ''}{((dashboardSummary.profit / (dashboardSummary.totalIncome || 1)) * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
            <Text style={styles.heroValue}>
              {(dashboardSummary.profit / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.heroCurrency}>so'm</Text>
            <View style={styles.heroRow}>
              <View style={styles.heroStat}>
                <MaterialIcons name="arrow-downward" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroStatLabel}>Kirim</Text>
                <Text style={styles.heroStatValue}>{formatMoney(dashboardSummary.totalIncome)}</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <MaterialIcons name="arrow-upward" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroStatLabel}>Chiqim</Text>
                <Text style={styles.heroStatValue}>{formatMoney(dashboardSummary.totalExpense)}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Metrics */}
        <View style={styles.metricsRow}>
          <MetricCard icon="receipt-long" iconColor={theme.primary} iconBg={theme.primaryGhost} label="Tranzaksiyalar" value={`${dashboardSummary.transactionCount}`} onPress={() => router.push('/(tabs)/transactions')} />
          <MetricCard icon="people" iconColor="#06B6D4" iconBg="rgba(6,182,212,0.08)" label="Xodimlar" value={`${dashboardSummary.employeeCount}`} onPress={() => router.push('/employees')} />
        </View>
        <View style={[styles.metricsRow, { marginTop: 10 }]}>
          <MetricCard icon="inventory-2" iconColor="#F59E0B" iconBg="rgba(245,158,11,0.08)" label="Inventar" value={`${dashboardSummary.inventoryCount}`} subtitle={dashboardSummary.lowStockCount > 0 ? `\u26A0\uFE0F ${dashboardSummary.lowStockCount} ta kam` : undefined} onPress={() => router.push('/inventory')} />
          <MetricCard icon="description" iconColor="#8B5CF6" iconBg="rgba(139,92,246,0.08)" label="Schyot-faktura" value={`${dashboardSummary.pendingInvoices}`} subtitle="kutilmoqda" onPress={() => router.push('/invoices')} />
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <SectionHeader title="Haftalik ko'rsatkich" />
          <View style={styles.chartCard}>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
                <Text style={styles.legendText}>Kirim</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.error }]} />
                <Text style={styles.legendText}>Chiqim</Text>
              </View>
            </View>
            <View style={styles.barsContainer}>
              {weeklyData.map((d, i) => (
                <View key={i} style={styles.barGroup}>
                  <View style={styles.barWrap}>
                    <View style={[styles.bar, { height: Math.max(4, (d.income / maxBar) * 100), backgroundColor: theme.primary, borderTopLeftRadius: 4, borderTopRightRadius: 4 }]} />
                    <View style={[styles.bar, { height: Math.max(4, (d.expense / maxBar) * 100), backgroundColor: theme.error + '60', borderTopLeftRadius: 4, borderTopRightRadius: 4 }]} />
                  </View>
                  <Text style={styles.barLabel}>{d.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Income Breakdown */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Daromad tarkibi" />
            <View style={styles.chartCard}>
              {categories.map((cat, i) => (
                <View key={i} style={styles.categoryRow}>
                  <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.catName}>{cat.name}</Text>
                  <View style={styles.catBarWrap}>
                    <View style={[styles.catBar, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                  </View>
                  <Text style={styles.catPercent}>{cat.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AI Insights */}
        {aiReports.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="AI Agent hisobotlari" actionLabel="Barchasi" onAction={() => router.push('/(tabs)/ai-agent')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {aiReports.slice(0, 3).map((report) => (
                <Pressable key={report.id} style={styles.reportCard} onPress={() => router.push({ pathname: '/report-detail', params: { id: report.id } })}>
                  <View style={styles.reportIcon}>
                    <MaterialIcons name="auto-awesome" size={18} color={theme.primary} />
                  </View>
                  <Text style={styles.reportTitle} numberOfLines={2}>{report.title}</Text>
                  <Text style={styles.reportDate}>{new Date(report.generatedAt).toLocaleDateString('uz-UZ')}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent Transactions */}
        {recentTx.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="So'nggi operatsiyalar" actionLabel="Barchasi" onAction={() => router.push('/(tabs)/transactions')} />
            <View style={styles.txCard}>
              {recentTx.map((tx, i) => (
                <React.Fragment key={tx.id}>
                  <TransactionRow transaction={tx} onPress={() => router.push({ pathname: '/transaction-detail', params: { id: tx.id } })} />
                  {i < recentTx.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {transactions.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 20, paddingHorizontal: 40 }}>
            <MaterialIcons name="receipt-long" size={48} color={theme.textTertiary} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.textSecondary, marginTop: 12, textAlign: 'center' }}>
              Hozircha tranzaksiya yo'q
            </Text>
            <Text style={{ fontSize: 13, color: theme.textTertiary, marginTop: 4, textAlign: 'center' }}>
              Yangi operatsiya qo'shish uchun + tugmasini bosing
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.94 }] }]}
        onPress={() => router.push('/add-transaction')}
      >
        <MaterialIcons name="add" size={28} color="#FFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  greeting: { fontSize: 24, fontWeight: '700', color: theme.textPrimary },
  date: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  aiBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', ...theme.shadowHero },
  heroWrap: { paddingHorizontal: 20, marginBottom: 16 },
  heroCard: { borderRadius: theme.radiusXL, padding: 24, ...theme.shadowHero },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5 },
  profitBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, gap: 4 },
  profitText: { fontSize: 12, fontWeight: '700' },
  heroValue: { fontSize: 48, fontWeight: '700', color: '#FFF' },
  heroCurrency: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.7)', marginTop: -4, marginBottom: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, flexDirection: 'column', gap: 4 },
  heroStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  heroStatValue: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  heroDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },
  metricsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  section: { paddingHorizontal: 20 },
  chartCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, ...theme.shadow },
  chartLegend: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: theme.textSecondary },
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110 },
  barGroup: { alignItems: 'center', flex: 1 },
  barWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 100 },
  bar: { width: 14, minHeight: 4 },
  barLabel: { fontSize: 11, color: theme.textTertiary, marginTop: 6 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 14, fontWeight: '500', color: theme.textPrimary, width: 80 },
  catBarWrap: { flex: 1, height: 8, backgroundColor: theme.backgroundSecondary, borderRadius: 4, overflow: 'hidden' },
  catBar: { height: 8, borderRadius: 4 },
  catPercent: { fontSize: 14, fontWeight: '700', color: theme.textPrimary, width: 40, textAlign: 'right' },
  reportCard: { width: 160, backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, ...theme.shadow },
  reportIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.primaryGhost, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  reportTitle: { fontSize: 13, fontWeight: '600', color: theme.textPrimary, marginBottom: 6 },
  reportDate: { fontSize: 11, color: theme.textTertiary },
  txCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 12, ...theme.shadow },
  divider: { height: 1, backgroundColor: theme.borderLight, marginLeft: 56 },
  fab: { position: 'absolute', bottom: 90, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', ...theme.shadowHero },
});
