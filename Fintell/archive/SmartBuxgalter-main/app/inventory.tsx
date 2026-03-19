import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { formatFullMoney } from '../services/database';

type StatusFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  in_stock: { label: 'Bor', color: '#10B981', bg: '#D1FAE5' },
  low_stock: { label: 'Kam', color: '#F59E0B', bg: '#FEF3C7' },
  out_of_stock: { label: 'Tugagan', color: '#EF4444', bg: '#FEE2E2' },
};

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { inventory } = useApp();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = filter === 'all' ? inventory : inventory.filter(i => i.status === filter);
  const totalValue = inventory.reduce((s, i) => s + i.totalValue, 0);
  const lowCount = inventory.filter(i => i.status === 'low_stock').length;
  const outCount = inventory.filter(i => i.status === 'out_of_stock').length;

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `Barchasi (${inventory.length})` },
    { key: 'in_stock', label: 'Bor' },
    { key: 'low_stock', label: `Kam (${lowCount})` },
    { key: 'out_of_stock', label: `Tugagan (${outCount})` },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Inventar</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Umumiy qiymat</Text>
          <Text style={styles.summaryValue}>{(totalValue / 1000000).toFixed(0)}M so'm</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tovarlar</Text>
          <Text style={styles.summaryValue}>{inventory.length} tur</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 12 }}>
        {filters.map(f => (
          <Pressable key={f.key} style={[styles.filterChip, filter === f.key && styles.filterActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && { color: '#FFF' }]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => {
          const st = STATUS_MAP[item.status];
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemSku}>{item.sku} \u00B7 {item.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>
              <View style={styles.itemBottom}>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Miqdor</Text>
                  <Text style={[styles.itemStatValue, item.quantity <= item.minStock && { color: theme.error }]}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Narx</Text>
                  <Text style={styles.itemStatValue}>{formatFullMoney(item.unitPrice, 'UZS')}</Text>
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Jami</Text>
                  <Text style={[styles.itemStatValue, { color: theme.primary }]}>
                    {(item.totalValue / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>
              {item.quantity <= item.minStock && item.quantity > 0 && (
                <View style={styles.warningRow}>
                  <MaterialIcons name="warning" size={14} color={theme.warning} />
                  <Text style={styles.warningText}>Minimum ({item.minStock} {item.unit}) dan kam qoldi</Text>
                </View>
              )}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Image source={require('../assets/images/empty-inventory.png')} style={styles.emptyImg} contentFit="contain" />
            <Text style={styles.emptyText}>Bu filtrdagi tovar topilmadi</Text>
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
  summaryCard: { flex: 1, backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, ...theme.shadow },
  summaryLabel: { fontSize: 12, color: theme.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: '700', color: theme.textPrimary },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.backgroundSecondary },
  filterActive: { backgroundColor: theme.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: theme.textSecondary },
  itemCard: { backgroundColor: theme.surface, borderRadius: theme.radiusMedium, padding: 16, marginBottom: 10, ...theme.shadow },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  itemInfo: { flex: 1, marginRight: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  itemSku: { fontSize: 12, color: theme.textTertiary, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  itemBottom: { flexDirection: 'row', gap: 16 },
  itemStat: {},
  itemStatLabel: { fontSize: 11, color: theme.textTertiary, marginBottom: 2, textTransform: 'uppercase' },
  itemStatValue: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: theme.warningLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  warningText: { fontSize: 12, color: '#92400E' },
  emptyWrap: { alignItems: 'center', paddingTop: 40 },
  emptyImg: { width: 200, height: 200, marginBottom: 16 },
  emptyText: { fontSize: 15, color: theme.textSecondary },
});
