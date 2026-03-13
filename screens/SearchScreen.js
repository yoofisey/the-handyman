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
  mapBg: '#E8F0E8',
};

const ARTISANS = [
  { id: 1,  name: 'Kwame Asante',    trade: 'Electrician',      rating: 4.9, reviews: 124, avatar: '👨🏿', location: 'East Legon',  lat: 0.32,  lng: 0.18  },
  { id: 2,  name: 'Ama Boateng',     trade: 'Plumber',          rating: 4.8, reviews: 98,  avatar: '👩🏾', location: 'Osu',         lat: 0.12,  lng: 0.55  },
  { id: 3,  name: 'Kofi Mensah',     trade: 'Carpenter',        rating: 4.8, reviews: 87,  avatar: '👨🏾', location: 'Tema',        lat: 0.62,  lng: 0.72  },
  { id: 4,  name: 'Akosua Frimpong', trade: 'Painter',          rating: 4.7, reviews: 76,  avatar: '👩🏿', location: 'Lapaz',       lat: 0.22,  lng: 0.35  },
  { id: 5,  name: 'Yaw Darko',       trade: 'Mason',            rating: 4.7, reviews: 65,  avatar: '👨🏿', location: 'Kasoa',       lat: 0.75,  lng: 0.25  },
  { id: 6,  name: 'Abena Osei',      trade: 'Tiler',            rating: 4.6, reviews: 54,  avatar: '👩🏾', location: 'Spintex',     lat: 0.45,  lng: 0.80  },
  { id: 7,  name: 'Fiifi Appiah',    trade: 'Roofer',           rating: 4.6, reviews: 48,  avatar: '👨🏾', location: 'Adenta',      lat: 0.55,  lng: 0.42  },
  { id: 8,  name: 'Efua Asare',      trade: 'General Handyman', rating: 4.5, reviews: 41,  avatar: '👩🏿', location: 'Achimota',    lat: 0.35,  lng: 0.60  },
  { id: 9,  name: 'Nana Amponsah',   trade: 'Welder',           rating: 4.5, reviews: 38,  avatar: '👨🏾', location: 'Kaneshie',    lat: 0.18,  lng: 0.70  },
  { id: 10, name: 'Adwoa Sarpong',   trade: 'Electrician',      rating: 4.4, reviews: 33,  avatar: '👩🏿', location: 'Madina',      lat: 0.68,  lng: 0.50  },
];

const TRADES = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'Welder', 'Tiler', 'Roofer', 'General Handyman'];
const RATINGS = ['Any', '4.5+', '4.7+', '4.9+'];

function Stars({ rating }) {
  return (
    <Text style={styles.stars}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </Text>
  );
}

// ── List Card ─────────────────────────────────────────────────────────────────
function ArtisanCard({ artisan, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.avatarWrapper}>
        <Text style={styles.avatarEmoji}>{artisan.avatar}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.artisanName}>{artisan.name}</Text>
        <Text style={styles.artisanTrade}>{artisan.trade}</Text>
        <View style={styles.ratingRow}>
          <Stars rating={artisan.rating} />
          <Text style={styles.ratingNumber}>{artisan.rating}</Text>
          <Text style={styles.reviewCount}>({artisan.reviews})</Text>
        </View>
        <Text style={styles.artisanLocation}>📍 {artisan.location}</Text>
      </View>
      <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
        <Text style={styles.bookBtnText}>Book</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Map Pin ───────────────────────────────────────────────────────────────────
function MapPin({ artisan, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.mapPin,
        { left: `${artisan.lng * 100}%`, top: `${artisan.lat * 100}%` },
        selected && styles.mapPinSelected,
      ]}
      activeOpacity={0.85}
    >
      <Text style={styles.mapPinEmoji}>{artisan.avatar}</Text>
      {selected && (
        <View style={styles.mapPinLabel}>
          <Text style={styles.mapPinName} numberOfLines={1}>{artisan.name}</Text>
          <Text style={styles.mapPinTrade}>{artisan.trade}</Text>
        </View>
      )}
    </TouchableOpacity>
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
            if (tab.key === 'home') navigation.navigate('Home');
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
export default function SearchScreen({ navigation }) {
  const [query, setQuery]             = useState('');
  const [activeTrade, setActiveTrade] = useState('All');
  const [activeRating, setActiveRating] = useState('Any');
  const [viewMode, setViewMode]       = useState('list'); // 'list' | 'map'
  const [activeTab, setActiveTab]     = useState('search');
  const [selectedPin, setSelectedPin] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    return ARTISANS.filter((a) => {
      const matchQuery = query.trim() === '' ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.trade.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase());
      const matchTrade  = activeTrade === 'All' || a.trade === activeTrade;
      const matchRating =
        activeRating === 'Any' ? true :
        activeRating === '4.5+' ? a.rating >= 4.5 :
        activeRating === '4.7+' ? a.rating >= 4.7 :
        a.rating >= 4.9;
      return matchQuery && matchTrade && matchRating;
    });
  }, [query, activeTrade, activeRating]);

  return (
    <View style={styles.outerContainer}>

      {/* ── Top bar (always visible) ── */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Find an Artisan</Text>

        {/* Search input */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, trade or area..."
              placeholderTextColor={COLORS.textSecondary}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Text style={styles.clearBtn}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterToggleBtn, showFilters && styles.filterToggleBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterToggleIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Filters (expandable) */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            <Text style={styles.filterLabel}>Trade</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {TRADES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.filterPill, activeTrade === t && styles.filterPillActive]}
                  onPress={() => setActiveTrade(t)}
                >
                  <Text style={[styles.filterPillText, activeTrade === t && styles.filterPillTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.filterLabel}>Min. Rating</Text>
            <View style={styles.ratingRow}>
              {RATINGS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.ratingPill, activeRating === r && styles.filterPillActive]}
                  onPress={() => setActiveRating(r)}
                >
                  <Text style={[styles.filterPillText, activeRating === r && styles.filterPillTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results count + view toggle */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>{results.length} artisan{results.length !== 1 ? 's' : ''} found</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>☰ List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleBtn, viewMode === 'map' && styles.viewToggleBtnActive]}
              onPress={() => setViewMode('map')}
            >
              <Text style={[styles.viewToggleText, viewMode === 'map' && styles.viewToggleTextActive]}>🗺 Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {results.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>⌕</Text>
              <Text style={styles.emptyTitle}>No artisans found</Text>
              <Text style={styles.emptyText}>Try a different search or adjust your filters</Text>
            </View>
          ) : (
            results.map((a) => (
              <ArtisanCard key={a.id} artisan={a} onPress={() => {}} />
            ))
          )}
        </ScrollView>
      )}

      {/* ── Map View ── */}
      {viewMode === 'map' && (
        <View style={styles.mapContainer}>
          {/* Fake map background */}
          <View style={styles.mapBg}>
            {/* Grid lines to simulate map */}
            {[...Array(6)].map((_, i) => (
              <View key={`h${i}`} style={[styles.mapGridH, { top: `${i * 20}%` }]} />
            ))}
            {[...Array(6)].map((_, i) => (
              <View key={`v${i}`} style={[styles.mapGridV, { left: `${i * 20}%` }]} />
            ))}
            {/* Area labels */}
            <Text style={[styles.mapAreaLabel, { top: '8%', left: '15%' }]}>East Legon</Text>
            <Text style={[styles.mapAreaLabel, { top: '10%', left: '52%' }]}>Osu</Text>
            <Text style={[styles.mapAreaLabel, { top: '60%', left: '68%' }]}>Tema</Text>
            <Text style={[styles.mapAreaLabel, { top: '20%', left: '30%' }]}>Lapaz</Text>
            <Text style={[styles.mapAreaLabel, { top: '72%', left: '20%' }]}>Kasoa</Text>
            <Text style={[styles.mapAreaLabel, { top: '43%', left: '76%' }]}>Spintex</Text>
            <Text style={[styles.mapAreaLabel, { top: '53%', left: '38%' }]}>Adenta</Text>
            <Text style={[styles.mapAreaLabel, { top: '33%', left: '56%' }]}>Achimota</Text>

            {/* Pins */}
            {results.map((a) => (
              <MapPin
                key={a.id}
                artisan={a}
                selected={selectedPin === a.id}
                onPress={() => setSelectedPin(selectedPin === a.id ? null : a.id)}
              />
            ))}
          </View>

          {/* Selected artisan card at bottom */}
          {selectedPin && (() => {
            const a = results.find(x => x.id === selectedPin);
            return a ? (
              <View style={styles.mapCardWrapper}>
                <ArtisanCard artisan={a} onPress={() => {}} />
              </View>
            ) : null;
          })()}
        </View>
      )}

      <BottomNav active={activeTab} setActive={setActiveTab} navigation={navigation} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: COLORS.bg,
    ...(Platform.OS === 'web'
      ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }
      : { flex: 1 }),
  },

  // Top bar
  topBar: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 18, paddingTop: 56, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  pageTitle: {
    fontSize: 24, fontWeight: '800', color: COLORS.textPrimary,
    letterSpacing: -0.5, marginBottom: 14,
  },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 12, paddingVertical: 11,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  clearBtn: { fontSize: 14, color: COLORS.textSecondary, paddingLeft: 8 },
  filterToggleBtn: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  filterToggleBtnActive: { backgroundColor: COLORS.accentLight, borderColor: COLORS.accent },
  filterToggleIcon: { fontSize: 18 },

  // Filters panel
  filtersPanel: {
    backgroundColor: COLORS.surface, borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  filterLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.textSecondary,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8,
  },
  filterScroll: { marginBottom: 12 },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
    backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border,
    marginRight: 8,
  },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterPillText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterPillTextActive: { color: '#FFFFFF' },
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingPill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
    backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border,
  },

  // Results bar
  resultsBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 4,
  },
  resultsCount: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  viewToggle: {
    flexDirection: 'row', backgroundColor: COLORS.border,
    borderRadius: 8, padding: 3,
  },
  viewToggleBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  viewToggleBtnActive: { backgroundColor: COLORS.surface },
  viewToggleText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  viewToggleTextActive: { color: COLORS.primary },

  // List
  listContainer: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },

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
  artisanName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 1 },
  artisanTrade: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  stars: { fontSize: 11, color: '#F5A623' },
  ratingNumber: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  reviewCount: { fontSize: 11, color: COLORS.textSecondary },
  artisanLocation: { fontSize: 11, color: COLORS.textSecondary },
  bookBtn: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 16, flexShrink: 0,
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Map
  mapContainer: {
    flex: 1,
    ...(Platform.OS === 'web' ? { flexGrow: 1, position: 'relative' } : {}),
  },
  mapBg: {
    flex: 1, backgroundColor: COLORS.mapBg,
    position: 'relative', overflow: 'hidden',
    ...(Platform.OS === 'web' ? { height: '100%' } : {}),
  },
  mapGridH: {
    position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  mapGridV: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  mapAreaLabel: {
    position: 'absolute', fontSize: 10,
    color: 'rgba(0,0,0,0.35)', fontWeight: '600',
  },
  mapPin: {
    position: 'absolute',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    alignItems: 'center',
    zIndex: 1,
  },
  mapPinSelected: { zIndex: 10 },
  mapPinEmoji: {
    fontSize: 28,
    backgroundColor: COLORS.surface,
    borderRadius: 99, overflow: 'hidden',
    borderWidth: 2, borderColor: COLORS.primary,
    padding: 2,
  },
  mapPinLabel: {
    backgroundColor: COLORS.surface, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4, marginTop: 2,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  mapPinName: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary },
  mapPinTrade: { fontSize: 10, color: COLORS.textSecondary },
  mapCardWrapper: {
    position: 'absolute', bottom: 80, left: 18, right: 18,
    ...(Platform.OS === 'web' ? { position: 'absolute' } : {}),
  },

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