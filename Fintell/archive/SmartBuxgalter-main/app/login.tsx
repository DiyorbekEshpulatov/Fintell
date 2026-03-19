import React, { useState } from 'react';
import {
  View, Text, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth, useAlert } from '@/template';
import { theme } from '../constants/theme';

type AuthMode = 'login' | 'register' | 'otp';

export default function LoginScreen() {
  const { sendOTP, verifyOTPAndLogin, signInWithPassword, operationLoading } = useAuth();
  const { showAlert } = useAlert();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Xatolik', "Email va parolni kiriting");
      return;
    }
    const { error } = await signInWithPassword(email.trim(), password);
    if (error) {
      showAlert('Kirish xatosi', error);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Xatolik', "Barcha maydonlarni to'ldiring");
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Xatolik', 'Parollar mos kelmaydi');
      return;
    }
    if (password.length < 6) {
      showAlert('Xatolik', "Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    const { error } = await sendOTP(email.trim());
    if (error) {
      showAlert('Xatolik', error);
      return;
    }
    showAlert('Kod yuborildi', `${email} ga tasdiqlash kodi yuborildi`);
    setMode('otp');
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      showAlert('Xatolik', 'Tasdiqlash kodini kiriting');
      return;
    }
    const { error } = await verifyOTPAndLogin(email.trim(), otp.trim(), { password });
    if (error) {
      showAlert('Xatolik', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <LinearGradient
            colors={[theme.primary, '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.logoWrap}>
              <MaterialIcons name="auto-awesome" size={36} color="#FFF" />
            </View>
            <Text style={styles.heroTitle}>SmartBuxgalter</Text>
            <Text style={styles.heroSub}>AI Agent Buxgalteriya Tizimi</Text>
          </LinearGradient>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {mode === 'login' ? 'Tizimga kirish' : mode === 'register' ? "Ro'yxatdan o'tish" : 'Tasdiqlash kodi'}
            </Text>
            <Text style={styles.cardSub}>
              {mode === 'login'
                ? "Email va parolingizni kiriting"
                : mode === 'register'
                ? "Yangi hisob yarating"
                : `${email} ga yuborilgan kodni kiriting`}
            </Text>

            {mode !== 'otp' && (
              <>
                {/* Email */}
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.inputRow}>
                    <MaterialIcons name="email" size={20} color={theme.textTertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="example@mail.com"
                      placeholderTextColor={theme.textTertiary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Parol</Text>
                  <View style={styles.inputRow}>
                    <MaterialIcons name="lock" size={20} color={theme.textTertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Parolingiz"
                      placeholderTextColor={theme.textTertiary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                      <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={theme.textTertiary} />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password (register only) */}
                {mode === 'register' && (
                  <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>Parolni tasdiqlang</Text>
                    <View style={styles.inputRow}>
                      <MaterialIcons name="lock-outline" size={20} color={theme.textTertiary} />
                      <TextInput
                        style={styles.input}
                        placeholder="Parolni qayta kiriting"
                        placeholderTextColor={theme.textTertiary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                      />
                    </View>
                  </View>
                )}
              </>
            )}

            {/* OTP Input */}
            {mode === 'otp' && (
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Tasdiqlash kodi</Text>
                <View style={styles.inputRow}>
                  <MaterialIcons name="pin" size={20} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { letterSpacing: 8, fontSize: 24, fontWeight: '700' }]}
                    placeholder="0000"
                    placeholderTextColor={theme.textTertiary}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>
              </View>
            )}

            {/* Primary Button */}
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }, operationLoading && { opacity: 0.6 }]}
              onPress={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleVerifyOTP}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <MaterialIcons
                    name={mode === 'login' ? 'login' : mode === 'register' ? 'person-add' : 'verified'}
                    size={20}
                    color="#FFF"
                  />
                  <Text style={styles.primaryBtnText}>
                    {mode === 'login' ? 'Kirish' : mode === 'register' ? "Ro'yxatdan o'tish" : 'Tasdiqlash'}
                  </Text>
                </>
              )}
            </Pressable>

            {/* Switch mode */}
            {mode !== 'otp' && (
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                  {mode === 'login' ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
                </Text>
                <Pressable onPress={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setOtp('');
                }}>
                  <Text style={styles.switchLink}>
                    {mode === 'login' ? "Ro'yxatdan o'ting" : 'Kirish'}
                  </Text>
                </Pressable>
              </View>
            )}

            {mode === 'otp' && (
              <Pressable onPress={() => setMode('register')} style={styles.backLink}>
                <MaterialIcons name="arrow-back" size={16} color={theme.primary} />
                <Text style={styles.switchLink}>Ortga qaytish</Text>
              </Pressable>
            )}
          </View>

          {/* Features */}
          <View style={styles.features}>
            {[
              { icon: 'auto-awesome', label: 'AI Agent hisobotlar' },
              { icon: 'account-balance', label: '1C funksiyalari' },
              { icon: 'table-chart', label: 'Excel jadvallar' },
            ].map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialIcons name={f.icon as any} size={18} color={theme.primary} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  scrollContent: { flexGrow: 1 },
  hero: {
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  card: {
    marginHorizontal: 20,
    marginTop: -20,
    backgroundColor: theme.surface,
    borderRadius: theme.radiusXL,
    padding: 24,
    ...theme.shadowElevated,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: theme.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: 14, color: theme.textSecondary, marginBottom: 24 },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.textPrimary,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
    backgroundColor: theme.primary,
    marginTop: 8,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  switchText: { fontSize: 14, color: theme.textSecondary },
  switchLink: { fontSize: 14, fontWeight: '700', color: theme.primary },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 20,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  featureItem: { alignItems: 'center', gap: 6 },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: { fontSize: 11, fontWeight: '600', color: theme.textSecondary, textAlign: 'center' },
});
