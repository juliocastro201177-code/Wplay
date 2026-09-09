export type Gender = 'male' | 'female' | 'other';

export interface ChibiAvatarConfig {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  expression: string;
  outfit: string;
  outfitColor: string;
  accessory?: string;
  headwear?: string;
  glasses?: string;
  aura?: string;
}

export interface User {
  uid: string;
  nickname: string;
  idNumber: string;
  email?: string;
  phone?: string;
  gender: Gender;
  birthDate?: string;
  age?: number;
  city?: string;
  zodiacSign?: string;
  bio?: string;
  avatarConfig: ChibiAvatarConfig;
  avatarUrl?: string;
  frameId: string;
  bannerUrl?: string;
  bubbleId?: string;
  enterEffectId?: string;
  coins: number;
  diamonds: number;
  level: number;
  levelExp?: number;
  wealthLevel: number;
  wealthExp?: number;
  followersCount?: number;
  followingCount?: number;
  friendsCount?: number;
  vip: boolean;
  vipExpire?: string;
  isGuest?: boolean;
  badges?: string[];
  giftsReceived?: Record<string, number>;
  equippedTitle?: string;
  equippedPet?: PetConfig;
  battlePassTier?: number;
  battlePassExp?: number;
  battlePassElite?: boolean;
  honorTitles?: string[];
  weddingCertificate?: WeddingCertificate;
  createdAt?: number;
}

export interface AppPermissions {
  microphone: boolean;
  camera: boolean;
  gallery: boolean;
  notifications: boolean;
  hasPrompted: boolean;
}

export interface Gift {
  id: string;
  name: string;
  category: 'belicos' | 'romanticos' | 'fiesta' | 'ultra' | 'clasicos';
  price: number;
  description: string;
  iconType: string;
  isFullScreen: boolean;
  durationSeconds: number;
  voiceLine?: string;
  accentColor: string;
}

export type RoomTopic = 'amigos' | 'citas' | 'gaming' | 'karaoke' | 'desmadre';
export type RoomCategory = 'friends' | 'dating' | 'gaming' | 'karaoke' | 'desmadre' | 'party' | 'all';

export interface RoomSeat {
  index: number;
  user?: User;
  isMuted: boolean;
  isSpeaking: boolean;
  volume?: number;
  coinsSpentInRoom?: number;
}

export type GameType = 
  | 'draw_and_guess' 
  | 'space_werewolf' 
  | 'who_is_spy' 
  | 'bottle_spin' 
  | 'uno' 
  | 'ludo' 
  | 'karaoke' 
  | 'truth_or_dare'
  | 'word_bomb';

export interface PKBattleState {
  isActive: boolean;
  opponentRoomName: string;
  opponentHost: string;
  ourPoints: number;
  opponentPoints: number;
  timeLeftSeconds: number;
}

export interface Room {
  id: string;
  name: string;
  title?: string;
  category: RoomCategory;
  tag: string;
  hostUid: string;
  hostName: string;
  hostAvatar?: string;
  announcement?: string;
  maxSeats: number;
  seats: RoomSeat[];
  membersCount: number;
  currentGame?: GameType;
  pkBattle?: PKBattleState;
  backgroundTheme?: string;
  isLocked?: boolean;
  password?: string;
  tags?: string[];
}

export interface RoomMessage {
  id: string;
  senderUid: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  bubbleStyle?: string;
}

export interface RoomChatMessage {
  id: string;
  roomId: string;
  senderUid: string;
  senderName: string;
  senderLevel: number;
  senderFrame: string;
  senderBubble: string;
  text: string;
  type: 'chat' | 'system' | 'gift' | 'game' | 'pk';
  giftInfo?: {
    giftId: string;
    giftName: string;
    giftPrice: number;
    count: number;
    receiverName: string;
  };
  timestamp: number;
}

export interface MomentPost {
  id: string;
  author: User;
  text: string;
  timestamp: number;
  likesCount: number;
  commentsCount: number;
  audioDurationSeconds?: number;
  tags: string[];
  imageUrl?: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderUid: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface PrivateConversation {
  id: string;
  targetUser: {
    uid: string;
    nickname: string;
    avatarConfig: ChibiAvatarConfig;
    level: number;
    online: boolean;
  };
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
  isCoupleIslandUnlocked: boolean;
  talkTimeMinutes: number;
}

export interface CoupleRecord {
  id: string;
  user1Uid: string;
  user1Name: string;
  user1AvatarConfig: ChibiAvatarConfig;
  user2Uid: string;
  user2Name: string;
  user2AvatarConfig: ChibiAvatarConfig;
  continuousTalkSeconds: number;
  targetSeconds: number; // 1800 for 30 minutes
  isUnlocked: boolean;
  unlockedAt?: number;
  islandName: string;
  islandTheme: 'sunset_tropical' | 'starlight_neon' | 'cherry_blossom' | 'moonlit_lagoon';
  lovePoints: number;
  loveLevel: number;
  backgroundMusic?: string;
  anniversaryDate?: string;
  relationshipStatus: string;
}

export interface IslandMoment {
  id: string;
  coupleId: string;
  authorUid: string;
  authorName: string;
  title: string;
  text: string;
  date: string;
  timestamp: number;
  likes: number;
  moodEmoji: string;
  imageUrl?: string;
}

export interface IslandChatMessage {
  id: string;
  coupleId: string;
  senderUid: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'text' | 'voice' | 'gift' | 'special_event';
  audioDuration?: number;
  giftName?: string;
  giftIcon?: string;
}

export interface ConversationLog {
  id: string;
  coupleId: string;
  roomName: string;
  user1Uid: string;
  user2Uid: string;
  durationSeconds: number;
  totalAccumulatedSeconds: number;
  timestamp: number;
}

export interface DrawPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  isEnd?: boolean;
}

export interface DrawAndGuessState {
  currentDrawerIndex: number;
  currentWord: string;
  hintMasked: string;
  category: string;
  timeLeft: number;
  round: number;
  maxRounds: number;
  status: 'waiting' | 'drawing' | 'reveal' | 'finished';
  scores: Record<string, number>;
  correctGuessers: string[];
  lines: DrawPoint[];
}

// Who is the Spy Types
export interface SpyPlayer {
  uid: string;
  nickname: string;
  avatarUrl?: string;
  avatarConfig?: ChibiAvatarConfig;
  isSpy: boolean;
  word: string;
  isAlive: boolean;
  clue?: string;
  votesReceived: number;
  hasVoted?: boolean;
}

export interface WhoIsSpyGameData {
  status: 'word_reveal' | 'clue_phase' | 'voting' | 'verdict' | 'spy_guess' | 'finished';
  players: SpyPlayer[];
  activeCluePlayerIndex: number;
  currentRound: number;
  timeLeft: number;
  civilianWord: string;
  spyWord: string;
  winner?: 'civilians' | 'spy';
  eliminatedPlayer?: SpyPlayer;
  spyGuessWord?: string;
  isSpyGuessCorrect?: boolean;
}

// Space Werewolf Types
export type WerewolfRole = 'villager' | 'werewolf' | 'seer' | 'witch';

export interface WerewolfPlayer {
  uid: string;
  nickname: string;
  avatarUrl?: string;
  avatarConfig?: ChibiAvatarConfig;
  role: WerewolfRole;
  isAlive: boolean;
  votesReceived: number;
  hasActed?: boolean;
}

export interface WerewolfGameState {
  phase: 'night_werewolf' | 'night_seer' | 'night_witch' | 'day_announcement' | 'day_discussion' | 'day_voting' | 'verdict' | 'game_over';
  dayNumber: number;
  timeLeft: number;
  players: WerewolfPlayer[];
  nightVictimUid?: string | null;
  witchHealed?: boolean;
  witchPoisonedUid?: string | null;
  witchHasHealPotion: boolean;
  witchHasPoisonPotion: boolean;
  eliminatedUid?: string | null;
  winner?: 'villagers' | 'werewolves';
  log: string[];
}

// WePlay Family / Clan Types
export interface ClanMember {
  uid: string;
  nickname: string;
  avatarUrl?: string;
  role: 'leader' | 'elder' | 'member';
  contributionCoins: number;
  joinedDate: string;
  level: number;
}

export interface WePlayClan {
  id: string;
  name: string;
  tag: string;
  badgeIcon: string;
  badgeColor: string;
  level: number;
  leaderUid: string;
  leaderName: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  totalPowerCP: number;
  ranking: number;
  members: ClanMember[];
  announcement: string;
}

// VIP Entrance Mount Animation
export interface VIPMount {
  id: string;
  name: string;
  icon: string;
  tier: 'silver' | 'gold' | 'diamond' | 'legendary';
  glowColor: string;
  bannerTitle: string;
  soundType: 'engine' | 'bass' | 'win' | 'gift_huge';
}

// WePlay Pets System
export interface PetConfig {
  id: string;
  name: string;
  species: 'cat' | 'dragon' | 'fox' | 'panda' | 'bunny';
  level: number;
  exp: number;
  maxExp: number;
  hunger: number; // 0 - 100
  happiness: number; // 0 - 100
  color: string;
  avatarIcon: string;
  skillName: string;
  bonusCoinRate: number; // e.g. +5% monedas
}

// WePlay Daily Missions & Battle Pass
export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardCoins: number;
  rewardPassExp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  icon: string;
  type: 'room_talk' | 'send_gift' | 'play_game' | 'throw_item' | 'chat_message' | 'wheel_spin';
}

export interface BattlePassTier {
  tier: number;
  requiredExp: number;
  freeReward: { name: string; icon: string; count?: number; type: 'coins' | 'diamonds' | 'badge' };
  eliteReward: { name: string; icon: string; count?: number; type: 'coins' | 'title' | 'mount' | 'frame' | 'bubble' };
}

// WePlay Wedding & Altar System
export interface WeddingCertificate {
  id: string;
  spouse1Name: string;
  spouse2Name: string;
  weddingDate: string;
  ringTier: 'silver' | 'ruby' | 'eternal_diamond';
  ringName: string;
  treeLevel: number;
  treeExp: number;
  treeWaterCountToday: number;
  vows: string;
}

// WePlay Word Bomb (Pasa la Bomba)
export interface WordBombPlayer {
  uid: string;
  nickname: string;
  avatarUrl?: string;
  avatarConfig?: ChibiAvatarConfig;
  lives: number;
  isEliminated: boolean;
}

export interface WordBombGameState {
  status: 'lobby' | 'playing' | 'boom' | 'game_over';
  currentSyllable: string;
  categoryHint: string;
  activePlayerIndex: number;
  timeLeft: number;
  round: number;
  bombFusePercent: number;
  usedWords: string[];
  players: WordBombPlayer[];
  winner?: WordBombPlayer;
  explodedPlayer?: WordBombPlayer;
}

// WePlay Global Megaphone Announcement
export interface GlobalMegaphoneAnnouncement {
  id: string;
  senderUid: string;
  senderName: string;
  senderAvatar?: string;
  senderTitle?: string;
  text: string;
  style: 'golden_rocket' | 'love_heart' | 'neon_dragon';
  timestamp: number;
}

// WePlay Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  uid: string;
  name: string;
  avatarUrl?: string;
  avatarConfig?: ChibiAvatarConfig;
  title?: string;
  score: number;
  scoreLabel: string;
  vip: boolean;
  level: number;
}

