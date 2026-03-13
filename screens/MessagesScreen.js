import { useState, useRef, useEffect } from 'react';
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
  textPrimary: '#1C1C1E',
  textSecondary: '#8A8A8E',
  border: '#E5E2DC',
  bubbleMe: '#D47C2F',
  bubbleThem: '#E9E9EB',
  online: '#34C759',
};

const CONVERSATIONS = [
  {
    id: 1,
    name: 'Kwame Asante',
    trade: 'Electrician',
    avatar: '👨🏿',
    online: true,
    unread: 2,
    lastMessage: 'I can come by tomorrow at 10am, does that work?',
    timestamp: '2m ago',
    messages: [
      { id: 1, from: 'them', text: 'Hello! I saw your request for electrical work.', time: '9:00 AM' },
      { id: 2, from: 'me',   text: 'Hi Kwame! Yes, I need some wiring done in my kitchen.', time: '9:02 AM' },
      { id: 3, from: 'them', text: 'No problem, I handle that kind of job regularly.', time: '9:03 AM' },
      { id: 4, from: 'me',   text: 'Great! How soon can you come?', time: '9:05 AM' },
      { id: 5, from: 'them', text: 'I can come by tomorrow at 10am, does that work?', time: '9:06 AM' },
    ],
  },
  {
    id: 2,
    name: 'Ama Boateng',
    trade: 'Plumber',
    avatar: '👩🏾',
    online: true,
    unread: 0,
    lastMessage: 'The pipe has been fixed. Please check and confirm.',
    timestamp: '1h ago',
    messages: [
      { id: 1, from: 'me',   text: 'Hi Ama, my kitchen sink is leaking badly.', time: '8:00 AM' },
      { id: 2, from: 'them', text: 'Oh no! I can come over right away.', time: '8:05 AM' },
      { id: 3, from: 'me',   text: 'Please do, it\'s getting worse.', time: '8:06 AM' },
      { id: 4, from: 'them', text: 'On my way, give me 20 minutes.', time: '8:10 AM' },
      { id: 5, from: 'them', text: 'The pipe has been fixed. Please check and confirm.', time: '10:30 AM' },
    ],
  },
  {
    id: 3,
    name: 'Kofi Mensah',
    trade: 'Carpenter',
    avatar: '👨🏾',
    online: false,
    unread: 1,
    lastMessage: 'Here is the quote for the wardrobe: GH₵ 850',
    timestamp: 'Yesterday',
    messages: [
      { id: 1, from: 'me',   text: 'Kofi, I need a custom wardrobe built.', time: 'Yesterday' },
      { id: 2, from: 'them', text: 'Sure! What are the dimensions?', time: 'Yesterday' },
      { id: 3, from: 'me',   text: '2m wide, 2.4m tall, 60cm deep.', time: 'Yesterday' },
      { id: 4, from: 'them', text: 'Here is the quote for the wardrobe: GH₵ 850', time: 'Yesterday' },
    ],
  },
  {
    id: 4,
    name: 'Akosua Frimpong',
    trade: 'Painter',
    avatar: '👩🏿',
    online: false,
    unread: 0,
    lastMessage: 'Thanks for the 5 star review! 🙏',
    timestamp: 'Mon',
    messages: [
      { id: 1, from: 'them', text: 'Job is done! Hope you love the new colours.', time: 'Mon' },
      { id: 2, from: 'me',   text: 'It looks amazing, thank you so much!', time: 'Mon' },
      { id: 3, from: 'them', text: 'Thanks for the 5 star review! 🙏', time: 'Mon' },
    ],
  },
];

// ── Conversation List Item ────────────────────────────────────────────────────
function ConversationItem({ convo, onPress }) {
  return (
    <TouchableOpacity style={styles.convoItem} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar + online dot */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarEmoji}>{convo.avatar}</Text>
        </View>
        {convo.online && <View style={styles.onlineDot} />}
      </View>

      {/* Content */}
      <View style={styles.convoContent}>
        <View style={styles.convoTop}>
          <Text style={styles.convoName}>{convo.name}</Text>
          <Text style={[styles.convoTime, convo.unread > 0 && styles.convoTimeUnread]}>
            {convo.timestamp}
          </Text>
        </View>
        <View style={styles.convoBottom}>
          <Text
            style={[styles.convoPreview, convo.unread > 0 && styles.convoPreviewUnread]}
            numberOfLines={1}
          >
            {convo.lastMessage}
          </Text>
          {convo.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{convo.unread}</Text>
            </View>
          )}
        </View>
        <Text style={styles.convoTrade}>{convo.trade}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Chat Bubble ───────────────────────────────────────────────────────────────
function ChatBubble({ message }) {
  const isMe = message.from === 'me';
  return (
    <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
        {message.time}
      </Text>
    </View>
  );
}

// ── Chat Screen ───────────────────────────────────────────────────────────────
function ChatScreen({ convo, onBack, onSend }) {
  const [messages, setMessages] = useState(convo.messages);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), from: 'me', text: input.trim(), time: 'Now' };
    setMessages(prev => [...prev, newMsg]);
    onSend && onSend(convo.id, newMsg);
    setInput('');
  };

  return (
    <View style={styles.chatContainer}>
      {/* Chat header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <View style={styles.chatAvatarWrapper}>
            <Text style={styles.chatAvatarEmoji}>{convo.avatar}</Text>
            {convo.online && <View style={styles.chatOnlineDot} />}
          </View>
          <View>
            <Text style={styles.chatHeaderName}>{convo.name}</Text>
            <Text style={styles.chatHeaderStatus}>
              {convo.online ? '🟢 Online' : '⚫ Offline'} · {convo.trade}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
          <Text style={styles.callBtnIcon}>✆</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateDivider}>Today</Text>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.chatInput}
            placeholder="Message"
            placeholderTextColor={COLORS.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
            onSubmitEditing={sendMessage}
            onKeyPress={({ nativeEvent }) => { if (nativeEvent?.key === 'Enter') sendMessage(); }}
            blurOnSubmit={false}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, input.trim() ? styles.sendBtnActive : styles.sendBtnInactive]}
          onPress={sendMessage}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnIcon}>↑</Text>
        </TouchableOpacity>
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
export default function MessagesScreen({ navigation }) {
  const [activeTab, setActiveTab]       = useState('home');
  const [openConvo, setOpenConvo]       = useState(null);
  const [conversations, setConversations] = useState(CONVERSATIONS);

  const handleOpenConvo = (convo) => {
    // Mark as read
    setConversations(prev =>
      prev.map(c => c.id === convo.id ? { ...c, unread: 0 } : c)
    );
    setOpenConvo(convo);
  };

  const handleSend = (convoId, newMsg) => {
    setConversations(prev =>
      prev.map(c => c.id === convoId
        ? { ...c, lastMessage: newMsg.text, timestamp: 'Now' }
        : c
      )
    );
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  if (openConvo) {
    return (
      <View style={styles.outerContainer}>
        <ChatScreen
          convo={openConvo}
          onBack={() => setOpenConvo(null)}
          onSend={handleSend}
        />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Text style={styles.headerBackArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Messages</Text>
            {totalUnread > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{totalUnread}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.newMsgBtn} activeOpacity={0.8}>
            <Text style={styles.newMsgIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Conversations */}
        <View style={styles.convoList}>
          {conversations.map((convo, i) => (
            <View key={convo.id}>
              <ConversationItem convo={convo} onPress={() => handleOpenConvo(convo)} />
              {i < conversations.length - 1 && <View style={styles.convoDivider} />}
            </View>
          ))}
        </View>

      </ScrollView>

      <BottomNav active={activeTab} setActive={setActiveTab} navigation={navigation} />
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
  container: { paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 56, paddingBottom: 16,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerBackBtn: { width: 36 },
  headerBackArrow: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  headerBadge: {
    backgroundColor: COLORS.primary, borderRadius: 99,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  newMsgBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.accentLight, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  newMsgIcon: { fontSize: 16 },

  // Search
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, backgroundColor: COLORS.surface,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },

  // Conversation list
  convoList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16, marginHorizontal: 16,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  convoItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 12,
  },
  convoDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 76 },

  // Avatar
  avatarContainer: { position: 'relative', flexShrink: 0 },
  avatarWrapper: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 28 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.online,
    borderWidth: 2, borderColor: COLORS.surface,
  },

  // Conversation content
  convoContent: { flex: 1 },
  convoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  convoName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  convoTime: { fontSize: 11, color: COLORS.textSecondary },
  convoTimeUnread: { color: COLORS.primary, fontWeight: '700' },
  convoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convoPreview: { fontSize: 13, color: COLORS.textSecondary, flex: 1, marginRight: 6 },
  convoPreviewUnread: { color: COLORS.textPrimary, fontWeight: '600' },
  convoTrade: { fontSize: 11, color: COLORS.accent, fontWeight: '600', marginTop: 2 },
  unreadBadge: {
    backgroundColor: COLORS.primary, borderRadius: 99,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },

  // ── Chat screen ──
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    ...(Platform.OS === 'web'
      ? { display: 'flex', flexDirection: 'column', height: '100vh' }
      : {}),
  },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    gap: 10,
  },
  backBtn: { paddingRight: 4 },
  backArrow: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  chatHeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatAvatarWrapper: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  chatAvatarEmoji: { fontSize: 22 },
  chatOnlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.online,
    borderWidth: 2, borderColor: COLORS.surface,
  },
  chatHeaderName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  chatHeaderStatus: { fontSize: 11, color: COLORS.textSecondary },
  callBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  callBtnIcon: { fontSize: 16 },

  // Messages
  messagesContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  dateDivider: {
    textAlign: 'center', fontSize: 11,
    color: COLORS.textSecondary, marginBottom: 16, fontWeight: '600',
  },
  bubbleRow: { marginBottom: 4, maxWidth: '80%' },
  bubbleRowMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleRowThem: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMe: {
    backgroundColor: COLORS.bubbleMe,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: COLORS.bubbleThem,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextMe: { color: '#FFFFFF' },
  bubbleTextThem: { color: COLORS.textPrimary },
  bubbleTime: { fontSize: 10, marginTop: 3, color: COLORS.textSecondary },
  bubbleTimeMe: { alignSelf: 'flex-end' },
  bubbleTimeThem: { alignSelf: 'flex-start' },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    ...(Platform.OS === 'web' ? { position: 'sticky', bottom: 0 } : {}),
  },
  inputWrapper: {
    flex: 1, backgroundColor: COLORS.bg,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 10, minHeight: 40,
    justifyContent: 'center',
  },
  chatInput: { fontSize: 15, color: COLORS.textPrimary, maxHeight: 100 },
  sendBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: COLORS.primary },
  sendBtnInactive: { backgroundColor: COLORS.border },
  sendBtnIcon: { fontSize: 16, color: '#FFFFFF', fontWeight: '800' },

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