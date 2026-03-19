import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/template';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

interface MenuItem {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  route?: string;
  badge?: string;
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { dashboardSummary } = useApp();
  const { user, logout } = useAuth();

  const SECTIONS: { title: string; items: MenuItem[] }[] = [
    {
      title: '1C MODULLARI',
      items: [
        { icon: 'inventory-2', label: 'Inventar boshqaruvi', subtitle: 'Ombor, tovar, xom ashyo', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', route: '/inventory', badge: `${dashboardSummary.lowStockCount || ''}` },
        { icon: 'people', label: 'Xodimlar va ish haqi', subtitle: "Kadrlar, ish haqi, ta'til", color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', route: '/employees' },
        { icon: 'description', label: 'Schyot-fakturalar', subtitle: 'Kirim va chiqim fakturalari', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', route: '/invoices', badge: `${dashboardSummary.pendingInvoices || ''}` },
        { icon: 'account-balance', label: 'Soliq hisobi', subtitle: "QQS, daromad solig'i", color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
      ],
    },
    {
      title: 'EXCEL FUNKSIYALARI',
      items: [
        { icon: 'table-chart', label: 'Jadval yaratish', subtitle: 'Pivot, formulalar, tahlil', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
        { icon: 'file-download', label: 'Eksport', subtitle: 'Excel, PDF, CSV formatda', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
        { icon: 'bar-chart', label: 'Grafiklar', subtitle: 'Diagramma va vizualizatsiya', color: '#EC4899', bg: 'rgba(236,72,153,0.08)' },
      ],
    },
    {
      title: 'HISOBOTLAR',
      items: [
        { icon: 'assessment', label: 'Foyda va zarar', subtitle: 'Daromad va xarajat tahlili', color: '#4F46E5', bg: theme.primaryGhost },
        { icon: 'swap-vert', label: 'Pul oqimi', subtitle: 'Kirim-chiqim harakati', color: '#14B8A6', bg: 'rgba(20,184,166,0.08)' },
        { icon: 'account-balance-wallet', label: 'Balans hisoboti', subtitle: 'Aktivlar va passivlar', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
      ],
    },
    {
      title: 'SOZLAMALAR',
      items: [
        { icon: 'business', label: 'Kompaniya', subtitle: "Ma'lumotlar, rekvizitlar", color: '#64748B', bg: 'rgba(100,116,139,0.08)' },
        { icon: 'currency-exchange', label: 'Valyuta kurslari', subtitle: 'UZS, USD, EUR', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
        { icon: 'settings', label: 'Umumiy sozlamalar', subtitle: 'Til, bildirishnomalar', color: '#94A3B8', bg: 'rgba(148,163,184,0.08)' },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Boshqaruv</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <MaterialIcons name="person" size={24} color={theme.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username || user?.email || 'Foydalanuvchi'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <MaterialIcons name="logout" size={20} color={theme.error} />
          </Pressable>
        </View>

        {/* AI Hero Card */}
        <Pressable style={styles.heroWrap} onPress={() => router.push('/(tabs)/ai-agent')}>
          <LinearGradient
            colors={[theme.primary, '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>AI Agent</Text>
                <Text style={styles.heroSub}>Avtomatik hisobotlar, tahlil, bashorat — barchasi bir joyda</Text>
              </View>
              <View style={styles.heroIconWrap}>
                <MaterialIcons name="auto-awesome" size={36} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>{dashboardSummary.transactionCount}</Text>
                <Text style={styles.heroStatLbl}>Operatsiya</Text>
              </View>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>24/7</Text>
                <Text style={styles.heroStatLbl}>Online</Text>
              </View>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>3</Text>
                <Text style={styles.heroStatLbl}>Valyuta</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <React.Fragment key={ii}>
                  <Pressable
                    style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: theme.backgroundSecondary }]}
                    onPress={() => item.route ? router.push(item.route as any) : null}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                      <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <View style={styles.menuInfo}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSub}>{item.subtitle}</Text>
                    </View>
                    {item.badge && item.badge !== '0' && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <MaterialIcons name="chevron-right" size={20} color={theme.textTertiary} />
                  </Pressable>
                  {ii < section.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>SmartBuxgalter v1.0 \u00B7 AI Agent Buxgalteriya Tizimi</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: theme.textPrimary },
  userCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 14, gap: 12, ...theme.shadow,
  },
  userAvatar: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: theme.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  userEmail: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: theme.errorLight,
    alignItems: 'center', justifyContent: 'center',
  },
  heroWrap: { paddingHorizontal: 20, marginBottom: 8 },
  heroCard: { borderRadius: theme.radiusXL, padding: 20 },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroTextWrap: { flex: 1, marginRight: 16 },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },
  heroIconWrap: { width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  heroStats: { flexDirection: 'row', marginTop: 18, gap: 20 },
  heroStatItem: { alignItems: 'center' },
  heroStatNum: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  heroStatLbl: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: theme.textTertiary, letterSpacing: 1, marginBottom: 8 },
  sectionCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, overflow: 'hidden', ...theme.shadow },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  menuSub: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: theme.borderLight, marginLeft: 68 },
  badge: { backgroundColor: theme.error, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  version: { fontSize: 12, color: theme.textTertiary, textAlign: 'center', marginTop: 32, marginBottom: 16 },
});
