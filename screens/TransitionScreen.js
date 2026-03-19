import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

const COLORS = {
  bg: '#1C1C1E',
  accent: '#D47C2F',
  accentLight: '#3A2A1A',
  border: '#3A3A3C',
  textSecondary: '#8A8A8E',
};

export default function TransitionScreen({ navigation, route }) {
  const dest      = route?.params?.dest || 'Home';
  const destParams = route?.params?.destParams || {};

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.82)).current;
  const textFade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(textFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: dest, params: destParams }],
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.logoEmoji}>🛠️</Text>
      </Animated.View>
      <Animated.View style={[styles.textWrapper, { opacity: textFade }]}>
        <Text style={styles.appName}>THE HANDYMAN</Text>
        <Text style={styles.tagline}>Every trade. One platform.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
  },
  logoWrapper: {
    width: 120, height: 120, borderRadius: 34,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 30, elevation: 12,
  },
  logoEmoji: { fontSize: 56 },
  textWrapper: { alignItems: 'center', gap: 6 },
  appName: {
    fontSize: 20, fontWeight: '800',
    color: COLORS.accent, letterSpacing: 7,
  },
  tagline: {
    fontSize: 13, color: COLORS.textSecondary, letterSpacing: 0.4,
  },
});