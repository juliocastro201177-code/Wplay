import { CoupleRecord, IslandMoment, IslandChatMessage, ConversationLog, ChibiAvatarConfig, AppPermissions } from '../types';

const STORAGE_KEYS = {
  COUPLES: 'weplay_db_couples_v1',
  MOMENTS: 'weplay_db_island_moments_v1',
  CHATS: 'weplay_db_island_chats_v1',
  LOGS: 'weplay_db_conversation_logs_v1',
  PERMISSIONS: 'weplay_app_permissions_v1',
  USER_PHOTOS: 'weplay_user_photos_v1',
};

// Safe localStorage helpers
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Generate normalized couple ID so user1_user2 or user2_user1 always resolve to the same couple
export function getCoupleKey(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('___');
}

// Default initial seeds if user is interacting with Valeria_CDMX
function getInitialCouples(): Record<string, CoupleRecord> {
  return {};
}

function getInitialMoments(): IslandMoment[] {
  return [
    {
      id: 'moment_init_1',
      coupleId: '', // dynamically matched or fallback
      authorUid: 'user_valeria',
      authorName: 'Valeria_CDMX',
      title: '¡Nuestra Primera Tarde en la Isla! 🏝️✨',
      text: 'No puedo creer que hablamos más de 30 minutos sin parar en la sala. ¡El atardecer aquí está increíble! Prométeme que vendremos diario 💖',
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 3600000,
      likes: 12,
      moodEmoji: '🌅',
    },
    {
      id: 'moment_init_2',
      coupleId: '',
      authorUid: 'user_valeria',
      authorName: 'Valeria_CDMX',
      title: 'Cena bajo las estrellas ⭐🍹',
      text: 'Brindando con un cóctel de coco en la cabaña flotante. Nuestro árbol del amor ya está floreciendo.',
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 1800000,
      likes: 8,
      moodEmoji: '🥂',
    },
  ];
}

class DatabaseService {
  private couples: Record<string, CoupleRecord> = {};
  private moments: IslandMoment[] = [];
  private chats: IslandChatMessage[] = [];
  private logs: ConversationLog[] = [];

  constructor() {
    this.couples = getFromStorage(STORAGE_KEYS.COUPLES, getInitialCouples());
    this.moments = getFromStorage(STORAGE_KEYS.MOMENTS, getInitialMoments());
    this.chats = getFromStorage(STORAGE_KEYS.CHATS, []);
    this.logs = getFromStorage(STORAGE_KEYS.LOGS, []);
  }

  /**
   * Get or create a couple record between two users
   */
  public getOrCreateCouple(
    user1Uid: string,
    user1Name: string,
    user1Avatar: ChibiAvatarConfig,
    user2Uid: string,
    user2Name: string,
    user2Avatar: ChibiAvatarConfig
  ): CoupleRecord {
    const coupleKey = getCoupleKey(user1Uid, user2Uid);
    if (!this.couples[coupleKey]) {
      this.couples[coupleKey] = {
        id: coupleKey,
        user1Uid,
        user1Name,
        user1AvatarConfig: user1Avatar,
        user2Uid,
        user2Name,
        user2AvatarConfig: user2Avatar,
        continuousTalkSeconds: 0,
        targetSeconds: 1800, // 30 minutes
        isUnlocked: false,
        islandName: `Isla Secreta de ${user1Name} & ${user2Name}`,
        islandTheme: 'sunset_tropical',
        lovePoints: 100,
        loveLevel: 1,
        relationshipStatus: 'Conectando en Sala de Voz 🎙️',
        anniversaryDate: new Date().toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      saveToStorage(STORAGE_KEYS.COUPLES, this.couples);
    }
    return this.couples[coupleKey];
  }

  public getCoupleById(coupleId: string): CoupleRecord | null {
    return this.couples[coupleId] || null;
  }

  public getCoupleForUsers(uid1: string, uid2: string): CoupleRecord | null {
    const key = getCoupleKey(uid1, uid2);
    return this.couples[key] || null;
  }

  public getAllUnlockedCouples(userUid: string): CoupleRecord[] {
    return Object.values(this.couples).filter(
      (c) => (c.user1Uid === userUid || c.user2Uid === userUid) && c.isUnlocked
    );
  }

  /**
   * Record conversation time (in seconds) between two users in a voice room
   */
  public recordTalkTime(
    user1Uid: string,
    user1Name: string,
    user1Avatar: ChibiAvatarConfig,
    user2Uid: string,
    user2Name: string,
    user2Avatar: ChibiAvatarConfig,
    secondsAdded: number,
    roomName: string
  ): { couple: CoupleRecord; newlyUnlocked: boolean } {
    const couple = this.getOrCreateCouple(
      user1Uid,
      user1Name,
      user1Avatar,
      user2Uid,
      user2Name,
      user2Avatar
    );

    const prevSeconds = couple.continuousTalkSeconds;
    const newTotal = prevSeconds + secondsAdded;
    couple.continuousTalkSeconds = newTotal;

    let newlyUnlocked = false;

    // Check 30 minutes threshold (1800 seconds)
    if (newTotal >= couple.targetSeconds && !couple.isUnlocked) {
      couple.isUnlocked = true;
      couple.unlockedAt = Date.now();
      couple.lovePoints += 500;
      couple.loveLevel = 2;
      couple.relationshipStatus = 'Pareja de Isla Oficial 💖🏝️';
      newlyUnlocked = true;

      // Seed initial island welcome chat
      this.chats.push({
        id: 'chat_welcome_' + Date.now(),
        coupleId: couple.id,
        senderUid: 'system',
        senderName: 'Isla de Parejas WePlay',
        text: `¡Felicidades! Han conversado más de 30 minutos de forma continua. Su Isla de Parejas privada ha sido desbloqueada. 🏝️💍`,
        timestamp: Date.now(),
        type: 'special_event',
      });
      saveToStorage(STORAGE_KEYS.CHATS, this.chats);
    }

    // Update avatar configs if changed
    couple.user1AvatarConfig = user1Avatar;
    couple.user2AvatarConfig = user2Avatar;

    // Save to Database
    this.couples[couple.id] = couple;
    saveToStorage(STORAGE_KEYS.COUPLES, this.couples);

    // Save Database Log entry
    const log: ConversationLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      coupleId: couple.id,
      roomName,
      user1Uid,
      user2Uid,
      durationSeconds: secondsAdded,
      totalAccumulatedSeconds: newTotal,
      timestamp: Date.now(),
    };
    this.logs.unshift(log);
    // Keep max 100 logs
    if (this.logs.length > 100) this.logs = this.logs.slice(0, 100);
    saveToStorage(STORAGE_KEYS.LOGS, this.logs);

    return { couple, newlyUnlocked };
  }

  /**
   * Fast forward conversation for testing (e.g., +5m, +15m or instant 30m unlock)
   */
  public fastForwardTalkTime(
    user1Uid: string,
    user1Name: string,
    user1Avatar: ChibiAvatarConfig,
    user2Uid: string,
    user2Name: string,
    user2Avatar: ChibiAvatarConfig,
    seconds: number,
    roomName: string
  ): { couple: CoupleRecord; newlyUnlocked: boolean } {
    return this.recordTalkTime(
      user1Uid,
      user1Name,
      user1Avatar,
      user2Uid,
      user2Name,
      user2Avatar,
      seconds,
      roomName
    );
  }

  /**
   * Reset conversation time
   */
  public resetTalkTime(user1Uid: string, user2Uid: string): CoupleRecord {
    const coupleKey = getCoupleKey(user1Uid, user2Uid);
    if (this.couples[coupleKey]) {
      this.couples[coupleKey].continuousTalkSeconds = 0;
      this.couples[coupleKey].isUnlocked = false;
      this.couples[coupleKey].unlockedAt = undefined;
      saveToStorage(STORAGE_KEYS.COUPLES, this.couples);
    }
    return this.couples[coupleKey];
  }

  /**
   * Update Island Settings (Theme, Name, Music)
   */
  public updateIslandSettings(coupleId: string, updates: Partial<CoupleRecord>): CoupleRecord {
    if (this.couples[coupleId]) {
      this.couples[coupleId] = { ...this.couples[coupleId], ...updates };
      saveToStorage(STORAGE_KEYS.COUPLES, this.couples);
      return this.couples[coupleId];
    }
    throw new Error('Couple not found');
  }

  /**
   * Island Moments (Private Feed)
   */
  public getIslandMoments(coupleId: string): IslandMoment[] {
    return this.moments.filter((m) => m.coupleId === coupleId || m.coupleId === '');
  }

  public addIslandMoment(
    coupleId: string,
    authorUid: string,
    authorName: string,
    title: string,
    text: string,
    moodEmoji: string = '💖',
    imageUrl?: string
  ): IslandMoment {
    const newMoment: IslandMoment = {
      id: 'moment_' + Date.now(),
      coupleId,
      authorUid,
      authorName,
      title,
      text,
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      likes: 1,
      moodEmoji,
      imageUrl,
    };
    this.moments.unshift(newMoment);
    saveToStorage(STORAGE_KEYS.MOMENTS, this.moments);

    // Give love points
    if (this.couples[coupleId]) {
      this.couples[coupleId].lovePoints += 50;
      saveToStorage(STORAGE_KEYS.COUPLES, this.couples);
    }

    return newMoment;
  }

  public likeIslandMoment(momentId: string, coupleId: string): void {
    const moment = this.moments.find((m) => m.id === momentId);
    if (moment) {
      moment.likes += 1;
      saveToStorage(STORAGE_KEYS.MOMENTS, this.moments);

      if (this.couples[coupleId]) {
        this.couples[coupleId].lovePoints += 10;
        saveToStorage(STORAGE_KEYS.COUPLES, this.couples);
      }
    }
  }

  /**
   * Island Private Chat
   */
  public getIslandChats(coupleId: string): IslandChatMessage[] {
    return this.chats.filter((c) => c.coupleId === coupleId);
  }

  public sendIslandChat(
    coupleId: string,
    senderUid: string,
    senderName: string,
    text: string,
    type: 'text' | 'voice' | 'gift' | 'special_event' = 'text',
    giftInfo?: { name: string; icon: string }
  ): IslandChatMessage {
    const msg: IslandChatMessage = {
      id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      coupleId,
      senderUid,
      senderName,
      text,
      timestamp: Date.now(),
      type,
      giftName: giftInfo?.name,
      giftIcon: giftInfo?.icon,
    };
    this.chats.push(msg);
    saveToStorage(STORAGE_KEYS.CHATS, this.chats);

    // Increase love points
    if (this.couples[coupleId]) {
      this.couples[coupleId].lovePoints += type === 'gift' ? 100 : 5;
      saveToStorage(STORAGE_KEYS.COUPLES, this.couples);
    }

    return msg;
  }

  /**
   * Get Conversation Logs (Database verification / telemetry)
   */
  public getConversationLogs(coupleId?: string): ConversationLog[] {
    if (!coupleId) return this.logs;
    return this.logs.filter((l) => l.coupleId === coupleId);
  }

  /**
   * App Permissions Status (Microphone, Camera, Gallery, Notifications)
   */
  public getAppPermissions(): AppPermissions {
    return getFromStorage<AppPermissions>(STORAGE_KEYS.PERMISSIONS, {
      microphone: false,
      camera: false,
      gallery: false,
      notifications: false,
      hasPrompted: false,
    });
  }

  public saveAppPermissions(permissions: AppPermissions): void {
    saveToStorage(STORAGE_KEYS.PERMISSIONS, permissions);
  }

  /**
   * User Avatar & Banner persistence (Simulating Firebase Storage / Firestore paths:
   * /avatars/{uid}.jpg & /banners/{uid}.jpg)
   */
  public saveUserAvatar(uid: string, avatarUrl: string): { storagePath: string; firestoreSaved: boolean } {
    const photos = getFromStorage<Record<string, { avatarUrl?: string; bannerUrl?: string }>>(
      STORAGE_KEYS.USER_PHOTOS,
      {}
    );
    if (!photos[uid]) photos[uid] = {};
    photos[uid].avatarUrl = avatarUrl;
    saveToStorage(STORAGE_KEYS.USER_PHOTOS, photos);
    return {
      storagePath: `/avatars/${uid}.jpg`,
      firestoreSaved: true,
    };
  }

  public saveUserBanner(uid: string, bannerUrl: string): { storagePath: string; firestoreSaved: boolean } {
    const photos = getFromStorage<Record<string, { avatarUrl?: string; bannerUrl?: string }>>(
      STORAGE_KEYS.USER_PHOTOS,
      {}
    );
    if (!photos[uid]) photos[uid] = {};
    photos[uid].bannerUrl = bannerUrl;
    saveToStorage(STORAGE_KEYS.USER_PHOTOS, photos);
    return {
      storagePath: `/banners/${uid}.jpg`,
      firestoreSaved: true,
    };
  }

  public getUserSavedPhotos(uid: string): { avatarUrl?: string; bannerUrl?: string } {
    const photos = getFromStorage<Record<string, { avatarUrl?: string; bannerUrl?: string }>>(
      STORAGE_KEYS.USER_PHOTOS,
      {}
    );
    return photos[uid] || {};
  }

  public getDatabaseSummary() {
    return {
      totalCouples: Object.keys(this.couples).length,
      unlockedIslands: Object.values(this.couples).filter((c) => c.isUnlocked).length,
      totalConversationLogs: this.logs.length,
      totalMoments: this.moments.length,
      totalChats: this.chats.length,
      couples: Object.values(this.couples),
      recentLogs: this.logs.slice(0, 15),
    };
  }
}

export const db = new DatabaseService();
