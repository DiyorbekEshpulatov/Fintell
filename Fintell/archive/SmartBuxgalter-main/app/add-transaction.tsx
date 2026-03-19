import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAlert } from '@/template';
import { theme } from '../constants/theme';
import { config } from '../constants/config';
import { useApp } from '../contexts/AppContext';
import { Currency, TransactionType } from '../services/database';

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addTransaction } = useApp();
  const { showAlert } = useAlert();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('UZS');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = type === 'income'
    ? config.transactionCategories.income
    : config.transactionCategories.expense;

  const handleSave = async () => {
    if (!amount || !categoryId || !description) {
      showAlert('Xatolik', "Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    const numAmount = parseFloat(amount.replace(/\s/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      showAlert('Xatolik', "Summani to'g'ri kiriting");
      return;
    }

    const rate = config.currencies.find(c => c.code === currency)?.rate || 1;
    const amountUZS = currency === 'UZS' ? numAmount : numAmount * rate;
    const cat = categories.find(c => c.id === categoryId)!;

    setSaving(true);
    try {
      await addTransaction({
        type,
        categoryId,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        amount: numAmount,
        currency,
        amountUZS,
        description,
        date: new Date().toISOString().split('T')[0],
        counterparty: counterparty || undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
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
          <Text style={styles.headerTitle}>Yangi operatsiya</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.typeRow}>
            <Pressable style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpense]} onPress={() => { setType('expense'); setCategoryId(''); }}>
              <MaterialIcons name="arrow-upward" size={18} color={type === 'expense' ? '#FFF' : theme.error} />
              <Text style={[styles.typeText, type === 'expense' && { color: '#FFF' }]}>Chiqim</Text>
            </Pressable>
            <Pressable style={[styles.typeBtn, type === 'income' && styles.typeBtnIncome]} onPress={() => { setType('income'); setCategoryId(''); }}>
              <MaterialIcons name="arrow-downward" size={18} color={type === 'income' ? '#FFF' : theme.success} />
              <Text style={[styles.typeText, type === 'income' && { color: '#FFF' }]}>Kirim</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Summa</Text>
          <View style={styles.amountRow}>
            <TextInput style={styles.amountInput} placeholder="0" placeholderTextColor={theme.textTertiary} keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <View style={styles.currencyRow}>
              {(['UZS', 'USD', 'EUR'] as Currency[]).map(c => (
                <Pressable key={c} style={[styles.currencyChip, currency === c && styles.currencyActive]} onPress={() => setCurrency(c)}>
                  <Text style={[styles.currencyText, currency === c && { color: '#FFF' }]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Text style={styles.label}>Kategoriya</Text>
          <View style={styles.catGrid}>
            {categories.map(cat => (
              <Pressable key={cat.id} style={[styles.catItem, categoryId === cat.id && { borderColor: cat.color, borderWidth: 2 }]} onPress={() => setCategoryId(cat.id)}>
                <View style={[styles.catIcon, { backgroundColor: cat.color + '18' }]}>
                  <MaterialIcons name={cat.icon as any} size={20} color={cat.color} />
                </View>
                <Text style={styles.catName} numberOfLines={1}>{cat.name}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Tavsif</Text>
          <TextInput style={styles.textInput} placeholder="Operatsiya tavsifi..." placeholderTextColor={theme.textTertiary} value={description} onChangeText={setDescription} />

          <Text style={styles.label}>Kontragent (ixtiyoriy)</Text>
          <TextInput style={styles.textInput} placeholder="Kompaniya nomi..." placeholderTextColor={theme.textTertiary} value={counterparty} onChangeText={setCounterparty} />

          <Pressable
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: type === 'income' ? theme.success : theme.primary }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <MaterialIcons name="check" size={22} color="#FFF" />
            <Text style={styles.saveBtnText}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  typeRow: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 24 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 12, backgroundColor: theme.backgroundSecondary },
  typeBtnExpense: { backgroundColor: theme.error },
  typeBtnIncome: { backgroundColor: theme.success },
  typeText: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  label: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
  amountRow: { gap: 12 },
  amountInput: { backgroundColor: theme.surface, borderRadius: 12, padding: 16, fontSize: 32, fontWeight: '700', color: theme.textPrimary, ...theme.shadow },
  currencyRow: { flexDirection: 'row', gap: 8 },
  currencyChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.backgroundSecondary },
  currencyActive: { backgroundColor: theme.primary },
  currencyText: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: { width: '30%', backgroundColor: theme.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'transparent', ...theme.shadow },
  catIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  catName: { fontSize: 11, fontWeight: '600', color: theme.textPrimary, textAlign: 'center' },
  textInput: { backgroundColor: theme.surface, borderRadius: 12, padding: 16, fontSize: 15, color: theme.textPrimary, ...theme.shadow },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 56, borderRadius: 16, marginTop: 32 },
  saveBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
