import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import {
  FORUM_THREADS,
  ForumThread,
  Comment,
  TYPE_LABEL,
  OFFICIAL_STYLE,
} from '@/lib/forumData';

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildTree(comments: Comment[]): Array<{ comment: Comment; depth: number }> {
  const result: Array<{ comment: Comment; depth: number }> = [];
  function walk(parentId: string | null, depth: number) {
    comments
      .filter((c) => c.parentId === parentId)
      .forEach((c) => {
        result.push({ comment: c, depth });
        walk(c.id, depth + 1);
      });
  }
  walk(null, 0);
  return result;
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ username, color, size = 34 }: { username: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ color: '#FFF', fontWeight: '700', fontSize: size * 0.38 }}>
        {username[0].toUpperCase()}
      </Text>
    </View>
  );
}

// ── Comment row ───────────────────────────────────────────────────────────────

const INDENT = 24;

function CommentRow({ comment, depth, onReply }: { comment: Comment; depth: number; onReply: (id: string, username: string) => void }) {
  const avatarSize = depth === 0 ? 34 : 28;
  return (
    <View style={{ paddingLeft: depth * INDENT + 14, paddingRight: 14, paddingVertical: 8 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Avatar username={comment.username} color={comment.avatarColor} size={avatarSize} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 }}>
            <Text style={styles.commentUsername}>{comment.username}</Text>
            <Text style={styles.commentDot}> · </Text>
            <Text style={styles.commentTime}>{comment.timeAgo}</Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
          <TouchableOpacity style={styles.replyBtn} onPress={() => onReply(comment.id, comment.username)} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={12} color={Colors.primary} />
            <Text style={styles.replyBtnText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Thread card ───────────────────────────────────────────────────────────────

function ThreadCard({ thread, onPress }: { thread: ForumThread; onPress: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(thread.comments);
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);

  const isOfficial = thread.type === 'official';
  const tree = buildTree(comments);

  const handleReply = (id: string, username: string) => {
    setReplyingToId(id);
    setReplyingToName(username);
    setCommentText(`@${username} `);
    setExpanded(true);
  };

  const handlePost = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setComments((prev) => [...prev, {
      id: `${Date.now()}`,
      parentId: replyingToId,
      username: 'You',
      timeAgo: 'just now',
      text: trimmed,
      avatarColor: Colors.primary,
    }]);
    setCommentText('');
    setReplyingToId(null);
    setReplyingToName(null);
    setExpanded(true);
  };

  return (
    <View style={[styles.card, isOfficial && styles.cardOfficial]}>
      {/* Header bar — official uses amber, others use orange */}
      <TouchableOpacity
        style={[styles.cardHeader, isOfficial && styles.cardHeaderOfficial]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {isOfficial ? (
          <View style={styles.officialHeaderInner}>
            <Ionicons name="pin" size={12} color={OFFICIAL_STYLE.tagColor} />
            <Text style={styles.pinnedLabel}>PINNED NOTICE</Text>
          </View>
        ) : (
          <>
            <Text style={styles.cardHeaderType}>{TYPE_LABEL[thread.type]}</Text>
            <Text style={styles.cardHeaderDistance}>Distance: {thread.distance}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Card body */}
      <TouchableOpacity style={styles.cardBody} onPress={onPress} activeOpacity={0.88}>
        {/* Official tag pill */}
        {isOfficial && (
          <View style={styles.officialTagPill}>
            <Text style={styles.officialTagText}>OFFICIAL</Text>
          </View>
        )}

        {/* Title (official posts) */}
        {isOfficial && thread.title && (
          <Text style={styles.threadTitle}>{thread.title}</Text>
        )}

        {/* Author row */}
        <View style={styles.authorRow}>
          <Avatar username={thread.authorUsername} color={isOfficial ? OFFICIAL_STYLE.tagColor : '#6B7280'} size={36} />
          <View>
            <Text style={styles.authorName}>{thread.authorUsername}</Text>
            <Text style={styles.authorDate}>{thread.authorDate}</Text>
          </View>
        </View>

        <Text style={[styles.fireBody, isOfficial && styles.fireBodyOfficial]}>{thread.body}</Text>

        {/* Tags */}
        {!isOfficial && thread.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {thread.tags.map((tag) => (
              <View key={tag.id} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag.label}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Replying-to banner */}
      {replyingToName && (
        <View style={styles.replyingToBar}>
          <Text style={styles.replyingToText}>
            Replying to <Text style={{ fontWeight: '700' }}>@{replyingToName}</Text>
          </Text>
          <TouchableOpacity onPress={() => { setReplyingToId(null); setReplyingToName(null); setCommentText(''); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}

      {/* Comment input row */}
      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Comment..."
          placeholderTextColor="#9CA3AF"
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handlePost}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        {/* Orange arrow send button */}
        <TouchableOpacity
          style={[styles.sendBtn, !commentText.trim() && { opacity: 0.4 }]}
          onPress={handlePost}
          disabled={!commentText.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chevronBtn} onPress={() => setExpanded((e) => !e)} activeOpacity={0.7}>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Expanded threaded comments */}
      {expanded && (
        <View style={styles.commentsSection}>
          {tree.length === 0 ? (
            <Text style={styles.noComments}>No comments yet. Be the first!</Text>
          ) : (
            tree.map(({ comment, depth }) => (
              <View key={comment.id}>
                <CommentRow comment={comment} depth={depth} onReply={handleReply} />
                <View style={styles.commentDivider} />
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ForumScreen() {
  const router = useRouter();
  const [threads] = useState<ForumThread[]>(FORUM_THREADS);

  const groupOrder: string[] = [];
  const grouped: Record<string, ForumThread[]> = {};
  for (const t of threads) {
    if (!grouped[t.date]) { grouped[t.date] = []; groupOrder.push(t.date); }
    grouped[t.date].push(t);
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.pageTitle}>Community</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {groupOrder.map((group) => (
          <View key={group}>
            <Text style={styles.groupHeader}>{group}</Text>
            {grouped[group].map((thread) => (
              <ThreadCard key={thread.id} thread={thread} onPress={() => router.push(`/forum/${thread.id}` as any)} />
            ))}
          </View>
        ))}
        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/forum/create' as any)} activeOpacity={0.85}>
          <Text style={styles.fabText}>Create Thread</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  pageTitle: { fontSize: 26, fontWeight: '800', color: Colors.primary, textAlign: 'center', paddingTop: 12, paddingBottom: 10, letterSpacing: -0.5 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 8 },
  groupHeader: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 10, marginBottom: 10 },

  // Card
  card: { backgroundColor: '#FDFAF7', borderRadius: 10, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  cardOfficial: { borderColor: OFFICIAL_STYLE.border, borderWidth: 1.5, backgroundColor: OFFICIAL_STYLE.bg },

  // Card header
  cardHeader: { backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  cardHeaderOfficial: { backgroundColor: OFFICIAL_STYLE.bg, borderBottomWidth: 1, borderBottomColor: OFFICIAL_STYLE.border },
  officialHeaderInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pinnedLabel: { fontSize: 11, fontWeight: '700', color: OFFICIAL_STYLE.tagColor, letterSpacing: 0.8 },
  cardHeaderType: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  cardHeaderDistance: { fontSize: 12, fontWeight: '500', color: '#FFFFFF', opacity: 0.92 },

  // Card body
  cardBody: { padding: 14, paddingBottom: 10 },
  officialTagPill: { alignSelf: 'flex-start', backgroundColor: OFFICIAL_STYLE.tagBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  officialTagText: { fontSize: 11, fontWeight: '700', color: OFFICIAL_STYLE.tagColor, letterSpacing: 0.5 },
  threadTitle: { fontSize: 18, fontWeight: '700', color: '#111827', lineHeight: 25, marginBottom: 12, letterSpacing: -0.3 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  authorName: { fontSize: 13, fontWeight: '600', color: '#374151' },
  authorDate: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  fireBody: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginBottom: 12 },
  fireBodyOfficial: { fontSize: 14, color: '#374151', lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#FFFFFF' },
  tagText: { fontSize: 13, color: '#374151', fontWeight: '500' },

  // Replying-to
  replyingToBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF7ED', paddingHorizontal: 14, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#FDE68A' },
  replyingToText: { fontSize: 12, color: '#92400E' },

  // Comment input
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', marginHorizontal: 14, marginVertical: 10, borderRadius: 24, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 8 : 6 },
  commentInput: { flex: 1, fontSize: 13, color: '#374151', padding: 0 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chevronBtn: { padding: 2 },

  // Comments section
  commentsSection: { borderTopWidth: 1, borderTopColor: '#F0EBE3', paddingBottom: 6 },
  commentUsername: { fontSize: 12, fontWeight: '600', color: '#111827' },
  commentDot: { fontSize: 12, color: '#9CA3AF' },
  commentTime: { fontSize: 11, color: '#9CA3AF' },
  commentText: { fontSize: 13, color: '#374151', lineHeight: 19, marginBottom: 4 },
  replyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  replyBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  commentDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 14 },
  noComments: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingVertical: 14 },

  // FAB
  fabContainer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 16 : 12, left: 0, right: 0, alignItems: 'center' },
  fab: { backgroundColor: Colors.primary, borderRadius: 24, paddingVertical: 13, paddingHorizontal: 48, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 6 },
  fabText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 },
});