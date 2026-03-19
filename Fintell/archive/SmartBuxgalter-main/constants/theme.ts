// SmartBuxgalter Design System — Trustworthy Blue (Finance Q4: Alert + Serious)
import { Platform } from 'react-native';

export const theme = {
  // Primary
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  primaryGhost: 'rgba(79, 70, 229, 0.08)',
  primarySoft: 'rgba(79, 70, 229, 0.15)',

  // Accent
  accent: '#06B6D4',
  accentLight: '#67E8F9',
  accentDark: '#0891B2',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Surfaces
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  cardBg: '#FFFFFF',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#4F46E5',

  // Currency colors
  currencyUZS: '#4F46E5',
  currencyUSD: '#10B981',
  currencyEUR: '#F59E0B',

  // Chart colors
  chart1: '#4F46E5',
  chart2: '#06B6D4',
  chart3: '#10B981',
  chart4: '#F59E0B',
  chart5: '#EF4444',
  chart6: '#8B5CF6',

  // Shadows
  shadow: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
    android: { elevation: 2 },
    default: {},
  }),
  shadowElevated: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
    android: { elevation: 6 },
    default: {},
  }),
  shadowHero: Platform.select({
    ios: { shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20 },
    android: { elevation: 10 },
    default: {},
  }),

  // Radii
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,
  radiusXL: 20,
  radiusFull: 9999,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Typography
  typography: {
    heroData: { fontSize: 48, fontWeight: '700' as const },
    heroLabel: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 1 },
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 24, fontWeight: '700' as const },
    h3: { fontSize: 18, fontWeight: '600' as const },
    cardTitle: { fontSize: 16, fontWeight: '600' as const },
    cardValue: { fontSize: 24, fontWeight: '700' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    bodyBold: { fontSize: 15, fontWeight: '600' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
    small: { fontSize: 11, fontWeight: '500' as const },
    sectionHeader: { fontSize: 14, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
    tableHeader: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const },
    tableCell: { fontSize: 15, fontWeight: '400' as const },
    button: { fontSize: 16, fontWeight: '600' as const },
    tab: { fontSize: 11, fontWeight: '600' as const },
  },
};

export type Theme = typeof theme;
