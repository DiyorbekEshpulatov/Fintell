import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface Props {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function MetricCard({ icon, iconColor, iconBg, label, value, subtitle, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && onPress && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMedium,
    padding: 14,
    ...theme.shadow,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.textTertiary,
    marginTop: 2,
  },
});
