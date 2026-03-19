import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Transaction, formatMoney } from '../../services/database';

interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionRow({ transaction: tx, onPress }: Props) {
  const isIncome = tx.type === 'income';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.backgroundSecondary }]}
      onPress={onPress}
    >
      <View style={[styles.icon, { backgroundColor: tx.categoryColor + '18' }]}>
        <MaterialIcons name={tx.categoryIcon as any} size={20} color={tx.categoryColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>{tx.description}</Text>
        <Text style={styles.category}>{tx.categoryName}</Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={[styles.amount, { color: isIncome ? theme.success : theme.error }]}>
          {isIncome ? '+' : '-'}{formatMoney(tx.amount, tx.currency)}
        </Text>
        {tx.currency !== 'UZS' && (
          <Text style={styles.subAmount}>{formatMoney(tx.amountUZS)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderRadius: 8,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  description: { fontSize: 15, fontWeight: '500', color: theme.textPrimary },
  category: { fontSize: 12, color: theme.textTertiary, marginTop: 2 },
  amountWrap: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '700' },
  subAmount: { fontSize: 11, color: theme.textTertiary, marginTop: 1 },
});
