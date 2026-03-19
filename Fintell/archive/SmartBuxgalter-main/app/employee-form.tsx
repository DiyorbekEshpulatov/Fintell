import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAlert } from '@/template';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { Employee } from '../services/database';

const DEPARTMENTS = [
  { id: 'Boshqaruv', color: '#4F46E5', icon: 'business' },
  { id: 'Buxgalteriya', color: '#06B6D4', icon: 'calculate' },
  { id: 'Sotuv', color: '#10B981', icon: 'storefront' },
  { id: 'HR', color: '#EC4899', icon: 'people' },
  { id: 'IT', color: '#8B5CF6', icon: 'computer' },
  { id: 'Logistika', color: '#F59E0B', icon: 'local-shipping' },
  { id: 'Marketing', color: '#A855F7', icon: 'campaign' },
  { id: 'Ishlab chiqarish', color: '#EF4444', icon: 'precision-manufacturing' },
];

const STATUSES: { id: Employee['status']; label: string; color: string; icon: string }[] = [
  { id: 'active', label: 'Faol', color: '#10B981', icon: 'check-circle' },
  { id: 'on_leave', label: "Ta'tilda", color: '#F59E0B', icon: 'schedule' },
  { id: 'inactive', label: 'Nofaol', color: '#EF4444', icon: 'cancel' },
];

export default function EmployeeFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { employees, addEmployee, updateEmployee } = useApp();
  const { showAlert } = useAlert();

  const isEdit = Boolean(params.id);
  const existing = isEdit ? employees.find(e => e.id === params.id) : null;

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Umumiy');
  const [salary, setSalary] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Employee['status']>('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setPosition(existing.position);
      setDepartment(existing.department);
      setSalary(existing.salary.toString());
      setPhone(existing.phone || '');
      setEmail(existing.email || '');
      setStatus(existing.status);
    }
  }, [existing]);

  const handleSave = async () => {
    if (!name.trim() || !position.trim()) {
      showAlert('Xatolik', 'Ism va lavozimni kiriting');
      return;
    }
    const numSalary = parseFloat(salary.replace(/\s/g, ''));
    if (isNaN(numSalary) || numSalary < 0) {
      showAlert('Xatolik', "Maoshni to'g'ri kiriting");
      return;
    }

    setSaving(true);
    try {
      const empData = {
        name: name.trim(),
        position: position.trim(),
        department,
        salary: numSalary,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        hireDate: existing?.hireDate || new Date().toISOString().split('T')[0],
        status,
      };

      let result: { error: string | null };
      if (isEdit && params.id) {
        result = await updateEmployee(params.id, empData);
      } else {
        result = await addEmployee(empData);
      }

      if (result.error) {
        showAlert('Xatolik', result.error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }
    } catch {
      showAlert('Xatolik', 'Saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>{isEdit ? 'Xodimni tahrirlash' : 'Yangi xodim'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Name */}
          <Text style={styles.label}>Ism va familiya *</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="person" size={20} color={theme.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Abdullayev Botir"
              placeholderTextColor={theme.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Position */}
          <Text style={styles.label}>Lavozim *</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="badge" size={20} color={theme.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Bosh direktor"
              placeholderTextColor={theme.textTertiary}
              value={position}
              onChangeText={setPosition}
            />
          </View>

          {/* Department */}
          <Text style={styles.label}>Bo'lim</Text>
          <View style={styles.deptGrid}>
            {DEPARTMENTS.map(d => {
              const isSelected = department === d.id;
              return (
                <Pressable
                  key={d.id}
                  style={[styles.deptChip, isSelected && { backgroundColor: d.color, borderColor: d.color }]}
                  onPress={() => setDepartment(d.id)}
                >
                  <MaterialIcons name={d.icon as any} size={16} color={isSelected ? '#FFF' : d.color} />
                  <Text style={[styles.deptChipText, isSelected && { color: '#FFF' }]}>{d.id}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Salary */}
          <Text style={styles.label}>Oylik maosh (UZS)</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="payments" size={20} color={theme.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="8000000"
              placeholderTextColor={theme.textTertiary}
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
            />
          </View>

          {/* Phone */}
          <Text style={styles.label}>Telefon (ixtiyoriy)</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="phone" size={20} color={theme.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="+998 90 123 45 67"
              placeholderTextColor={theme.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email (ixtiyoriy)</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="email" size={20} color={theme.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="xodim@company.uz"
              placeholderTextColor={theme.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Status */}
          <Text style={styles.label}>Holat</Text>
          <View style={styles.statusRow}>
            {STATUSES.map(s => {
              const isSelected = status === s.id;
              return (
                <Pressable
                  key={s.id}
                  style={[styles.statusChip, isSelected && { backgroundColor: s.color, borderColor: s.color }]}
                  onPress={() => setStatus(s.id)}
                >
                  <MaterialIcons name={s.icon as any} size={16} color={isSelected ? '#FFF' : s.color} />
                  <Text style={[styles.statusChipText, isSelected && { color: '#FFF' }]}>{s.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              saving && { opacity: 0.6 },
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialIcons name={isEdit ? 'save' : 'person-add'} size={22} color="#FFF" />
                <Text style={styles.saveBtnText}>{isEdit ? 'Saqlash' : "Xodim qo'shish"}</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  label: {
    fontSize: 13, fontWeight: '600', color: theme.textSecondary,
    marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: theme.surface, borderRadius: 12,
    paddingHorizontal: 14, height: 52,
    ...theme.shadow,
  },
  input: { flex: 1, fontSize: 16, color: theme.textPrimary },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  deptChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, backgroundColor: theme.surface,
    borderWidth: 1.5, borderColor: theme.border,
  },
  deptChipText: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  statusRow: { flexDirection: 'row', gap: 10 },
  statusChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 12,
    backgroundColor: theme.surface, borderWidth: 1.5, borderColor: theme.border,
  },
  statusChipText: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 56, borderRadius: 16, backgroundColor: theme.primary, marginTop: 32,
  },
  saveBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
