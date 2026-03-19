import { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import * as Haptics from 'expo-haptics';

const QUICK_PROMPTS = [
  { icon: 'assessment', label: 'Hisobot', prompt: 'Bugungi moliyaviy hisobotni tayyorla — daromad, xarajat, sof foyda va kategoriyalar bo\'yicha taqsimot bilan' },
  { icon: 'account-balance', label: 'Soliq', prompt: 'Soliq hisobotini tayyorla — QQS, daromad solig\'i va to\'lov muddatlari bilan' },
  { icon: 'people', label: 'Ish haqi', prompt: 'Xodimlar ish haqi hisobotini tayyorla — har bir xodim bo\'yicha ma\'lumot bilan' },
  { icon: 'inventory-2', label: 'Inventar', prompt: 'Inventar holati bo\'yicha to\'liq tahlil — kam qolgan va buyurtma kerak bo\'lgan tovarlar bilan' },
  { icon: 'trending-up', label: 'Bashorat', prompt: 'Keyingi oy uchun moliyaviy bashorat tayyorla — daromad va xarajat tendentsiyasi asosida' },
  { icon: 'lightbulb', label: 'Tavsiya', prompt: 'Biznes xarajatlarni kamaytirish va daromadni oshirish bo\'yicha aniq tavsiyalar ber' },
];

export default function AIAgentScreen() {
  const insets = useSafeAreaInsets();
  const { chatMessages, addChatMessage, generateAIResponse, aiStreaming } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [chatMessages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || aiStreaming) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addChatMessage({ role: 'user', content: msg });
    setInput('');
    setTimeout(() => generateAIResponse(msg), 50);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.agentInfo}>
          <View style={styles.avatarWrap}>
            <Image source={require('../../assets/images/ai-avatar.png')} style={styles.avatar} contentFit="cover" />
            <View style={[styles.onlineDot, aiStreaming && { backgroundColor: '#F59E0B' }]} />
          </View>
          <View>
            <Text style={styles.agentName}>SmartBuxgalter AI</Text>
            <Text style={[styles.agentStatus, aiStreaming && { color: '#F59E0B' }]}>
              {aiStreaming ? 'Yozmoqda...' : 'Online'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {aiStreaming && <ActivityIndicator size="small" color={theme.primary} />}
          <View style={styles.headerBadge}>
            <MaterialIcons name="auto-awesome" size={14} color={theme.primary} />
            <Text style={styles.headerBadgeText}>AI</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick prompts (shown when few messages) */}
          {chatMessages.length <= 2 && (
            <View style={styles.quickSection}>
              <Text style={styles.quickTitle}>Tez buyruqlar</Text>
              <View style={styles.quickGrid}>
                {QUICK_PROMPTS.map((qp, i) => (
                  <Pressable
                    key={i}
                    style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }]}
                    onPress={() => sendMessage(qp.prompt)}
                  >
                    <View style={styles.quickIcon}>
                      <MaterialIcons name={qp.icon as any} size={22} color={theme.primary} />
                    </View>
                    <Text style={styles.quickLabel}>{qp.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Messages */}
          {chatMessages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.aiAvatarSmall}>
                  <MaterialIcons name="auto-awesome" size={14} color={theme.primary} />
                </View>
              )}
              <View style={[styles.bubbleContent, msg.role === 'user' ? styles.userContent : styles.aiContent]}>
                {msg.role === 'assistant' && msg.content === '' ? (
                  <View style={styles.typingWrap}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, { opacity: 0.6 }]} />
                    <View style={[styles.typingDot, { opacity: 0.3 }]} />
                  </View>
                ) : (
                  <Text style={[styles.bubbleText, msg.role === 'user' && { color: '#FFF' }]}>
                    {msg.content}
                  </Text>
                )}
                {msg.content.length > 0 && (
                  <Text style={[styles.bubbleTime, msg.role === 'user' && { color: 'rgba(255,255,255,0.6)' }]}>
                    {new Date(msg.timestamp).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={aiStreaming ? 'AI javob yozmoqda...' : 'AI agentga yozing...'}
              placeholderTextColor={theme.textTertiary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={1000}
              editable={!aiStreaming}
              onSubmitEditing={() => sendMessage()}
            />
            <Pressable
              style={[styles.sendBtn, (!input.trim() || aiStreaming) && { opacity: 0.4 }]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || aiStreaming}
            >
              <MaterialIcons name="send" size={20} color="#FFF" />
            </Pressable>
          </View>
          <Text style={styles.poweredBy}>OnSpace AI · Gemini 3 Flash</Text>
        </View>
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
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  agentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.success,
    borderWidth: 2,
    borderColor: theme.surface,
  },
  agentName: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  agentStatus: { fontSize: 12, color: theme.success },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.primaryGhost,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerBadgeText: { fontSize: 12, fontWeight: '600', color: theme.primary },
  quickSection: { marginBottom: 12, marginTop: 4 },
  quickTitle: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 10, marginLeft: 4 },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '31%',
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMedium,
    padding: 14,
    alignItems: 'center',
    ...theme.shadow,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: { fontSize: 12, fontWeight: '600', color: theme.textPrimary },
  bubble: { marginBottom: 12, flexDirection: 'row', gap: 8 },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubbleContent: { maxWidth: '78%', borderRadius: 16, padding: 14 },
  userContent: {
    backgroundColor: theme.primary,
    borderBottomRightRadius: 4,
  },
  aiContent: {
    backgroundColor: theme.surface,
    borderBottomLeftRadius: 4,
    ...theme.shadow,
  },
  bubbleText: { fontSize: 14, lineHeight: 22, color: theme.textPrimary },
  bubbleTime: { fontSize: 10, color: theme.textTertiary, marginTop: 6, textAlign: 'right' },
  typingWrap: { flexDirection: 'row', gap: 6, paddingVertical: 4, paddingHorizontal: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary },
  inputWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredBy: {
    fontSize: 10,
    color: theme.textTertiary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
});
