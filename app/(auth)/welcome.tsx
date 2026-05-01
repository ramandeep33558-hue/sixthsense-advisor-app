import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Mystical cosmic/nebula video for psychic theme
const VIDEO_URL = 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-tunnel-of-colorful-lights-31513-large.mp4';
// Fallback image if video doesn't load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800';
// Advisor App Logo (pink diamond)
const ADVISOR_LOGO_URL = "https://customer-assets.emergentagent.com/job_42069a8a-9a70-44df-94f4-f6571c6ab514/artifacts/ane1lnpn_IMG_4687.jpeg";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.playAsync();
          setVideoLoaded(true);
        } catch (error) {
          console.log('Video failed to load, using fallback');
          setShowFallback(true);
        }
      }
    };
    
    // Small delay to ensure component is mounted
    const timer = setTimeout(loadVideo, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderBackground = () => {
    if (showFallback || Platform.OS === 'web') {
      return (
        <ImageBackground
          source={{ uri: FALLBACK_IMAGE }}
          style={styles.backgroundVideo}
          resizeMode="cover"
        />
      );
    }
    
    return (
      <Video
        ref={videoRef}
        source={{ uri: VIDEO_URL }}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        onError={() => setShowFallback(true)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Video/Image Background */}
      {renderBackground()}

      {/* Dark Overlay */}
      <LinearGradient
        colors={['rgba(13,13,13,0.4)', 'rgba(13,13,13,0.8)', 'rgba(13,13,13,0.95)']}
        style={styles.overlay}
      />

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: ADVISOR_LOGO_URL }}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.appName}>Sixth Sense Advisors</Text>
          <Text style={styles.tagline}>Share Your Gift With The World</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(255, 215, 64, 0.15)' }]}>
              <Ionicons name="wallet" size={26} color="#FFD740" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Earn Your Way</Text>
              <Text style={styles.featureDesc}>Set your own rates, work on your terms</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(0, 229, 255, 0.15)' }]}>
              <Ionicons name="time" size={26} color="#00E5FF" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Flexible Schedule</Text>
              <Text style={styles.featureDesc}>Work when you want, from anywhere</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(124, 77, 255, 0.15)' }]}>
              <Ionicons name="people" size={26} color="#7C4DFF" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Global Clients</Text>
              <Text style={styles.featureDesc}>Connect with seekers worldwide</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={[styles.buttons, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => router.push('/application')}
          >
            <LinearGradient
              colors={['#7C4DFF', '#5C2DC9']}
              style={styles.applyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.applyButtonText}>Apply to Become an Advisor</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 22,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(124, 77, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.7)',
  },
  features: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  buttons: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 14,
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#7C4DFF',
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  applyGradient: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
