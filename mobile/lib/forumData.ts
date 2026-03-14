// ── Shared forum data ─────────────────────────────────────────────────────────
// Both index.tsx and [id].tsx import from here so posts are always in sync.

export interface Comment {
  id: string;
  parentId: string | null;
  username: string;
  timeAgo: string;
  text: string;
  avatarColor: string;
}

export interface Tag {
  id: string;
  label: string;
}

export type ThreadType = 'official' | 'wildfire' | 'prescribed' | 'resource' | 'question';

export interface ForumThread {
  id: string;
  type: ThreadType;
  distance: string;
  // Official / rich-post fields
  title?: string;         // shown on official/pinned posts
  pinned?: boolean;
  authorUsername: string;
  authorDate: string;     // e.g. "Mar 13, 2026 · 6:02 AM" or "6min ago"
  body: string;
  tags: Tag[];
  date: string;           // group label e.g. "Today"
  comments: Comment[];
}

// Label shown in the orange header bar
export const TYPE_LABEL: Record<ThreadType, string> = {
  official:   'Official Notice',
  wildfire:   'Wild Fire',
  prescribed: 'Prescribed Fire',
  resource:   'Resource',
  question:   'Question',
};

// Pinned/official card colours
export const OFFICIAL_STYLE = {
  border: '#FCD34D',
  bg: '#FFFBEB',
  tagBg: '#FEF3C7',
  tagColor: '#B45309',
};

// Shared mutable array — screens mutate comments in-place via React state,
// but the initial seed lives here.
export const FORUM_THREADS: ForumThread[] = [
  {
    id: '1',
    type: 'official',
    distance: '3.24 miles',
    pinned: true,
    title: 'OFFICIAL: Mandatory Evacuation Order – Zone A (Los Angeles County)',
    authorUsername: 'CAL FIRE',
    authorDate: 'Mar 13, 2026 · 6:02 AM',
    body:
      'A mandatory evacuation order is now in effect for all Zone A residents in the affected area of Los Angeles County.\n\nLeave immediately via Highway 1 North. Do not return until the all-clear is issued by local authorities. Emergency services cannot guarantee safety for those who remain.\n\nBring essential medications, documents, and supplies for at least 72 hours.',
    tags: [{ id: 't1', label: 'Official' }],
    date: 'Today',
    comments: [
      {
        id: 'c1',
        parentId: null,
        username: 'CAL FIRE',
        timeAgo: '6:15 AM',
        text: 'Update: Highway 1 South is now also open for evacuation. Use both lanes.',
        avatarColor: '#B45309',
      },
      {
        id: 'c2',
        parentId: null,
        username: 'linda_v',
        timeAgo: '6:22 AM',
        text: 'We just left. Traffic on Hwy 1 is moving slowly past mile 8 but clearing up after that.',
        avatarColor: '#6B7280',
      },
      {
        id: 'c3',
        parentId: 'c2',
        username: 'rescue_patrol',
        timeAgo: '6:30 AM',
        text: 'We have a van running loops for mobility-impaired residents on Elm St. Call 818-555-0192.',
        avatarColor: '#6B7280',
      },
      {
        id: 'c4',
        parentId: null,
        username: 'alex_k',
        timeAgo: '6:41 AM',
        text: 'Is the pet-friendly shelter still at the Fairgrounds? I have two dogs.',
        avatarColor: '#6B7280',
      },
      {
        id: 'c5',
        parentId: 'c4',
        username: 'CAL FIRE',
        timeAgo: '6:50 AM',
        text: 'Yes — the Fairgrounds shelter on Gate 9 accepts dogs and cats. Large animals: call 818-555-0300.',
        avatarColor: '#B45309',
      },
    ],
  },
  {
    id: '2',
    type: 'wildfire',
    distance: '3.24 miles',
    authorUsername: 'the_Real_Fahd_Albinali',
    authorDate: '6min ago',
    body: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
    tags: [
      { id: 't4', label: 'Tag' },
      { id: 't5', label: 'Tag' },
      { id: 't6', label: 'Tag' },
    ],
    date: 'Today',
    comments: [
      {
        id: 'c1',
        parentId: null,
        username: 'the_Real_Fahd_Albinali',
        timeAgo: '6min ago',
        text: 'What a crazy fire! Hope everyone is safe.',
        avatarColor: '#6B7280',
      },
      {
        id: 'c2',
        parentId: 'c1',
        username: 'the_Real_Fahd_Albinali',
        timeAgo: '5min ago',
        text: 'Agreed — stay safe out there.',
        avatarColor: '#6B7280',
      },
    ],
  },
  {
    id: '3',
    type: 'prescribed',
    distance: '3.24 miles',
    authorUsername: 'the_Real_Fahd_Albinali',
    authorDate: '6min ago',
    body: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
    tags: [
      { id: 't7', label: 'Tag' },
      { id: 't8', label: 'Tag' },
      { id: 't9', label: 'Tag' },
    ],
    date: 'Thursday, Month 16th',
    comments: [],
  },
];