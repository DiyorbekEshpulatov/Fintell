import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAlert } from '@/template';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { formatFullMoney } from '../services/database';

const STATUS_COLORS: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Faol', color: '#10B981', bg: '#D1FAE5' },
  inactive: { label: 'Nofaol', color: '#EF4444', bg: '#FEE2E2' },
  on_leave: { label: "Ta'tilda", color: '#F59E0B', bg: '#FEF3C7' },
};

const DEPT_COLORS: Record<string, string> = {
  'Boshqaruv': '#4F46E5',
  'Buxgalteriya': '#06B6D4',
  'Sotuv': '#10B981',
  'HR': '#EC4899',
  'IT': '#8B5CF6',
  'Logistika': '#F59E0B',
  'Marketing': '#A855F7',
  'Ishlab chiqarish': '#EF4444',
};

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { employees, deleteEmployee } = useApp();
  const { showAlert } = useAlert();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const departments = [...new Set(employees.map(e => e.department))];

  const handleDelete = useCallback((id: string, name: string) => {
    showAlert(
      "O'chirish",
      `${name} ni o'chirishni tasdiqlaysizmi?`,
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: "O'chirish",
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteEmployee(id);
            if (error) {
              showAlert('Xatolik', error);
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  }, [deleteEmployee, showAlert]);

  const handleEdit = useCallback((id: string) => {
    router.push({ pathname: '/employee-form', params: { id } });
  }, [router]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Xodimlar</Text>
        <Pressable
          onPress={() => router.push('/employee-form')}
          style={styles.addBtn}
        >
          <MaterialIcons name="person-add" size={20} color="#FFF" />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#EEF2FF' }]}>
          <MaterialIcons name="people" size={20} color={theme.primary} />
          <Text style={styles.summaryValue}>{employees.length}</Text>
          <Text style={styles.summaryLabel}>Jami xodim</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#ECFDF5' }]}>
          <MaterialIcons name="payments" size={20} color={theme.success} />
          <Text style={styles.summaryValue}>{(totalSalary / 1000000).toFixed(1)}M</Text>
          <Text style={styles.summaryLabel}>Ish haqi fondi</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
          <MaterialIcons name="domain" size={20} color="#D97706" />
          <Text style={styles.summaryValue}>{departments.length}</Text>
          <Text style={styles.summaryLabel}>Bo'lim</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {departments.map(dept => {
          const deptEmployees = employees.filter(e => e.department === dept);
          const deptColor = DEPT_COLORS[dept] || theme.textSecondary;
          return (
            <View key={dept} style={styles.deptSection}>
              <View style={styles.deptHeader}>
                <View style={[styles.deptDot, { backgroundColor: deptColor }]} />
                <Text style={styles.deptName}>{dept}</Text>
                <Text style={styles.deptCount}>{deptEmployees.length} nafar</Text>
              </View>
              <View style={styles.deptCard}>
                {deptEmployees.map((emp, i) => {
                  const st = STATUS_COLORS[emp.status] || STATUS_COLORS.active;
                  const initials = emp.name.split(' ').map(n => n[0]).join('');
                  const isExpanded = expandedId === emp.id;

                  return (
                    <React.Fragment key={emp.id}>
                      <Pressable
                        style={styles.empRow}
                        onPress={() => setExpandedId(isExpanded ? null : emp.id)}
                      >
                        <View style={[styles.avatar, { backgroundColor: deptColor + '18' }]}>
                          <Text style={[styles.avatarText, { color: deptColor }]}>{initials}</Text>
                        </View>
                        <View style={styles.empInfo}>
                          <Text style={styles.empName}>{emp.name}</Text>
                          <Text style={styles.empPos}>{emp.position}</Text>
                        </View>
                        <View style={styles.empRight}>
                          <Text style={styles.empSalary}>{formatFullMoney(emp.salary, 'UZS')}</Text>
                          <View style={[styles.empBadge, { backgroundColor: st.bg }]}>
                            <Text style={[styles.empBadgeText, { color: st.color }]}>{st.label}</Text>
                          </View>
                        </View>
                        <MaterialIcons
                          name={isExpanded ? 'expand-less' : 'expand-more'}
                          size={20}
                          color={theme.textTertiary}
                        />
                      </Pressable>

                      {/* Expanded details + actions */}
                      {isExpanded && (
                        <View style={styles.expandedSection}>
                          <View style={styles.detailGrid}>
                            {emp.phone ? (
                              <View style={styles.detailItem}>
                                <MaterialIcons name="phone" size={14} color={theme.textTertiary} />
                                <Text style={styles.detailText}>{emp.phone}</Text>
                              </View>
                            ) : null}
                            {emp.email ? (
                              <View style={styles.detailItem}>
                                <MaterialIcons name="email" size={14} color={theme.textTertiary} />
                                <Text style={styles.detailText}>{emp.email}</Text>
                              </View>
                            ) : null}
                            <View style={styles.detailItem}>
                              <MaterialIcons name="event" size={14} color={theme.textTertiary} />
                              <Text style={styles.detailText}>Ishga kirgan: {emp.hireDate}</Text>
                            </View>
                          </View>
                          <View style={styles.actionRow}>
                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && { opacity: 0.8 }]}
                              onPress={() => handleEdit(emp.id)}
                            >
                              <MaterialIcons name="edit" size={16} color={theme.primary} />
                              <Text style={[styles.actionBtnText, { color: theme.primary }]}>Tahrirlash</Text>
                            </Pressable>
                            <Pressable
                              style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && { opacity: 0.8 }]}
                              onPress={() => handleDelete(emp.id, emp.name)}
                            >
                              <MaterialIcons name="delete-outline" size={16} color={theme.error} />
                              <Text style={[styles.actionBtnText, { color: theme.error }]}>O'chirish</Text>
                            </Pressable>
                          </View>
                        </View>
                      )}

                      {i < deptEmployees.length - 1 && <View style={styles.divider} />}
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          );
        })}

        {employees.length === 0 && (
          <View style={styles.emptyWrap}>
            <MaterialIcons name="people" size={48} color={theme.textTertiary} />
            <Text style={styles.emptyText}>Hozircha xodim yo'q</Text>
            <Pressable
              style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.push('/employee-form')}
            >
              <MaterialIcons name="person-add" size={18} color="#FFF" />
              <Text style={styles.emptyBtnText}>Birinchi xodimni qo'shing</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 8 },
  summaryCard: {
    flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4,
  },
  summaryValue: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  summaryLabel: { fontSize: 11, color: theme.textSecondary },
  deptSection: { marginTop: 20 },
  deptHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  deptDot: { width: 10, height: 10, borderRadius: 5 },
  deptName: { fontSize: 15, fontWeight: '700', color: theme.textPrimary, flex: 1 },
  deptCount: { fontSize: 12, color: theme.textTertiary },
  deptCard: {
    backgroundColor: theme.surface, borderRadius: 14,
    paddingHorizontal: 14, ...theme.shadow,
  },
  empRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '700' },
  empInfo: { flex: 1 },
  empName: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  empPos: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  empRight: { alignItems: 'flex-end', gap: 4 },
  empSalary: { fontSize: 14, fontWeight: '700', color: theme.textPrimary },
  empBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  empBadgeText: { fontSize: 10, fontWeight: '700' },
  expandedSection: {
    paddingBottom: 14, paddingTop: 4,
    borderTopWidth: 1, borderTopColor: theme.borderLight,
    marginLeft: 54,
  },
  detailGrid: { gap: 8, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 13, color: theme.textSecondary },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5,
  },
  editBtn: { borderColor: theme.primary, backgroundColor: theme.primaryGhost },
  deleteBtn: { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.borderLight, marginLeft: 54 },
  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: theme.textSecondary },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.primary, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 12, marginTop: 8,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
});
