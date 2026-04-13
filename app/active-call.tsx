import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ActiveCallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  
  const callId = params.callId as string;
  const callerName = params.callerName as string || 'Client';
  const callType = params.callType as string || 'video';
  const isNewClient = params.isNewClient === 'true';
  const rate = 3.99; // Psychic's rate
  
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(callType === 'voice');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [freeMinutesRemaining, setFreeMinutesRemaining] = useState(isNewClient ? 4 * 60 : 0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
      
      if (freeMinutesRemaining > 0) {
        setFreeMinutesRemaining(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateEarnings = () => {
    // Psychic gets 40% of billable time
    const billableSeconds = Math.max(0, duration - (isNewClient ? 4 * 60 : 0));
    const totalCharge = (billableSeconds / 60) * rate;
    return totalCharge * 0.4; // 40% to psychic
  };

  const endCall = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await fetch(`${BACKEND_URL}/api/video/call/${callId}/end`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to end call:', error);
    }

    router.replace({
      pathname: '/call-summary',
      params: {
        callId,
        callerName,
        callType,
        duration: duration.toString(),
        earnings: calculateEarnings().toFixed(2),
        isNewClient: isNewClient ? 'true' : 'false',
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Video Area */}
      <LinearGradient
        colors={['#2d2d44', '#1a1a2e']}
        style={styles.videoArea}
      >
        {/* New Client Banner */}
        {isNewClient && freeMinutesRemaining > 0 && (
          <View style={[styles.newClientBanner, { top: insets.top + 10 }]}>
            <Ionicons name="gift" size={16} color="#FFD700" />
            <Text style={styles.newClientText}>
              NEW CLIENT - FREE {formatTime(freeMinutesRemaining)}
            </Text>
          </View>
        )}

        {/* Client Avatar */}
        <View style={styles.clientInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {callerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.clientName}>{callerName}</Text>
          <Text style={styles.timerText}>
            {freeMinutesRemaining > 0 ? (
              <Text style={{ color: '#FFD700' }}>FREE {formatTime(freeMinutesRemaining)}</Text>
            ) : (
              formatTime(duration)
            )}
          </Text>
        </View>

        {/* Local Video Preview */}
        {callType === 'video' && !isCameraOff && (
          <View style={styles.localVideo}>
            <View style={styles.localPlaceholder}>
              <Ionicons name="person" size={24} color="#FFF" />
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Earnings Info */}
      <View style={styles.earningsBar}>
        <View style={styles.earningsItem}>
          <Text style={styles.earningsLabel}>Your Earnings</Text>
          <Text style={styles.earningsValue}>${calculateEarnings().toFixed(2)}</Text>
        </View>
        <View style={styles.earningsDivider} />
        <View style={styles.earningsItem}>
          <Text style={styles.earningsLabel}>Rate</Text>
          <Text style={styles.earningsValue}>${(rate * 0.4).toFixed(2)}/min</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={26}
            color={isMuted ? '#E74C3C' : '#FFF'}
          />
          <Text style={styles.controlLabel}>Mute</Text>
        </TouchableOpacity>

        {callType === 'video' && (
          <TouchableOpacity
            style={[styles.controlButton, isCameraOff && styles.controlActive]}
            onPress={() => setIsCameraOff(!isCameraOff)}
          >
            <Ionicons
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={26}
              color={isCameraOff ? '#E74C3C' : '#FFF'}
            />
            <Text style={styles.controlLabel}>Camera</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={endCall}
        >
          <Ionicons name="call" size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeakerOn && styles.controlActive]}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
            size={26}
            color="#FFF"
          />
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>

        {callType === 'video' && (
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={26} color="#FFF" />
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  videoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newClientBanner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  newClientText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  clientInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFF',
  },
  clientName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  localVideo: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 90,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  localPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(107,78,170,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(39,174,96,0.15)',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  earningsLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  earningsValue: {
    color: '#27AE60',
    fontSize: 18,
    fontWeight: '700',
  },
  earningsDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: SPACING.md,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  controlActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  controlLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
});
