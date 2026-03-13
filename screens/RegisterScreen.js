import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { customList } from 'country-codes-list';

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
};

const TRADES = [
  'Plumber', 'Electrician', 'Carpenter', 'Painter',
  'Mason', 'Welder', 'Tiler', 'Roofer', 'General Handyman', 'Other',
];

const toFlag = (iso2) =>
  iso2.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );

const rawList = customList('countryNameEn', '{countryCallingCode}|{countryCode}');
const COUNTRY_CODES = Object.entries(rawList)
  .map(([name, val]) => {
    const [dialCode, iso2] = val.split('|');
    return { label: name, code: '+' + dialCode, flag: toFlag(iso2), iso2 };
  })
  .filter((c) => c.code !== '+' && c.iso2)
  .sort((a, b) => a.label.localeCompare(b.label));

function Field({ label, children }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', location: '',
    trade: '', qualification: '', password: '', confirmPassword: '',
  });

  const defaultCountry = useMemo(
    () => COUNTRY_CODES.find((c) => c.iso2 === 'GH') || COUNTRY_CODES[0], []
  );
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const filteredCountries = useMemo(() =>
    countrySearch.trim()
      ? COUNTRY_CODES.filter((c) =>
          c.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch)
        )
      : COUNTRY_CODES,
    [countrySearch]
  );

  const passwordRules = [
    { label: 'At least 8 characters',                   test: (p) => p.length >= 8 },
    { label: 'At least one capital letter',              test: (p) => /[A-Z]/.test(p) },
    { label: 'At least one number',                      test: (p) => /[0-9]/.test(p) },
    { label: 'At least one special character (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const passwordValid = () => passwordRules.every((r) => r.test(form.password));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.phone.length < 5) e.phone = 'Enter a valid phone number';
    if (!form.location.trim()) e.location = 'Required';
    if (role === 'artisan') {
      if (!form.trade) e.trade = 'Select a trade';
      if (!form.qualification.trim()) e.qualification = 'Required';
    }
    if (!passwordValid()) e.password = 'Password does not meet requirements';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleKeyPress = (handler) => ({ nativeEvent }) => {
    if (nativeEvent?.key === 'Enter') handler();
  };

  const handleRegister = () => {
    if (!validate()) return;
    const displayName = form.fullName.trim() || form.email.split('@')[0] || 'there';
    const dest = role === 'artisan' ? 'ArtisanHome' : 'Home';
    navigation.navigate(dest, { name: displayName });
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subheading}>Join The Handyman platform today.</Text>
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

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Personal Info</Text>

          <Field label="Full Name">
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="John Doe"
              placeholderTextColor={COLORS.textSecondary}
              value={form.fullName}
              onChangeText={set('fullName')}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </Field>

          <Field label="Email">
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={set('email')}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </Field>

          <Field label="Phone Number">
            <View style={[styles.phoneRow, errors.phone && styles.inputError]}>
              <TouchableOpacity
                style={styles.countryCodeBtn}
                onPress={() => { setCountryOpen(!countryOpen); setTradeOpen(false); setCountrySearch(''); }}
                activeOpacity={0.8}
              >
                <Text style={styles.countryCodeText}>{countryCode.flag} {countryCode.code}</Text>
                <Text style={styles.dropdownArrow}>{countryOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              <View style={styles.phoneDivider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="00 000 0000"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={set('phone')}
              />
            </View>
            {countryOpen && (
              <View style={styles.dropdownList}>
                <TextInput
                  style={styles.countrySearch}
                  placeholder="Search country or code..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={countrySearch}
                  onChangeText={setCountrySearch}
                  autoFocus
                />
                <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                  {filteredCountries.map((c) => (
                    <TouchableOpacity
                      key={c.iso2}
                      style={[styles.dropdownItem, countryCode.iso2 === c.iso2 && styles.dropdownItemActive]}
                      onPress={() => { setCountryCode(c); setCountryOpen(false); setCountrySearch(''); }}
                    >
                      <Text style={[styles.dropdownItemText, countryCode.iso2 === c.iso2 && styles.dropdownItemTextActive]}>
                        {c.flag}  {c.label}  ({c.code})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </Field>

          <Field label="Location">
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="e.g. Accra, Ghana"
              placeholderTextColor={COLORS.textSecondary}
              value={form.location}
              onChangeText={set('location')}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </Field>

          {role === 'artisan' && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Artisan Details</Text>
                <View style={styles.dividerLine} />
              </View>

              <Field label="Trade / Specialty">
                <TouchableOpacity
                  style={[styles.input, styles.dropdownTrigger, errors.trade && styles.inputError]}
                  onPress={() => { setTradeOpen(!tradeOpen); setCountryOpen(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={form.trade ? styles.dropdownValue : styles.dropdownPlaceholder}>
                    {form.trade || 'Select your trade'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{tradeOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {errors.trade && <Text style={styles.errorText}>{errors.trade}</Text>}
                {tradeOpen && (
                  <View style={styles.dropdownList}>
                    {TRADES.map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.dropdownItem, form.trade === t && styles.dropdownItemActive]}
                        onPress={() => { set('trade')(t); setTradeOpen(false); }}
                      >
                        <Text style={[styles.dropdownItemText, form.trade === t && styles.dropdownItemTextActive]}>
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Field>

              <Field label="Qualification">
                <TextInput
                  style={[styles.input, errors.qualification && styles.inputError]}
                  placeholder="e.g. City & Guilds, HND, Certified Electrician"
                  placeholderTextColor={COLORS.textSecondary}
                  value={form.qualification}
                  onChangeText={set('qualification')}
                />
                {errors.qualification && <Text style={styles.errorText}>{errors.qualification}</Text>}
              </Field>
            </>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Security</Text>
            <View style={styles.dividerLine} />
          </View>

          <Field label="Password">
            <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Min. 8 characters"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={set('password')}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showHide}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {form.password.length > 0 && (
              <View style={styles.passwordChecklist}>
                {passwordRules.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <View key={rule.label} style={styles.checkRow}>
                      <Text style={[styles.checkIcon, passed ? styles.checkPass : styles.checkFail]}>
                        {passed ? '✓' : '✗'}
                      </Text>
                      <Text style={[styles.checkLabel, passed ? styles.checkPass : styles.checkFail]}>
                        {rule.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </Field>

          <Field label="Confirm Password">
            <View style={[styles.passwordWrapper, errors.confirmPassword && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showConfirm}
                value={form.confirmPassword}
                onChangeText={set('confirmPassword')}
                returnKeyType="go"
                onSubmitEditing={handleRegister}
                onKeyPress={handleKeyPress(handleRegister)}
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.showHide}>{showConfirm ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </Field>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.88}>
            <Text style={styles.registerBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: COLORS.bg,
    ...(Platform.OS === 'web'
      ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto' }
      : { flex: 1 }),
  },
  container: { paddingHorizontal: 28, paddingTop: 60, paddingBottom: 120 },

  header: { marginBottom: 28 },
  backBtn: { marginBottom: 16 },
  backArrow: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  heading: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 4 },
  subheading: { fontSize: 14, color: COLORS.textSecondary },

  toggleWrapper: {
    flexDirection: 'row', backgroundColor: COLORS.border,
    borderRadius: 12, padding: 4, marginBottom: 24,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9 },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.3 },
  toggleTextActive: { color: '#FFFFFF' },

  card: {
    backgroundColor: COLORS.surface, borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2, marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.accent,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 16,
  },

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

  phoneRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, backgroundColor: COLORS.inputBg, overflow: 'hidden',
  },
  countryCodeBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 13,
    backgroundColor: COLORS.accentLight,
  },
  countryCodeText: { fontSize: 13, fontWeight: '700', color: COLORS.accent, marginRight: 4 },
  phoneDivider: { width: 1, backgroundColor: COLORS.border, alignSelf: 'stretch' },
  phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: COLORS.textPrimary },

  countrySearch: {
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: COLORS.textPrimary,
  },

  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, backgroundColor: COLORS.inputBg, paddingHorizontal: 14,
  },
  passwordInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: COLORS.textPrimary },
  showHide: { fontSize: 12, color: COLORS.accent, fontWeight: '700' },

  dropdownTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.textSecondary },
  dropdownValue: { fontSize: 15, color: COLORS.textPrimary },
  dropdownArrow: { fontSize: 11, color: COLORS.textSecondary },
  dropdownList: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    backgroundColor: COLORS.surface, marginTop: 4, overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownItemActive: { backgroundColor: COLORS.accentLight },
  dropdownItemText: { fontSize: 14, color: COLORS.textPrimary },
  dropdownItemTextActive: { color: COLORS.accent, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 11, color: COLORS.textSecondary, marginHorizontal: 10, letterSpacing: 0.5 },

  registerBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  registerBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },

  passwordChecklist: { marginTop: 8, paddingLeft: 4 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  checkIcon: { fontSize: 12, fontWeight: '700', width: 14, marginRight: 6 },
  checkLabel: { fontSize: 12 },
  checkPass: { color: '#2E9E5B' },
  checkFail: { color: COLORS.textSecondary },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 13, color: COLORS.textSecondary },
  loginLink: { fontSize: 13, color: COLORS.accent, fontWeight: '700' },
});