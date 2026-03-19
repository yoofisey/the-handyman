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
  accentDark: '#B8651A',
  textPrimary: '#1C1C1E',
  textSecondary: '#8A8A8E',
  border: '#E5E2DC',
  inputBg: '#F8F6F2',
  error: '#E04444',
  success: '#2E9E5B',
  successLight: '#E8F7EF',
};

const TRADES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter',
  'Mason', 'Welder', 'Tiler', 'Roofer', 'General Handyman', 'Other',
];

const TIMES = [
  'Morning (8am – 12pm)',
  'Afternoon (12pm – 5pm)',
  'Evening (5pm – 8pm)',
  'Flexible',
];

// ── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ visible, jobTitle, onDone }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.successIconWrapper}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.modalTitle}>Job Posted!</Text>
          <Text style={styles.modalSubtitle}>
            Your job{' '}
            <Text style={styles.modalHighlight}>"{jobTitle}"</Text>
            {' '}has been posted. Artisans in your area will be able to see it and reach out to you via Messages.
          </Text>

          <View style={styles.modalInfoBox}>
            <Text style={styles.modalInfoText}>
              💡 Tip: You can also browse artisans directly from the Search tab and book one yourself.
            </Text>
          </View>

          <TouchableOpacity style={styles.modalBtn} onPress={onDone} activeOpacity={0.88}>
            <Text style={styles.modalBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredDot}>*</Text>}
      </View>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PostJobScreen({ navigation }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    trade: '',
    location: '',
    date: '',
    time: '',
  });
  const [errors, setErrors]       = useState({});
  const [tradeOpen, setTradeOpen] = useState(false);
  const [timeOpen, setTimeOpen]   = useState(false);
  const [photos, setPhotos]       = useState([]); // placeholder slots
  const [showSuccess, setShowSuccess] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.description.trim()) e.description = 'Please describe the job';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.date.trim())        e.date        = 'Preferred date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    navigation.navigate('Home');
  };

  // Simulate adding a photo slot
  const addPhoto = () => {
    if (photos.length >= 4) return;
    setPhotos(prev => [...prev, { id: Date.now(), label: `Photo ${prev.length + 1}` }]);
  };

  return (
    <View style={styles.outerContainer}>
      <SuccessModal
        visible={showSuccess}
        jobTitle={form.title}
        onDone={handleDone}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={{ width: 36 }} />
        </View>

        <Text style={styles.pageSubtitle}>
          Describe what you need and let skilled artisans come to you.
        </Text>

        {/* ── Job Details Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>Job Details</Text>

          <Field label="Job Title" required error={errors.title}>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="e.g. Fix leaking kitchen sink"
              placeholderTextColor={COLORS.textSecondary}
              value={form.title}
              onChangeText={(t) => { set('title')(t); setErrors(e => ({ ...e, title: '' })); }}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe the job in detail — what needs to be done, any specific requirements, access instructions, etc."
              placeholderTextColor={COLORS.textSecondary}
              value={form.description}
              onChangeText={(t) => { set('description')(t); setErrors(e => ({ ...e, description: '' })); }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Field>

          <Field label="Trade / Category">
            <TouchableOpacity
              style={[styles.input, styles.dropdownTrigger, errors.trade && styles.inputError]}
              onPress={() => { setTradeOpen(!tradeOpen); setTimeOpen(false); }}
              activeOpacity={0.8}
            >
              <Text style={form.trade ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {form.trade || 'Select a trade (optional)'}
              </Text>
              <Text style={styles.dropdownArrow}>{tradeOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {tradeOpen && (
              <View style={styles.dropdownList}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => { set('trade')(''); setTradeOpen(false); }}
                >
                  <Text style={[styles.dropdownItemText, { color: COLORS.textSecondary }]}>
                    Any trade
                  </Text>
                </TouchableOpacity>
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
        </View>

        {/* ── Location & Timing Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>Location & Timing</Text>

          <Field label="Location" required error={errors.location}>
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="e.g. East Legon, Accra"
              placeholderTextColor={COLORS.textSecondary}
              value={form.location}
              onChangeText={(t) => { set('location')(t); setErrors(e => ({ ...e, location: '' })); }}
            />
          </Field>

          <Field label="Preferred Date" required error={errors.date}>
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              placeholder="e.g. 20 March 2026 or ASAP"
              placeholderTextColor={COLORS.textSecondary}
              value={form.date}
              onChangeText={(t) => { set('date')(t); setErrors(e => ({ ...e, date: '' })); }}
            />
          </Field>

          <Field label="Preferred Time">
            <TouchableOpacity
              style={[styles.input, styles.dropdownTrigger]}
              onPress={() => { setTimeOpen(!timeOpen); setTradeOpen(false); }}
              activeOpacity={0.8}
            >
              <Text style={form.time ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {form.time || 'Select a time slot (optional)'}
              </Text>
              <Text style={styles.dropdownArrow}>{timeOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {timeOpen && (
              <View style={styles.dropdownList}>
                {TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.dropdownItem, form.time === t && styles.dropdownItemActive]}
                    onPress={() => { set('time')(t); setTimeOpen(false); }}
                  >
                    <Text style={[styles.dropdownItemText, form.time === t && styles.dropdownItemTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>
        </View>

        {/* ── Photos Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>Photos</Text>
          <Text style={styles.cardSectionHint}>
            Add up to 4 photos to help artisans understand the job better.
          </Text>

          <View style={styles.photoGrid}>
            {photos.map((p) => (
              <View key={p.id} style={styles.photoSlot}>
                <Text style={styles.photoSlotIcon}>🖼️</Text>
                <Text style={styles.photoSlotLabel}>{p.label}</Text>
                <TouchableOpacity
                  style={styles.photoRemoveBtn}
                  onPress={() => setPhotos(prev => prev.filter(x => x.id !== p.id))}
                >
                  <Text style={styles.photoRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 4 && (
              <TouchableOpacity style={styles.photoAddBtn} onPress={addPhoto} activeOpacity={0.8}>
                <Text style={styles.photoAddIcon}>+</Text>
                <Text style={styles.photoAddLabel}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.photoNote}>
            📷 Photo upload will connect to your camera roll when the backend is ready.
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
          <Text style={styles.submitBtnText}>Post Job</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  container: { paddingHorizontal: 18, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 8,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backArrow: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  pageSubtitle: {
    fontSize: 13, color: COLORS.textSecondary,
    marginBottom: 20, lineHeight: 18,
  },

  // Card
  card: {
    backgroundColor: COLORS.surface, borderRadius: 18,
    padding: 20, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  cardSectionLabel: {
    fontSize: 11, fontWeight: '800', color: COLORS.accent,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 16,
  },
  cardSectionHint: {
    fontSize: 12, color: COLORS.textSecondary, marginBottom: 14, marginTop: -10,
  },

  // Fields
  fieldGroup: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  label: {
    fontSize: 11, fontWeight: '700', color: COLORS.textPrimary,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  requiredDot: { fontSize: 13, color: COLORS.error, fontWeight: '800' },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: COLORS.textPrimary, backgroundColor: COLORS.inputBg,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 4 },
  textArea: { height: 110, paddingTop: 13 },

  // Dropdown
  dropdownTrigger: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
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

  // Photos
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  photoSlot: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  photoSlotIcon: { fontSize: 24, marginBottom: 4 },
  photoSlotLabel: { fontSize: 10, color: COLORS.textSecondary },
  photoRemoveBtn: {
    position: 'absolute', top: 4, right: 6,
  },
  photoRemoveText: { fontSize: 18, color: COLORS.error, fontWeight: '700', lineHeight: 20 },
  photoAddBtn: {
    width: 80, height: 80, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bg, gap: 4,
  },
  photoAddIcon: { fontSize: 22, color: COLORS.textSecondary, fontWeight: '300' },
  photoAddLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  photoNote: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },

  // Submit
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 28,
  },
  modalCard: {
    backgroundColor: COLORS.surface, borderRadius: 24,
    padding: 28, width: '100%', maxWidth: 400, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  successIconWrapper: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: COLORS.successLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  successIcon: { fontSize: 30, color: COLORS.success, fontWeight: '800' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 16, textAlign: 'center' },
  modalHighlight: { color: COLORS.primary, fontWeight: '700' },
  modalInfoBox: {
    backgroundColor: COLORS.accentLight, borderRadius: 10,
    padding: 12, marginBottom: 20, width: '100%',
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalInfoText: { fontSize: 12, color: COLORS.accent, lineHeight: 18 },
  modalBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 40, alignItems: 'center',
  },
  modalBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});