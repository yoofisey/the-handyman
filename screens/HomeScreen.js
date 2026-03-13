import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
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
};

const ARTISANS = [
  { id: 1, name: 'Kwame Asante',    trade: 'Electrician',      rating: 4.9, reviews: 124, avatar: '👨🏿', badge: '⚡ Top Pick' },
  { id: 2, name: 'Ama Boateng',     trade: 'Plumber',          rating: 4.8, reviews: 98,  avatar: '👩🏾', badge: null },
  { id: 3, name: 'Kofi Mensah',     trade: 'Carpenter',        rating: 4.8, reviews: 87,  avatar: '👨🏾', badge: null },
  { id: 4, name: 'Akosua Frimpong', trade: 'Painter',          rating: 4.7, reviews: 76,  avatar: '👩🏿', badge: null },
  { id: 5, name: 'Yaw Darko',       trade: 'Mason',            rating: 4.7, reviews: 65,  avatar: '👨🏿', badge: null },
  { id: 6, name: 'Abena Osei',      trade: 'Tiler',            rating: 4.6, reviews: 54,  avatar: '👩🏾', badge: null },
  { id: 7, name: 'Fiifi Appiah',    trade: 'Roofer',           rating: 4.6, reviews: 48,  avatar: '👨🏾', badge: null },
  { id: 8, name: 'Efua Asare',      trade: 'General Handyman', rating: 4.5, reviews: 41,  avatar: '👩🏿', badge: null },
];

const CATEGORIES = [
  { label: 'All',         icon: '✨' },
  { label: 'Electric',    icon: '⚡' },
  { label: 'Plumbing',    icon: '🔧' },
  { label: 'Carpentry',   icon: '🪚' },
  { label: 'Painting',    icon: '🖌️' },
  { label: 'Masonry',     icon: '🧱' },
];

const STATS = [
  { value: '1,200+', label: 'Artisans' },
  { value: '8,400+', label: 'Jobs Done' },
  { value: '4.8★',   label: 'Avg Rating' },
];

// ── Splash overlay (shown while loading) ──────────────────────────────────────
function SplashOverlay({ visible }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.splashOverlay, { opacity: fadeAnim }]}
    >
      <Text style={styles.splashEmoji}>🛠️</Text>
    </Animated.View>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <Text style={styles.stars}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </Text>
  );
}

// ── Artisan Card ──────────────────────────────────────────────────────────────
function ArtisanCard({ artisan }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <Text style={styles.avatarEmoji}>{artisan.avatar}</Text>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.artisanName}>{artisan.name}</Text>
          {artisan.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{artisan.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.artisanTrade}>{artisan.trade}</Text>
        <View style={styles.ratingRow}>
          <Stars rating={artisan.rating} />
          <Text style={styles.ratingNumber}>{artisan.rating}</Text>
          <Text style={styles.reviewCount}>({artisan.reviews})</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
        <Text style={styles.bookBtnText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ active, setActive, navigation }) {
  const tabs = [
    { key: 'home',    icon: '⌂', label: 'Home'    },
    { key: 'search',  icon: '⌕', label: 'Search'  },
    { key: 'post',    icon: '+', label: 'Post'    },
    { key: 'profile', icon: '◉', label: 'Profile' },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.navItem}
          onPress={() => {
            setActive(tab.key);
            if (tab.key === 'search') navigation.navigate('Search');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>{tab.icon}</Text>
          <Text style={[styles.navLabel, active === tab.key && styles.navLabelActive]}>
            {tab.label}
          </Text>
          {active === tab.key && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation, route }) {
  const userName = route?.params?.name || 'there';
  const [activeTab, setActiveTab]       = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading]           = useState(true);

  // Simulate a short load then hide the splash overlay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const filtered = activeCategory === 'All'
    ? ARTISANS
    : ARTISANS.filter((a) =>
        a.trade.toLowerCase().includes(activeCategory.toLowerCase().replace('ic','').replace('ing','').replace('ry',''))
      );

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.msgBtn} onPress={() => navigation.navigate('Messages')} activeOpacity={0.8}>
            <Text style={styles.msgIcon}>⟶</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero Banner ── */}
        <View style={styles.heroBanner}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Find a trusted{'\n'}pro near you</Text>
            <Text style={styles.heroSub}>Browse 1,200+ vetted artisans{'\n'}ready to take your job today.</Text>
            <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
              <Text style={styles.heroBtnText}>Browse Now →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroEmoji}>🛠️</Text>
        </View>

        {/* ── Stats Strip ── */}
        <View style={styles.statsStrip}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.statItem, i < STATS.length - 1 && styles.statBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Category Pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryPill, activeCategory === cat.label && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat.label)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryLabel, activeCategory === cat.label && styles.categoryLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Artisan List ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated Artisans</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {filtered.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}

      </ScrollView>

      <BottomNav active={activeTab} setActive={setActiveTab} navigation={navigation} />

      {/* Splash overlay fades out once loaded */}
      <SplashOverlay visible={loading} />
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
  container: { paddingHorizontal: 18, paddingTop: 60, paddingBottom: 100 },

  // Splash overlay
  splashOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 99,
  },
  splashEmoji: { fontSize: 72 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 22,
  },
  greeting: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  userName: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  msgBtn: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  msgIcon: { fontSize: 20, color: COLORS.primary, fontWeight: '600' },

  // Hero Banner
  heroBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 20, padding: 22,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.accentDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 6, lineHeight: 26 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginBottom: 16 },
  heroBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 10,
    paddingVertical: 9, paddingHorizontal: 16, alignSelf: 'flex-start',
  },
  heroBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  heroEmoji: { fontSize: 64, marginLeft: 12 },

  // Stats strip
  statsStrip: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 20, overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statBorder: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600', letterSpacing: 0.4 },

  // Category pills
  categoryScroll: { marginBottom: 20 },
  categoryContent: { paddingRight: 18, gap: 8 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.surface, borderRadius: 99,
    paddingVertical: 8, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  categoryPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryIcon: { fontSize: 13 },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  categoryLabelActive: { color: '#FFFFFF' },

  // Section header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  seeAll: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },

  // Artisan card
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatarWrapper: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarEmoji: { fontSize: 30 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' },
  artisanName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  badge: {
    backgroundColor: COLORS.accentLight, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '700', color: COLORS.primary },
  artisanTrade: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stars: { fontSize: 11, color: '#F5A623' },
  ratingNumber: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  reviewCount: { fontSize: 11, color: COLORS.textSecondary },
  bookBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16, flexShrink: 0,
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 10,
    ...(Platform.OS === 'web' ? { position: 'fixed', bottom: 0, left: 0, right: 0 } : {}),
  },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navIcon: { fontSize: 22, color: '#8A8A8E' },
  navLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary },
  navLabelActive: { color: COLORS.primary },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.primary, marginTop: 2 },
});