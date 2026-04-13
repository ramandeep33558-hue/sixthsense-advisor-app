import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';

export default function CallSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  
  const callerName = params.callerName as string || 'Client';
  const callType = params.callType as string || 'video';
  const duration = parseInt(params.duration as string || '0');
  const earnings = parseFloat(params.earnings as string || '0');
  const isNewClient = params.isNewClient === 'true';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.xl }]}
      >
        {/* Success Icon */}
        <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Session Complete!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Great reading with {callerName}
        </Text>

        {/* Earnings Card */}
        <LinearGradient
          colors={[colors.success, '#1D8348']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsCard}
        >
          <Text style={styles.earningsLabel}>You Earned</Text>
          <Text style={styles.earningsAmount}>${earnings.toFixed(2)}</Text>
          <Text style={styles.earningsNote}>Added to your available balance</Text>
        </LinearGradient>

        {/* Session Details */}
        <View style={[styles.detailsCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>Session Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="person" size={20} color={colors.textMuted} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Client</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{callerName}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name={callType === 'video' ? 'videocam' : 'call'} size={20} color={colors.textMuted} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                {callType === 'video' ? 'Video' : 'Voice'} Call
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={20} color={colors.textMuted} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Duration</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="star" size={20} color={colors.textMuted} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Client Type</Text>
              <Text style={[styles.detailValue, { color: isNewClient ? '#FFD700' : colors.textPrimary }]}>
                {isNewClient ? 'New Client' : 'Returning'}
              </Text>
            </View>
          </View>
        </View>

        {/* New Client Note */}
        {isNewClient && (
          <View style={[styles.newClientNote, { backgroundColor: '#FFD700' + '15', borderColor: '#FFD700' + '30' }]}>
            <Ionicons name="information-circle" size={20} color="#FFD700" />
            <Text style={[styles.newClientNoteText, { color: colors.textSecondary }]}>
              This was a new client. The first 4 minutes were free as per platform policy.
              Great job making a good first impression!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Done Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace({
            pathname: '/session-review',
            params: {
              clientId: params.callId,
              clientName: callerName,
              sessionId: params.callId,
              sessionType: callType,
              duration: duration.toString(),
              earnings: earnings.toString(),
            }
          })}
        >
          <Text style={styles.doneButtonText}>Rate Session & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: SPACING.xl,
  },
  earningsCard: {
    width: '100%',
    borderRadius: 20,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  earningsNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  detailsCard: {
    width: '100%',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  newClientNote: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    alignItems: 'flex-start',
  },
  newClientNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: SPACING.md,
  },
  doneButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
