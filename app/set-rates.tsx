import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';
import { useAuth } from '../src/context/AuthContext';

const MIN_RATE = 1.99;
const MAX_RATE = 9.99;

export default function SetRatesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { psychic, updateProfile } = useAuth();
  const { colors } = useTheme();

  const [chatRate, setChatRate] = useState(psychic?.chat_rate?.toString() || '3.99');
  const [phoneRate, setPhoneRate] = useState(psychic?.phone_rate?.toString() || '4.99');
  const [videoRate, setVideoRate] = useState(psychic?.video_rate?.toString() || '5.99');
  const [errors, setErrors] = useState<{ chat?: string; phone?: string; video?: string }>({});

  const validateRate = (value: string, field: 'chat' | 'phone' | 'video') => {
    const rate = parseFloat(value);
    if (isNaN(rate)) {
      setErrors(prev => ({ ...prev, [field]: 'Invalid' }));
      return false;
    }
    if (rate < MIN_RATE) {
      setErrors(prev => ({ ...prev, [field]: `Min $${MIN_RATE}` }));
      return false;
    }
    if (rate > MAX_RATE) {
      setErrors(prev => ({ ...prev, [field]: `Max $${MAX_RATE}` }));
      return false;
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
    return true;
  };

  const handleRateChange = (value: string, setter: (val: string) => void, field: 'chat' | 'phone' | 'video') => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    
    setter(formatted);
    
    if (formatted) {
      validateRate(formatted, field);
    }
  };

  const handleSave = () => {
    const chatValid = validateRate(chatRate, 'chat');
    const phoneValid = validateRate(phoneRate, 'phone');
    const videoValid = validateRate(videoRate, 'video');

    if (!chatValid || !phoneValid || !videoValid) {
      Alert.alert('Invalid Rates', `All rates must be between $${MIN_RATE} and $${MAX_RATE} per minute.`);
      return;
    }

    updateProfile({
      chat_rate: parseFloat(chatRate),
      phone_rate: parseFloat(phoneRate),
      video_rate: parseFloat(videoRate),
    });

    Alert.alert('Success', 'Your rates have been updated!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  // Calculate earnings
  const calculateEarnings = (rate: string, minutes: number) => {
    const r = parseFloat(rate) || 0;
    return (r * minutes * 0.4).toFixed(2); // 40% goes to psychic
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.backgroundElevated }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Set Your Rates</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.info + '15' }]}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Set your per-minute rates. Range: ${MIN_RATE} - ${MAX_RATE}
          </Text>
        </View>

        {/* Rates Table */}
        <View style={[styles.ratesTable, { backgroundColor: colors.backgroundCard }]}>
          {/* Table Header */}
          <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.columnService}>
              <Text style={[styles.headerText, { color: colors.textMuted }]}>SERVICE</Text>
            </View>
            <View style={styles.columnRate}>
              <Text style={[styles.headerText, { color: colors.textMuted }]}>RATE/MIN</Text>
            </View>
            <View style={styles.columnEarnings}>
              <Text style={[styles.headerText, { color: colors.textMuted }]}>YOU EARN</Text>
            </View>
          </View>

          {/* Chat Row */}
          <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
            <View style={styles.columnService}>
              <View style={[styles.serviceIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="chatbubble" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.serviceText, { color: colors.textPrimary }]}>Chat</Text>
                <Text style={[styles.serviceSubtext, { color: colors.textMuted }]}>Text messaging</Text>
              </View>
            </View>
            <View style={styles.columnRate}>
              <View style={[
                styles.rateInputWrapper, 
                { backgroundColor: colors.backgroundElevated, borderColor: errors.chat ? colors.error : colors.border }
              ]}>
                <Text style={[styles.dollarSign, { color: colors.textSecondary }]}>$</Text>
                <TextInput
                  style={[styles.rateInput, { color: colors.textPrimary }]}
                  value={chatRate}
                  onChangeText={(val) => handleRateChange(val, setChatRate, 'chat')}
                  keyboardType="decimal-pad"
                  maxLength={5}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              {errors.chat && <Text style={[styles.errorText, { color: colors.error }]}>{errors.chat}</Text>}
            </View>
            <View style={styles.columnEarnings}>
              <Text style={[styles.earningsText, { color: colors.success }]}>${calculateEarnings(chatRate, 1)}</Text>
              <Text style={[styles.earningsSubtext, { color: colors.textMuted }]}>per min</Text>
            </View>
          </View>

          {/* Phone Row */}
          <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
            <View style={styles.columnService}>
              <View style={[styles.serviceIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="call" size={18} color={colors.secondary} />
              </View>
              <View>
                <Text style={[styles.serviceText, { color: colors.textPrimary }]}>Phone</Text>
                <Text style={[styles.serviceSubtext, { color: colors.textMuted }]}>Voice calls</Text>
              </View>
            </View>
            <View style={styles.columnRate}>
              <View style={[
                styles.rateInputWrapper, 
                { backgroundColor: colors.backgroundElevated, borderColor: errors.phone ? colors.error : colors.border }
              ]}>
                <Text style={[styles.dollarSign, { color: colors.textSecondary }]}>$</Text>
                <TextInput
                  style={[styles.rateInput, { color: colors.textPrimary }]}
                  value={phoneRate}
                  onChangeText={(val) => handleRateChange(val, setPhoneRate, 'phone')}
                  keyboardType="decimal-pad"
                  maxLength={5}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              {errors.phone && <Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text>}
            </View>
            <View style={styles.columnEarnings}>
              <Text style={[styles.earningsText, { color: colors.success }]}>${calculateEarnings(phoneRate, 1)}</Text>
              <Text style={[styles.earningsSubtext, { color: colors.textMuted }]}>per min</Text>
            </View>
          </View>

          {/* Video Row */}
          <View style={styles.tableRow}>
            <View style={styles.columnService}>
              <View style={[styles.serviceIcon, { backgroundColor: colors.gold + '20' }]}>
                <Ionicons name="videocam" size={18} color={colors.gold} />
              </View>
              <View>
                <Text style={[styles.serviceText, { color: colors.textPrimary }]}>Video</Text>
                <Text style={[styles.serviceSubtext, { color: colors.textMuted }]}>Face-to-face</Text>
              </View>
            </View>
            <View style={styles.columnRate}>
              <View style={[
                styles.rateInputWrapper, 
                { backgroundColor: colors.backgroundElevated, borderColor: errors.video ? colors.error : colors.border }
              ]}>
                <Text style={[styles.dollarSign, { color: colors.textSecondary }]}>$</Text>
                <TextInput
                  style={[styles.rateInput, { color: colors.textPrimary }]}
                  value={videoRate}
                  onChangeText={(val) => handleRateChange(val, setVideoRate, 'video')}
                  keyboardType="decimal-pad"
                  maxLength={5}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              {errors.video && <Text style={[styles.errorText, { color: colors.error }]}>{errors.video}</Text>}
            </View>
            <View style={styles.columnEarnings}>
              <Text style={[styles.earningsText, { color: colors.success }]}>${calculateEarnings(videoRate, 1)}</Text>
              <Text style={[styles.earningsSubtext, { color: colors.textMuted }]}>per min</Text>
            </View>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={[styles.earningsCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.earningsTitle, { color: colors.textPrimary }]}>Earnings Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Client Pays</Text>
            <Text style={[styles.breakdownValue, { color: colors.textPrimary }]}>100%</Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Platform Fee</Text>
            <Text style={[styles.breakdownValue, { color: colors.error }]}>-60%</Text>
          </View>
          
          <View style={[styles.breakdownRow, styles.breakdownTotal, { borderTopColor: colors.border }]}>
            <Text style={[styles.breakdownLabel, { color: colors.textPrimary, fontWeight: '700' }]}>Your Base Earnings</Text>
            <Text style={[styles.breakdownValue, { color: colors.success, fontWeight: '700' }]}>40%</Text>
          </View>
        </View>

        {/* Connection Fees */}
        <View style={[styles.earningsCard, { backgroundColor: colors.warning + '10', borderWidth: 1, borderColor: colors.warning + '30' }]}>
          <View style={styles.connectionHeader}>
            <Ionicons name="wifi" size={18} color={colors.warning} />
            <Text style={[styles.earningsTitle, { color: colors.textPrimary, marginBottom: 0 }]}>Connection Fees</Text>
          </View>
          <Text style={[styles.connectionSubtext, { color: colors.textMuted }]}>Deducted from your earnings per session</Text>
          
          <View style={styles.connectionGrid}>
            <View style={[styles.connectionItem, { backgroundColor: colors.backgroundCard }]}>
              <Ionicons name="chatbubble" size={16} color={colors.primary} />
              <Text style={[styles.connectionLabel, { color: colors.textSecondary }]}>Chat</Text>
              <Text style={[styles.connectionFee, { color: colors.textPrimary }]}>$0.00</Text>
            </View>
            <View style={[styles.connectionItem, { backgroundColor: colors.backgroundCard }]}>
              <Ionicons name="call" size={16} color={colors.secondary} />
              <Text style={[styles.connectionLabel, { color: colors.textSecondary }]}>Phone</Text>
              <Text style={[styles.connectionFee, { color: colors.warning }]}>$0.50</Text>
            </View>
            <View style={[styles.connectionItem, { backgroundColor: colors.backgroundCard }]}>
              <Ionicons name="videocam" size={16} color={colors.gold} />
              <Text style={[styles.connectionLabel, { color: colors.textSecondary }]}>Video</Text>
              <Text style={[styles.connectionFee, { color: colors.warning }]}>$1.00</Text>
            </View>
          </View>
        </View>

        {/* Example Earnings with Connection Fee */}
        <View style={[styles.exampleCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Ionicons name="calculator" size={20} color={colors.primary} />
          <View style={styles.exampleContent}>
            <Text style={[styles.exampleTitle, { color: colors.textPrimary }]}>Example: 30-min Phone Session</Text>
            <View style={styles.exampleBreakdown}>
              <Text style={[styles.exampleLine, { color: colors.textSecondary }]}>
                Client pays: ${(parseFloat(phoneRate) * 30).toFixed(2)}
              </Text>
              <Text style={[styles.exampleLine, { color: colors.textSecondary }]}>
                Your 40%: ${(parseFloat(phoneRate) * 30 * 0.4).toFixed(2)}
              </Text>
              <Text style={[styles.exampleLine, { color: colors.warning }]}>
                Connection fee: -$0.50
              </Text>
              <Text style={[styles.exampleLine, { color: colors.success, fontWeight: '700' }]}>
                Final earnings: ${((parseFloat(phoneRate) * 30 * 0.4) - 0.50).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md, backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]} 
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.saveButtonText}>Save Rates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 120,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
  },
  ratesTable: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
  },
  columnService: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  columnRate: {
    flex: 1,
    alignItems: 'center',
  },
  columnEarnings: {
    flex: 0.8,
    alignItems: 'flex-end',
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  serviceSubtext: {
    fontSize: 11,
  },
  rateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: '600',
  },
  rateInput: {
    width: 50,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    padding: 0,
  },
  errorText: {
    fontSize: 9,
    marginTop: 2,
  },
  earningsText: {
    fontSize: 15,
    fontWeight: '700',
  },
  earningsSubtext: {
    fontSize: 10,
  },
  earningsCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  earningsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  breakdownLabel: {
    fontSize: 13,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownTotal: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  exampleContent: {
    flex: 1,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  exampleText: {
    fontSize: 12,
    marginTop: 2,
  },
  exampleBreakdown: {
    gap: 2,
  },
  exampleLine: {
    fontSize: 12,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  connectionSubtext: {
    fontSize: 11,
    marginBottom: SPACING.md,
  },
  connectionGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  connectionItem: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 10,
    gap: 4,
  },
  connectionLabel: {
    fontSize: 11,
  },
  connectionFee: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  saveButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
