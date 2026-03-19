import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider, AuthProvider } from '@/template';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <AppProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="add-transaction" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="transaction-detail" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="report-detail" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="inventory" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="employees" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="employee-form" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="invoices" options={{ animation: 'slide_from_right' }} />
            </Stack>
          </AppProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </AlertProvider>
  );
}
