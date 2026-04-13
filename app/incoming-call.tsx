import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function IncomingCallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  
  const callId = params.callId as string;
  const callerName = params.callerName as string || 'Client';
  const callType = params.callType as string || 'video';
  const isNewClient = params.isNewClient === 'true';
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start vibration pattern
    if (Platform.OS !== 'web') {
      const pattern = [0, 500, 200, 500];
      Vibration.vibrate(pattern, true);
    }

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slide animation for buttons
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      if (Platform.OS !== 'web') {
        Vibration.cancel();
      }
    };
  }, []);

  const handleAccept = async () => {
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }

    try {
      await fetch(`${BACKEND_URL}/api/video/call/${callId}/answer`, {
        method: 'PUT',
      });

      router.replace({
        pathname: '/active-call',
        params: {
          callId,
          callerName,
          callType,
          isNewClient: isNewClient ? 'true' : 'false',
        },
      });
    } catch (error) {
      console.error('Failed to answer call:', error);
    }
  };

  const handleReject = async () => {
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }

    try {
      await fetch(`${BACKEND_URL}/api/video/call/${callId}/reject`, {
        method: 'PUT',
      });
      router.back();
    } catch (error) {
      console.error('Failed to reject call:', error);
      router.back();
    }
  };

  const buttonTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#1a1a2e']}
      style={styles.container}
    >
      {/* New Client Badge */}
      {isNewClient && (
        <View style={[styles.newClientBadge, { top: insets.top + 20 }]}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.newClientText}>NEW CLIENT - 4 MIN FREE</Text>
        </View>
      )}

      {/* Caller Info */}
      <View style={styles.callerInfo}>
        <Animated.View
          style={[
            styles.avatarContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark || '#4A3578']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {callerName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.pulseRing} />
          <View style={[styles.pulseRing, styles.pulseRing2]} />
        </Animated.View>

        <Text style={styles.callerName}>{callerName}</Text>
        <Text style={styles.callTypeText}>
          Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
        </Text>

        {isNewClient && (
          <View style={styles.newClientInfo}>
            <Ionicons name="gift" size={18} color="#FFD700" />
            <Text style={styles.newClientInfoText}>
              First-time client! Give them your best advice.
            </Text>
          </View>
        )}
      </View>

      {/* Call Actions */}
      <Animated.View
        style={[
          styles.actions,
          {
            paddingBottom: insets.bottom + 40,
            transform: [{ translateY: buttonTranslateY }],
            opacity: slideAnim,
          },
        ]}
      >
        {/* Reject */}
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
        >
          <Ionicons name="close" size={36} color="#FFF" />
          <Text style={styles.actionText}>Decline</Text>
        </TouchableOpacity>

        {/* Accept */}
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
        >
          <Ionicons
            name={callType === 'video' ? 'videocam' : 'call'}
            size={36}
            color="#FFF"
          />
          <Text style={styles.actionText}>Accept</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newClientBadge: {
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  callerInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFF',
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(107, 78, 170, 0.4)',
    top: -10,
    left: -10,
  },
  pulseRing2: {
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -20,
    left: -20,
    borderColor: 'rgba(107, 78, 170, 0.2)',
  },
  callerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  callTypeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  newClientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    maxWidth: width * 0.8,
  },
  newClientInfoText: {
    color: '#FFD700',
    fontSize: 14,
    flex: 1,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  rejectButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
});
