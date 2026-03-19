import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';

const COLORS = {
  bg: '#F8F6F2',
  surface: '#FFFFFF',
  primary: '#D47C2F',
  accent: '#D47C2F',
  accentLight: '#FDF3E7',
  textPrimary: '#1C1C1E',
  textSecondary: '#8A8A8E',
  border: '#E5E2DC',
  inputBg: '#F8F6F2',
  error: '#E04444',
  success: '#2E9E5B',
};

// ── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ visible, onClose }) {
  const [step, setStep]       = useState('email');
  const [fpEmail, setFpEmail] = useState('');
  const [fpError, setFpError] = useState('');

  const handleSend = () => {
    if (!fpEmail.trim()) { setFpError('Please enter your email'); return; }
    if (!fpEmail.includes('@') || !fpEmail.includes('.')) { setFpError('Enter a valid email address'); return; }
    setFpError('');
    setStep('sent');
  };

  const handleClose = () => {
    setStep('email');
    setFpEmail('');
    setFpError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {step === 'email' ? (
            <>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalSubtitle}>
                Enter the email address linked to your account and we'll send you a reset link.
              </Text>
              <TextInput
                style={[styles.input, fpError ? styles.inputError : null]}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={fpEmail}
                onChangeText={(t) => { setFpEmail(t); setFpError(''); }}
                returnKeyType="go"
                onSubmitEditing={handleSend}
                onKeyPress={({ nativeEvent }) => { if (nativeEvent?.key === 'Enter') handleSend(); }}
              />
              {fpError ? <Text style={styles.errorText}>{fpError}</Text> : null}
              <TouchableOpacity style={styles.modalBtn} onPress={handleSend} activeOpacity={0.88}>
                <Text style={styles.modalBtnText}>Send Reset Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={handleClose}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalSuccessIcon}>✓</Text>
              <Text style={styles.modalTitle}>Check your inbox</Text>
              <Text style={styles.modalSubtitle}>
                A password reset link has been sent to{' '}
                <Text style={styles.modalEmailHighlight}>{fpEmail}</Text>.
                Check your spam folder if you don't see it.
              </Text>
              <TouchableOpacity style={styles.modalBtn} onPress={handleClose} activeOpacity={0.88}>
                <Text style={styles.modalBtnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Demo credentials — replace with real auth (Supabase/Firebase) later
const DEMO_USERS = [
  { username: 'client',  password: 'client123',  role: 'client'  },
  { username: 'artisan', password: 'artisan123', role: 'artisan' },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [role, setRole]                 = useState('client');
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [errors, setErrors]             = useState({});
  const [showForgot, setShowForgot]     = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleKeyPress = (handler) => ({ nativeEvent }) => {
    if (nativeEvent?.key === 'Enter') handler();
  };

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password.trim()) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    const trimmedUsername = username.trim();
    const trimmedPassword = password;
    setLoading(true);
    setTimeout(() => {
      const match = DEMO_USERS.find(
        u => u.username === trimmedUsername && u.password === trimmedPassword
      );
      setLoading(false);
      if (!match) {
        setErrors({ general: 'Incorrect username or password. Please try again.' });
        return;
      }
      const dest = match.role === 'artisan' ? 'ArtisanHome' : 'Home';
      navigation.reset({ index: 0, routes: [{ name: dest, params: { name: trimmedUsername } }] });
    }, 800);
  };

  const handleGoogleLogin = () => {
    const dest = role === 'artisan' ? 'ArtisanHome' : 'Home';
    navigation.reset({ index: 0, routes: [{ name: dest, params: { name: 'User' } }] });
  };

  return (
    <View style={styles.outerContainer}>
      <ForgotPasswordModal visible={showForgot} onClose={() => setShowForgot(false)} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoWrapper}>
            <Text style={styles.logoEmoji}>🛠️</Text>
          </View>
          <Text style={styles.appName}>THE HANDYMAN</Text>
          <Text style={styles.tagline}>Every trade. One platform.</Text>
        </View>

        {/* Role Toggle */}
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            style={[styles.toggleBtn, role === 'client' && styles.toggleActive]}
            onPress={() => { setRole('client'); setErrors({}); }}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleText, role === 'client' && styles.toggleTextActive]}>
              I'm a Client
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, role === 'artisan' && styles.toggleActive]}
            onPress={() => { setRole('artisan'); setErrors({}); }}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleText, role === 'artisan' && styles.toggleTextActive]}>
              I'm an Artisan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {role === 'client' ? 'Welcome back' : 'Welcome back, Artisan'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {role === 'client'
              ? 'Sign in to find skilled professionals near you.'
              : 'Sign in to manage your jobs and clients.'}
          </Text>

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Enter your username"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
              value={username}
              onChangeText={(t) => { setUsername(t); setErrors(e => ({ ...e, username: '', general: '' })); }}
              returnKeyType="next"
              blurOnSubmit={false}
            />
            {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: '', general: '' })); }}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                onKeyPress={handleKeyPress(handleLogin)}
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showHide}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Remember me + Forgot */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowForgot(true)}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* General error */}
          {errors.general ? (
            <View style={styles.generalError}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.88}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} activeOpacity={0.88}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>Connecting skilled hands with those who need them.</Text>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: COLORS.bg,
    ...(Platform.OS === 'web'
      ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto' }
      : { flex: 1 }),
  },
  container: { paddingHorizontal: 28, paddingTop: 72, paddingBottom: 40 },

  brand: { alignItems: 'center', marginBottom: 36 },
  logoWrapper: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 3,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 20, fontWeight: '800', color: COLORS.primary, letterSpacing: 7, marginBottom: 4 },
  tagline: { fontSize: 13, color: COLORS.textSecondary, letterSpacing: 0.4 },

  toggleWrapper: {
    flexDirection: 'row', backgroundColor: COLORS.border,
    borderRadius: 12, padding: 4, marginBottom: 28,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9 },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.3 },
  toggleTextActive: { color: '#FFFFFF' },

  card: {
    backgroundColor: COLORS.surface, borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2, marginBottom: 28,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4, letterSpacing: -0.3 },
  cardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 18 },

  fieldGroup: { marginBottom: 16 },
  label: {
    fontSize: 11, fontWeight: '700', color: COLORS.textPrimary,
    marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: COLORS.textPrimary, backgroundColor: COLORS.inputBg,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 4 },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, backgroundColor: COLORS.inputBg, paddingHorizontal: 14,
  },
  passwordInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: COLORS.textPrimary },
  showHide: { fontSize: 12, color: COLORS.accent, fontWeight: '700', letterSpacing: 0.3 },

  optionsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 22, marginTop: 4,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.inputBg,
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxTick: { fontSize: 11, color: '#FFF', fontWeight: '800' },
  rememberText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  forgotText: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },

  loginBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginBottom: 4,
  },
  loginBtnDisabled: { opacity: 0.65 },
  loginBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },

  generalError: {
    backgroundColor: '#FEF2F2', borderRadius: 10,
    padding: 12, marginBottom: 14,
    borderWidth: 1, borderColor: '#FECACA',
  },
  generalErrorText: { fontSize: 13, color: COLORS.error, textAlign: 'center', fontWeight: '500' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 12, color: COLORS.textSecondary, marginHorizontal: 12 },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12,
    paddingVertical: 13, backgroundColor: COLORS.surface, marginBottom: 20,
  },
  googleIcon: {
    fontSize: 13, fontWeight: '800', color: '#4285F4',
    width: 22, height: 22, textAlign: 'center', lineHeight: 22,
    borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  googleBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },

  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontSize: 13, color: COLORS.textSecondary },
  signupLink: { fontSize: 13, color: COLORS.accent, fontWeight: '700' },

  footer: { textAlign: 'center', fontSize: 12, color: COLORS.textSecondary, letterSpacing: 0.2 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 28,
  },
  modalCard: {
    backgroundColor: COLORS.surface, borderRadius: 20,
    padding: 28, width: '100%', maxWidth: 400,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 20 },
  modalEmailHighlight: { color: COLORS.primary, fontWeight: '700' },
  modalSuccessIcon: {
    fontSize: 32, color: COLORS.success, fontWeight: '800',
    marginBottom: 12, textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  modalBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  modalCancelBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  modalCancelText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
});