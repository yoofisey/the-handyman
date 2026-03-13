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
  success: '#2E9E5B',
  successLight: '#EBF8F1',
  warning: '#E6A117',
  warningLight: '#FEF8EC',
  danger: '#E04444',
  dangerLight: '#FDEAEA',
};

const JOBS = [
  {
    id: 1,
    client: 'Kofi Acheampong',
    clientAvatar: '👨🏾',
    type: 'Electrical Repair',
    location: 'East Legon, Accra',
    date: 'Today, 2:00 PM',
    status: 'active',
    amount: 'GH₵ 350',
  },
  {
    id: 2,
    client: 'Abena Mensah',
    clientAvatar: '👩🏿',
    type: 'Wiring Installation',
    location: 'Tema, Accra',
    date: 'Tomorrow, 10:00 AM',
    status: 'pending',
    amount: 'GH₵ 620',
  },
  {
    id: 3,
    client: 'Yaw Frimpong',
    clientAvatar: '👨🏿',
    type: 'Socket Replacement',
    location: 'Kasoa',
    date: 'Fri, 9:00 AM',
    status: 'pending',
    amount: 'GH₵ 180',
  },
  {
    id: 4,
    client: 'Ama Darko',
    clientAvatar: '👩🏾',
    type: 'Generator Service',
    location: 'Spintex, Accra',
    date: 'Sat, 8:00 AM',
    status: 'completed',
    amount: 'GH₵ 450',
  },
];

const QUICK_ACTIONS = [
  { icon: '📅', label: 'Set Availability' },
  { icon: '📋', label: 'View My Jobs'     },
  { icon: '💬', label: 'Messages'         },
  { icon: '◉', label: 'Edit Profile'     },
];

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: COLORS.success, bg: COLORS.successLight },
  pending:   { label: 'Pending',   color: COLORS.warning, bg: COLORS.warningLight },
  completed: { label: 'Completed', color: COLORS.textSecondary, bg: COLORS.bg },
};

// ── Splash overlay ────────────────────────────────────────────────────────────
function SplashOverlay({ visible }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 600,
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

// ── Status chip ───────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.statusChip, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job }) {
  return (
    <View style={styles.jobCard}>
      <View style={styles.jobTop}>
        <View style={styles.clientRow}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarEmoji}>{job.clientAvatar}</Text>
          </View>
          <View>
            <Text style={styles.clientName}>{job.client}</Text>
            <Text style={styles.jobType}>{job.type}</Text>
          </View>
        </View>
        <StatusChip status={job.status} />
      </View>

      <View style={styles.jobMeta}>
        <Text style={styles.jobMetaText}>📍 {job.location}</Text>
        <Text style={styles.jobMetaText}>🕐 {job.date}</Text>
      </View>

      <View style={styles.jobBottom}>
        <Text style={styles.jobAmount}>{job.amount}</Text>
        <View style={styles.jobActions}>
          {job.status !== 'completed' && (
            <TouchableOpacity style={styles.jobBtnOutline} activeOpacity={0.8}>
              <Text style={styles.jobBtnOutlineText}>Decline</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.jobBtnFill} activeOpacity={0.85}>
            <Text style={styles.jobBtnFillText}>
              {job.status === 'completed' ? 'View' : job.status === 'active' ? 'Manage' : 'Accept'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
export default function ArtisanHomeScreen({ navigation, route }) {
  const userName = route?.params?.name || 'there';
  const [activeTab, setActiveTab] = useState('home');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const filters = ['all', 'active', 'pending', 'completed'];
  const filteredJobs = activeFilter === 'all'
    ? JOBS
    : JOBS.filter((j) => j.status === activeFilter);

  const activeCount  = JOBS.filter((j) => j.status === 'active').length;
  const pendingCount = JOBS.filter((j) => j.status === 'pending').length;

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
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
              <Text style={styles.iconBtnText}>⌖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Messages')} activeOpacity={0.8}>
              <Text style={styles.iconBtnText}>⟶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Status Banner ── */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBannerLeft}>
            <View style={styles.availableDot} />
            <Text style={styles.statusBannerText}>You're available for jobs</Text>
          </View>
          <TouchableOpacity style={styles.toggleAvailBtn}>
            <Text style={styles.toggleAvailText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* ── Job Summary Chips ── */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.successLight }]}>
            <Text style={[styles.summaryCount, { color: COLORS.success }]}>{activeCount}</Text>
            <Text style={[styles.summaryLabel, { color: COLORS.success }]}>Active</Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.warningLight }]}>
            <Text style={[styles.summaryCount, { color: COLORS.warning }]}>{pendingCount}</Text>
            <Text style={[styles.summaryLabel, { color: COLORS.warning }]}>Pending</Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: COLORS.accentLight }]}>
            <Text style={[styles.summaryCount, { color: COLORS.primary }]}>GH₵ 1,600</Text>
            <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>This Week</Text>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionBtn} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Jobs ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Jobs</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

      </ScrollView>

      <BottomNav active={activeTab} setActive={setActiveTab} navigation={navigation} />
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

  // Splash
  splashOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', zIndex: 99,
  },
  splashEmoji: { fontSize: 72 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  greeting: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  userName: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  iconBtnText: { fontSize: 20, color: COLORS.primary, fontWeight: '600' },

  // Status banner
  statusBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.successLight, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 16, borderWidth: 1, borderColor: '#C3EDD6',
  },
  statusBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  availableDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  statusBannerText: { fontSize: 13, fontWeight: '600', color: COLORS.success },
  toggleAvailBtn: {
    backgroundColor: COLORS.success, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  toggleAvailText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  // Summary chips
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  summaryChip: {
    flex: 1, borderRadius: 14, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryCount: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  summaryLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },

  // Quick actions
  quickActions: {
    flexDirection: 'row', gap: 10, marginBottom: 24,
  },
  actionBtn: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },

  // Section
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  seeAll: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },

  // Filter pills
  filterScroll: { marginBottom: 14 },
  filterContent: { gap: 8, paddingRight: 4 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 99,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#FFFFFF' },

  // Job card
  jobCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  jobTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
  },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  clientAvatar: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  clientAvatarEmoji: { fontSize: 24 },
  clientName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  jobType: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  statusChip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },

  jobMeta: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  jobMetaText: { fontSize: 12, color: COLORS.textSecondary },

  jobBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  jobAmount: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  jobActions: { flexDirection: 'row', gap: 8 },
  jobBtnOutline: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    paddingVertical: 7, paddingHorizontal: 14,
  },
  jobBtnOutlineText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  jobBtnFill: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingVertical: 7, paddingHorizontal: 14,
  },
  jobBtnFillText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

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