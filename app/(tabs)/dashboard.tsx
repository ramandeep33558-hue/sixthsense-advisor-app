import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { psychic, updateProfile } = useAuth();
  const { colors } = useTheme();
  
  // Service availability toggles
  const [chatOnline, setChatOnline] = useState(true);
  const [phoneOnline, setPhoneOnline] = useState(true);
  const [videoOnline, setVideoOnline] = useState(false);
  const [standardReadings, setStandardReadings] = useState(true);
  const [emergencyReadings, setEmergencyReadings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSale, setActiveSale] = useState<any>(null);

  // Mock data for demo
  const stats = {
    todayEarnings: 145.50,
    weeklyEarnings: 892.30,
    pendingQuestions: 3,
    completedToday: 7,
    averageRating: psychic?.average_rating || 4.9,
    totalReviews: psychic?.total_reviews || 156,
  };

  // Check if any service is online
  const isAnyServiceOnline = chatOnline || phoneOnline || videoOnline;

  const fetchActiveSale = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sales/active`);
      if (response.ok) {
        const data = await response.json();
        setActiveSale(data);
      }
    } catch (error) {
      console.error('Error fetching active sale:', error);
    }
  }, []);

  useEffect(() => {
    fetchActiveSale();
  }, [fetchActiveSale]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveSale();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header - Outside ScrollView */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: colors.background }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{psychic?.name || 'Advisor'}</Text>
        </View>
        
        {/* Overall Status Indicator */}
        <View style={[styles.statusIndicator, { backgroundColor: colors.backgroundCard }]}>
          <View style={[styles.statusDot, { backgroundColor: isAnyServiceOnline ? colors.success : colors.textMuted }]} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>{isAnyServiceOnline ? 'Available' : 'Offline'}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        {/* Active Sale Banner - Mandatory Participation */}
        {activeSale && (
          <View style={[styles.saleBanner, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
            <View style={styles.saleBannerContent}>
              <View style={[styles.saleLiveTag, { backgroundColor: colors.warning }]}>
                <Ionicons name="pricetag" size={12} color="#000" />
                <Text style={styles.saleLiveText}>SALE ACTIVE</Text>
              </View>
              <Text style={[styles.saleBannerTitle, { color: colors.textPrimary }]}>{activeSale.name}</Text>
              <Text style={[styles.saleBannerDesc, { color: colors.textSecondary }]}>
                Your rates are automatically discounted {activeSale.discount_percentage}% during this sale.
              </Text>
              <Text style={[styles.saleBannerMandatory, { color: colors.warning }]}>
                Mandatory participation • Your earnings: 40% of discounted rate
              </Text>
            </View>
          </View>
        )}

        {/* Live Status Controls */}
        <View style={[styles.liveControlsCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.liveTitle, { color: colors.textPrimary }]}>Go Live - Service Availability</Text>
          <Text style={[styles.liveSubtitle, { color: colors.textSecondary }]}>Toggle services to start receiving readings</Text>
          
          <View style={[styles.serviceToggle, { borderBottomColor: colors.border }]}>
            <View style={styles.serviceInfo}>
              <Ionicons name="chatbubble" size={22} color={chatOnline ? colors.success : colors.textMuted} />
              <View>
                <Text style={[styles.serviceName, { color: colors.textPrimary }]}>Chat</Text>
                <Text style={[styles.serviceRate, { color: colors.textMuted }]}>${psychic?.chat_rate || '3.99'}/min</Text>
              </View>
            </View>
            <Switch
              value={chatOnline}
              onValueChange={setChatOnline}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFF"
            />
          </View>

          <View style={[styles.serviceToggle, { borderBottomColor: colors.border }]}>
            <View style={styles.serviceInfo}>
              <Ionicons name="call" size={22} color={phoneOnline ? colors.success : colors.textMuted} />
              <View>
                <Text style={[styles.serviceName, { color: colors.textPrimary }]}>Phone</Text>
                <Text style={[styles.serviceRate, { color: colors.textMuted }]}>${psychic?.phone_rate || '4.99'}/min</Text>
              </View>
            </View>
            <Switch
              value={phoneOnline}
              onValueChange={setPhoneOnline}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFF"
            />
          </View>

          <View style={[styles.serviceToggle, { borderBottomWidth: 0 }]}>
            <View style={styles.serviceInfo}>
              <Ionicons name="videocam" size={22} color={videoOnline ? colors.success : colors.textMuted} />
              <View>
                <Text style={[styles.serviceName, { color: colors.textPrimary }]}>Video</Text>
                <Text style={[styles.serviceRate, { color: colors.textMuted }]}>${psychic?.video_rate || '5.99'}/min</Text>
              </View>
            </View>
            <Switch
              value={videoOnline}
              onValueChange={setVideoOnline}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Recorded Readings Card */}
        <View style={[styles.liveControlsCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.liveTitle, { color: colors.textPrimary }]}>Recorded Readings</Text>
          <Text style={[styles.liveSubtitle, { color: colors.textSecondary }]}>Accept pre-recorded video questions</Text>
          
          <View style={[styles.serviceToggle, { borderBottomColor: colors.border }]}>
            <View style={styles.serviceInfo}>
              <Ionicons name="play-circle" size={22} color={standardReadings ? colors.success : colors.textMuted} />
              <View>
                <Text style={[styles.serviceName, { color: colors.textPrimary }]}>Standard</Text>
                <Text style={[styles.serviceRate, { color: colors.textMuted }]}>$12.00 per reading</Text>
              </View>
            </View>
            <Switch
              value={standardReadings}
              onValueChange={setStandardReadings}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFF"
            />
          </View>

          <View style={[styles.serviceToggle, { borderBottomWidth: 0 }]}>
            <View style={styles.serviceInfo}>
              <Ionicons name="flash" size={22} color={emergencyReadings ? colors.warning : colors.textMuted} />
              <View>
                <Text style={[styles.serviceName, { color: colors.textPrimary }]}>Emergency</Text>
                <Text style={[styles.serviceRate, { color: colors.textMuted }]}>$20.00 per reading</Text>
              </View>
            </View>
            <Switch
              value={emergencyReadings}
              onValueChange={setEmergencyReadings}
              trackColor={{ false: colors.border, true: colors.warning }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* New User Info Card */}
        <View style={[styles.liveControlsCard, { backgroundColor: colors.backgroundCard, borderWidth: 2, borderColor: colors.primary }]}>
          <View style={styles.freeReadingsHeader}>
            <View style={{ flex: 1, marginRight: SPACING.sm }}>
              <Text style={[styles.liveTitle, { color: colors.textPrimary }]}>New Client Policy</Text>
              <Text style={[styles.liveSubtitle, { color: colors.textSecondary }]}>All new clients receive 4 minutes free on their first reading</Text>
            </View>
            <View style={[styles.mandatoryBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.mandatoryText, { color: colors.primary }]}>MANDATORY</Text>
            </View>
          </View>
          
          <View style={[styles.freeReadingsBenefits, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <View style={styles.benefitRow}>
              <Ionicons name="people" size={18} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                <Text style={{ fontWeight: '700', color: colors.primary }}>New clients only:</Text> You'll be notified when it's a new client
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="heart" size={18} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                <Text style={{ fontWeight: '700', color: colors.primary }}>Give your best:</Text> First impressions lead to loyal clients
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="cash" size={18} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                <Text style={{ fontWeight: '700', color: colors.primary }}>Normal rates after:</Text> Session charges normally after 4 free minutes
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Earnings Chart */}
        <View style={[styles.earningsChartCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.earningsChartHeader}>
            <Text style={[styles.liveTitle, { color: colors.textPrimary }]}>Weekly Earnings</Text>
            <Text style={[styles.earningsTotal, { color: colors.primary }]}>${stats.weeklyEarnings.toFixed(2)}</Text>
          </View>
          <Text style={[styles.liveSubtitle, { color: colors.textSecondary, marginBottom: SPACING.md }]}>Last 7 days performance</Text>
          
          <View style={styles.chartContainer}>
            {(() => {
              const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const earnings = [45.50, 28.00, 89.50, 120.30, 95.00, 145.50, 78.00];
              const maxEarning = Math.max(...earnings);
              const avgEarning = earnings.reduce((a, b) => a + b, 0) / earnings.length;
              
              return earnings.map((earning, index) => {
                const barHeight = (earning / maxEarning) * 100;
                const isHigh = earning >= avgEarning * 1.2;
                const isLow = earning < avgEarning * 0.7;
                const barColor = isHigh ? colors.success : isLow ? colors.error : colors.primary;
                
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <Text style={[styles.chartValue, { color: barColor }]}>${earning.toFixed(0)}</Text>
                    <View style={styles.chartBarWrapper}>
                      <View 
                        style={[
                          styles.chartBar, 
                          { 
                            height: `${Math.max(barHeight, 10)}%`,
                            backgroundColor: barColor,
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.chartDay, { color: colors.textMuted }]}>{weekDays[index]}</Text>
                  </View>
                );
              });
            })()}
          </View>
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>High earnings</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Low earnings</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.gold + '20' }]}>
              <Ionicons name="star" size={24} color={colors.gold} />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.averageRating}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="chatbubbles" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.totalReviews}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
  },
  liveControlsCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  liveSubtitle: {
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  serviceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '500',
  },
  serviceRate: {
    fontSize: 12,
  },
  earningsCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  earningsAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFF',
    marginVertical: SPACING.sm,
  },
  earningsFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: SPACING.sm,
  },
  weeklyEarnings: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  saleBanner: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 14,
    borderWidth: 2,
    padding: SPACING.md,
  },
  saleBannerContent: {},
  saleLiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginBottom: 8,
  },
  saleLiveText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },
  saleBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  saleBannerDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  saleBannerMandatory: {
    fontSize: 11,
    fontWeight: '600',
  },
  freeReadingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  freeReadingsBenefits: {
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: SPACING.sm,
  },
  freeReadingsActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.sm,
  },
  freeReadingsActiveText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  freeReadingsNote: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  mandatoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mandatoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  earningsChartCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 16,
    padding: SPACING.md,
  },
  earningsChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsTotal: {
    fontSize: 20,
    fontWeight: '700',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: SPACING.md,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartValue: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  chartBarWrapper: {
    width: 24,
    height: 100,
    justifyContent: 'flex-end',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
  },
  chartDay: {
    fontSize: 10,
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
});
