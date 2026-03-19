import { useState } from 'react';
import {
  View,
  Text,
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
  success: '#2E9E5B',
  successLight: '#E8F7EF',
};

// Extended artisan data — in production this comes from your backend
const ARTISAN_DETAILS = {
  1:  { rate: 'GH₵ 120/hr', location: 'East Legon, Accra',  available: true,  verified: true,  experience: '7 years',  about: 'Certified electrician specialising in residential and commercial wiring, fault diagnosis, and solar installations. Fully insured and available on short notice.', portfolio: ['Kitchen rewire', 'Solar panel install', 'DB board upgrade', 'Security lighting'], reviews: [{ name: 'Kojo A.',    rating: 5, text: 'Incredibly professional. Fixed our wiring issue same day.', date: '2 weeks ago' }, { name: 'Serwa M.',   rating: 5, text: 'Highly recommend. Clean work and fair pricing.',          date: '1 month ago' }, { name: 'Nana B.',    rating: 4, text: 'Came on time and sorted everything quickly.',             date: '2 months ago' }] },
  2:  { rate: 'GH₵ 100/hr', location: 'Osu, Accra',         available: true,  verified: true,  experience: '5 years',  about: 'Expert plumber handling leaks, pipe installations, bathroom fittings, and drainage systems. Customer satisfaction is my top priority.', portfolio: ['Bathroom refit', 'Pipe replacement', 'Water heater install', 'Drainage repair'], reviews: [{ name: 'Akua T.',    rating: 5, text: 'Fixed a serious leak in under an hour. Lifesaver!',       date: '3 days ago'  }, { name: 'Fiifi O.',   rating: 5, text: 'Very neat and thorough. Will definitely call again.',     date: '3 weeks ago' }] },
  3:  { rate: 'GH₵ 90/hr',  location: 'Tema, Greater Accra', available: false, verified: true,  experience: '10 years', about: 'Master carpenter with a decade of experience in custom furniture, cabinetry, roofing frameworks, and general woodwork. I take pride in quality craftsmanship.', portfolio: ['Custom wardrobe', 'Kitchen cabinets', 'Wooden ceiling', 'Office furniture'], reviews: [{ name: 'Ama S.',     rating: 5, text: 'Built us a beautiful wardrobe. Excellent attention to detail.', date: '1 week ago'  }, { name: 'Yaw D.',     rating: 4, text: 'Great quality work. Took a bit longer than expected.',     date: '1 month ago' }] },
  4:  { rate: 'GH₵ 80/hr',  location: 'Lapaz, Accra',       available: true,  verified: false, experience: '4 years',  about: 'Interior and exterior painter with a keen eye for colour and finish. I use quality paints and always leave the space cleaner than I found it.', portfolio: ['Living room paint', 'Exterior repaint', 'Textured walls', 'Office interior'], reviews: [{ name: 'Abena K.',   rating: 5, text: 'Transformed our living room completely. Stunning work.',    date: '5 days ago'  }, { name: 'Kwesi P.',   rating: 4, text: 'Good job overall. Very professional attitude.',            date: '6 weeks ago' }] },
  5:  { rate: 'GH₵ 95/hr',  location: 'Kasoa',              available: true,  verified: true,  experience: '8 years',  about: 'Experienced mason specialising in block laying, plastering, tiling foundations, and general construction work. Known for strong, durable finishes.', portfolio: ['House extension', 'Perimeter wall', 'Floor screed', 'Retaining wall'], reviews: [{ name: 'Kofi M.',    rating: 5, text: 'Solid workmanship. The extension looks perfect.',          date: '2 weeks ago' }] },
  6:  { rate: 'GH₵ 75/hr',  location: 'Spintex, Accra',     available: true,  verified: false, experience: '3 years',  about: 'Tiler with experience in floor and wall tiling, bathroom fitting, and waterproofing. I work cleanly and efficiently.', portfolio: ['Bathroom tiling', 'Kitchen backsplash', 'Outdoor patio', 'Hallway floor'], reviews: [{ name: 'Efua A.',    rating: 4, text: 'Great tiling job in the bathroom. Very happy.',             date: '3 weeks ago' }] },
  7:  { rate: 'GH₵ 110/hr', location: 'Adenta, Accra',      available: false, verified: true,  experience: '6 years',  about: 'Roofing specialist handling sheet metal, concrete, and aluminium roofs. I also do roof repairs, waterproofing, and guttering.', portfolio: ['Full roof install', 'Roof repair', 'Gutter fitting', 'Waterproofing'], reviews: [{ name: 'Mensah K.',  rating: 5, text: 'Fixed a stubborn leak no one else could solve. Brilliant.',  date: '1 month ago' }] },
  8:  { rate: 'GH₵ 70/hr',  location: 'Achimota, Accra',    available: true,  verified: true,  experience: '5 years',  about: 'General handyman for all your home maintenance needs — assembly, minor repairs, painting touch-ups, plumbing basics, and more.', portfolio: ['Furniture assembly', 'Door fixing', 'Wall patching', 'Odd jobs'], reviews: [{ name: 'Adwoa F.',   rating: 5, text: 'So reliable! Sorted out 5 different things in one visit.',  date: '4 days ago'  }, { name: 'Nana O.',    rating: 4, text: 'Friendly and efficient. Fair price.',                      date: '2 months ago' }] },
};

function Stars({ rating, size = 14 }) {
  return (
    <Text style={{ fontSize: size, color: '#F5A623' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </Text>
  );
}

// ── Booking Confirmation Modal ────────────────────────────────────────────────
function BookingModal({ visible, artisan, details, onClose, onConfirm }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'success'

  const handleConfirm = () => {
    setStep('success');
  };

  const handleDone = () => {
    setStep('confirm');
    onConfirm();
  };

  if (!artisan || !details) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {step === 'confirm' ? (
            <>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <Text style={styles.modalSubtitle}>You're about to request a booking with:</Text>

              <View style={styles.modalArtisanRow}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarEmoji}>{artisan.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.modalArtisanName}>{artisan.name}</Text>
                  <Text style={styles.modalArtisanTrade}>{artisan.trade} · {details.rate}</Text>
                  <Text style={styles.modalArtisanLocation}>📍 {details.location}</Text>
                </View>
              </View>

              <View style={styles.modalInfoBox}>
                <Text style={styles.modalInfoText}>
                  After confirming, {artisan.name.split(' ')[0]} will receive your request and reach out via the Messages tab to discuss details and schedule a visit.
                </Text>
              </View>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirm} activeOpacity={0.88}>
                <Text style={styles.modalConfirmBtnText}>Confirm Booking Request</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.successIconWrapper}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              <Text style={styles.modalTitle}>Request Sent!</Text>
              <Text style={styles.modalSubtitle}>
                Your booking request has been sent to{' '}
                <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{artisan.name}</Text>.
                You'll hear back shortly via Messages.
              </Text>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleDone} activeOpacity={0.88}>
                <Text style={styles.modalConfirmBtnText}>Done</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ArtisanProfileScreen({ navigation, route }) {
  const artisan = route?.params?.artisan;
  const details = artisan ? ARTISAN_DETAILS[artisan.id] : null;
  const [showBooking, setShowBooking] = useState(false);

  if (!artisan || !details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Artisan not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.errorLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const avgRating = artisan.rating;

  return (
    <View style={styles.outerContainer}>
      <BookingModal
        visible={showBooking}
        artisan={artisan}
        details={details}
        onClose={() => setShowBooking(false)}
        onConfirm={() => {
          setShowBooking(false);
          navigation.navigate('Messages');
        }}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.msgBtn}
            onPress={() => navigation.navigate('Messages')}
            activeOpacity={0.8}
          >
            <Text style={styles.msgIcon}>✉</Text>
          </TouchableOpacity>
        </View>

        {/* ── Profile Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarEmoji}>{artisan.avatar}</Text>
          </View>

          <View style={styles.heroNameRow}>
            <Text style={styles.heroName}>{artisan.name}</Text>
            {details.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>

          <Text style={styles.heroTrade}>{artisan.trade}</Text>

          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Stars rating={avgRating} size={16} />
              <Text style={styles.heroMetaValue}>{avgRating}</Text>
              <Text style={styles.heroMetaLabel}>({artisan.reviews} reviews)</Text>
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{details.experience}</Text>
              <Text style={styles.heroStatLabel}>Experience</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{details.rate}</Text>
              <Text style={styles.heroStatLabel}>Hourly Rate</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <View style={[styles.availDot, { backgroundColor: details.available ? COLORS.success : '#ccc' }]} />
              <Text style={styles.heroStatLabel}>{details.available ? 'Available' : 'Unavailable'}</Text>
            </View>
          </View>

          <Text style={styles.heroLocation}>📍 {details.location}</Text>
        </View>

        {/* ── About ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{details.about}</Text>
        </View>

        {/* ── Portfolio ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <View style={styles.portfolioGrid}>
            {details.portfolio.map((item, i) => (
              <View key={i} style={styles.portfolioItem}>
                <Text style={styles.portfolioIcon}>🔨</Text>
                <Text style={styles.portfolioLabel}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Reviews ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {details.reviews.map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Stars rating={r.rating} size={12} />
                </View>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Sticky Book Button ── */}
      <View style={styles.stickyFooter}>
        <View style={styles.stickyRate}>
          <Text style={styles.stickyRateValue}>{details.rate}</Text>
          <Text style={styles.stickyRateLabel}>Starting rate</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, !details.available && styles.bookBtnDisabled]}
          onPress={() => details.available && setShowBooking(true)}
          activeOpacity={0.88}
        >
          <Text style={styles.bookBtnText}>
            {details.available ? 'Book Now' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
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
  container: { paddingBottom: 40 },

  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 12 },
  errorLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backArrow: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  msgBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.accentLight, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  msgIcon: { fontSize: 18, color: COLORS.primary },

  // Hero
  hero: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16, borderRadius: 20,
    padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
    marginBottom: 16,
  },
  heroAvatar: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: COLORS.accentLight, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  heroAvatarEmoji: { fontSize: 50 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  heroName: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  verifiedBadge: {
    backgroundColor: COLORS.successLight, borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: '#B6E8CE',
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  heroTrade: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  heroMetaLabel: { fontSize: 12, color: COLORS.textSecondary },

  heroStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 20,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 12, width: '100%',
  },
  heroStatItem: { flex: 1, alignItems: 'center', gap: 3 },
  heroStatValue: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  heroStatLabel: { fontSize: 11, color: COLORS.textSecondary },
  heroStatDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  heroLocation: { fontSize: 12, color: COLORS.textSecondary },

  // Sections
  section: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '800', color: COLORS.textPrimary,
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12,
  },
  aboutText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  // Portfolio
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  portfolioItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.accentLight, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  portfolioIcon: { fontSize: 14 },
  portfolioLabel: { fontSize: 12, fontWeight: '600', color: COLORS.accent },

  // Reviews
  reviewCard: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 10 },
  reviewAvatar: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  reviewDate: { fontSize: 11, color: COLORS.textSecondary },
  reviewText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  // Sticky footer
  stickyFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    ...(Platform.OS === 'web' ? { position: 'fixed', bottom: 0, left: 0, right: 0 } : {}),
  },
  stickyRate: {},
  stickyRateValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  stickyRateLabel: { fontSize: 11, color: COLORS.textSecondary },
  bookBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 32,
  },
  bookBtnDisabled: { backgroundColor: '#CCC' },
  bookBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6, letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 20 },
  modalArtisanRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.bg, borderRadius: 14,
    padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalAvatar: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: COLORS.accentLight, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  modalAvatarEmoji: { fontSize: 28 },
  modalArtisanName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  modalArtisanTrade: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  modalArtisanLocation: { fontSize: 12, color: COLORS.textSecondary },
  modalInfoBox: {
    backgroundColor: COLORS.accentLight, borderRadius: 10,
    padding: 12, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalInfoText: { fontSize: 12, color: COLORS.accent, lineHeight: 18 },
  modalConfirmBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 10,
  },
  modalConfirmBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  modalCancelBtn: { paddingVertical: 10, alignItems: 'center' },
  modalCancelText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  successIconWrapper: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: COLORS.successLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, alignSelf: 'center',
  },
  successIcon: { fontSize: 26, color: COLORS.success, fontWeight: '800' },
});