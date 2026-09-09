import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Gift as GiftIcon, 
  Gamepad2, 
  MessageCircle, 
  Share2, 
  LogOut, 
  Flame, 
  Music, 
  Send, 
  Crown, 
  Swords, 
  Sparkles, 
  MoreVertical,
  Smile,
  Shield,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Room, User, RoomSeat, RoomMessage, Gift, GameType, CoupleRecord } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { ALL_GIFTS } from '../../data/giftsData';
import { playSound } from '../../utils/audio';
import { db } from '../../services/databaseService';
import { VIPMountEntranceBanner, DEFAULT_MOUNTS } from './VIPMountEntranceBanner';
import { RedPacketModal } from './RedPacketModal';
import { SoundboardDrawer } from './SoundboardDrawer';
import { SeatInteractionModal } from './SeatInteractionModal';

interface VoicePartyRoomProps {
  room: Room;
  currentUser: User;
  onLeaveRoom: () => void;
  onOpenGiftSelector: () => void;
  onOpenGamesModal: () => void;
  onOpenUserProfile: (user: User) => void;
  onStartPKBattle: () => void;
  onOpenCoupleIsland?: (couple: CoupleRecord) => void;
  onCoupleUnlocked?: (couple: CoupleRecord) => void;
  onRewardCoins?: (amount: number) => void;
  activePKBattle: {
    user1: User;
    user2: User;
    points1: number;
    points2: number;
    timeLeft: number;
  } | null;
}

export const VoicePartyRoom: React.FC<VoicePartyRoomProps> = ({
  room,
  currentUser,
  onLeaveRoom,
  onOpenGiftSelector,
  onOpenGamesModal,
  onOpenUserProfile,
  onStartPKBattle,
  onOpenCoupleIsland,
  onCoupleUnlocked,
  onRewardCoins,
  activePKBattle,
}) => {
  // Voice Controls
  const [isMicOn, setIsMicOn] = useState(false);
  const [isMutedAll, setIsMutedAll] = useState(false);
  const [speakingUserUids, setSpeakingUserUids] = useState<string[]>([]);

  // Room Seats State (8 seats)
  const [seats, setSeats] = useState<RoomSeat[]>([
    {
      index: 0,
      user: currentUser,
      isMuted: false,
      isSpeaking: false,
      coinsSpentInRoom: 1500,
    },
    {
      index: 1,
      user: {
        uid: 'user_valeria',
        nickname: 'Valeria_CDMX',
        gender: 'female',
        avatarConfig: {
          skinColor: '#FFDFBA',
          hairStyle: 'long_straight',
          hairColor: '#78350F',
          expression: 'wink',
          outfit: 'suit_vip',
          outfitColor: '#BE185D',
          headwear: 'golden_crown',
          glasses: 'none',
          accessory: 'diamond_earring',
        },
        coins: 12000,
        diamonds: 450,
        level: 32,
        vip: true,
        frameId: 'vip_gold',
        wealthLevel: 14,
        friendsCount: 210,
        followingCount: 340,
        followersCount: 1980,
      },
      isMuted: false,
      isSpeaking: true,
      coinsSpentInRoom: 3400,
    },
    {
      index: 2,
      user: {
        uid: 'user_belico',
        nickname: 'El_Compa_Bélico',
        gender: 'male',
        avatarConfig: {
          skinColor: '#E0AC69',
          hairStyle: 'curly_buchon',
          hairColor: '#18181B',
          expression: 'cool',
          outfit: 'belicon_jacket',
          outfitColor: '#059669',
          headwear: 'jgl_cap',
          glasses: 'sunglasses_vip',
          accessory: 'gold_chain',
        },
        coins: 45000,
        diamonds: 1800,
        level: 45,
        vip: true,
        frameId: 'vip_dragon_fire',
        wealthLevel: 22,
        friendsCount: 450,
        followingCount: 120,
        followersCount: 5200,
      },
      isMuted: false,
      isSpeaking: false,
      coinsSpentInRoom: 12500,
    },
    {
      index: 3,
      user: {
        uid: 'user_sofia',
        nickname: 'Sofia_Gdl',
        gender: 'female',
        avatarConfig: {
          skinColor: '#FBD1A2',
          hairStyle: 'anime_spiky',
          hairColor: '#FF2E9D',
          expression: 'happy',
          outfit: 'neon_hoodie',
          outfitColor: '#FF2E9D',
          headwear: 'none',
          glasses: 'none',
          accessory: 'diamond_earring',
        },
        coins: 8200,
        diamonds: 120,
        level: 18,
        vip: false,
        frameId: 'default',
        wealthLevel: 6,
        friendsCount: 140,
        followingCount: 220,
        followersCount: 890,
      },
      isMuted: false,
      isSpeaking: false,
      coinsSpentInRoom: 800,
    },
    { index: 4, isMuted: false, isSpeaking: false },
    { index: 5, isMuted: false, isSpeaking: false },
    { index: 6, isMuted: false, isSpeaking: false },
    { index: 7, isMuted: false, isSpeaking: false },
  ]);

  // Mount entrance animation state
  const [activeMountIndex, setActiveMountIndex] = useState<number | null>(0); // Show on room enter!

  // Chat Messages
  const [messages, setMessages] = useState<RoomMessage[]>([
    {
      id: 'm1',
      senderUid: 'system',
      senderName: 'Sistema WePlay LATAM',
      text: '¡Bienvenidos a la sala! Respeten las normas comunitarias.',
      timestamp: Date.now() - 60000,
      isSystem: true,
    },
    {
      id: 'm2',
      senderUid: 'user_valeria',
      senderName: 'Valeria_CDMX',
      text: '¡Hola a todos los que van llegando! Pongan rolas chidas 🎶',
      timestamp: Date.now() - 40000,
      bubbleStyle: 'bubble_pink_neon',
    },
    {
      id: 'm3',
      senderUid: 'user_belico',
      senderName: 'El_Compa_Bélico',
      text: 'Aquí andamos al 100 compadre, listos pal Draw & Guess 🚗💨',
      timestamp: Date.now() - 20000,
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // WePlay Interactive Room Additions: Red Packets, Soundboard & Item Throwing
  const [showRedPacketModal, setShowRedPacketModal] = useState(false);
  const [activeRedPacket, setActiveRedPacket] = useState<{ id: string; total: number; count: number; sender: string } | null>(null);
  const [claimedRedPacket, setClaimedRedPacket] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [interactionSeat, setInteractionSeat] = useState<RoomSeat | null>(null);
  const [floatingReaction, setFloatingReaction] = useState<{ id: string; emoji: string; text: string } | null>(null);
  const [thrownItemAnimation, setThrownItemAnimation] = useState<{ id: string; emoji: string; targetName: string } | null>(null);

  // Active Conversation Partner in Room (defaults to Valeria_CDMX in seat 1)
  const defaultPartner: User = {
    uid: 'user_valeria',
    idNumber: '7193821',
    nickname: 'Valeria_CDMX',
    gender: 'female',
    avatarConfig: {
      skinColor: '#FFDFBA',
      hairStyle: 'long_straight',
      hairColor: '#78350F',
      expression: 'wink',
      outfit: 'suit_vip',
      outfitColor: '#BE185D',
      headwear: 'golden_crown',
      glasses: 'none',
      accessory: 'diamond_earring',
    },
    coins: 12000,
    diamonds: 450,
    level: 32,
    vip: true,
    frameId: 'vip_gold',
    wealthLevel: 14,
  };

  const [partnerUser, setPartnerUser] = useState<User>(defaultPartner);
  const [coupleState, setCoupleState] = useState<CoupleRecord>(() => {
    return db.getOrCreateCouple(
      currentUser.uid,
      currentUser.nickname,
      currentUser.avatarConfig,
      defaultPartner.uid,
      defaultPartner.nickname,
      defaultPartner.avatarConfig
    );
  });

  // Real-time conversation tracking timer: continuously accumulates talk seconds in the database
  useEffect(() => {
    const timer = setInterval(() => {
      // Record 1 second of live voice conversation in database
      const result = db.recordTalkTime(
        currentUser.uid,
        currentUser.nickname,
        currentUser.avatarConfig,
        partnerUser.uid,
        partnerUser.nickname,
        partnerUser.avatarConfig,
        1,
        room.name
      );

      setCoupleState(result.couple);

      if (result.newlyUnlocked) {
        playSound('romance');
        confetti({ particleCount: 100, spread: 80 });
        if (onCoupleUnlocked) {
          onCoupleUnlocked(result.couple);
        }

        // Add room announcement
        setMessages((prev) => [
          ...prev,
          {
            id: 'unlocked_' + Date.now(),
            senderUid: 'system',
            senderName: 'Sistema WePlay Isla de Parejas',
            text: `🎉 ¡Felicidades! ${currentUser.nickname} y ${partnerUser.nickname} han conversado continuamente por 30 minutos y han desbloqueado su 'Isla de Parejas' en la base de datos.`,
            timestamp: Date.now(),
            isSystem: true,
          },
        ]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser, partnerUser, room.name, onCoupleUnlocked]);

  // Fast forward helper for simulation / testing
  const handleFastForwardTalk = (secondsToAdd: number) => {
    playSound('pop');
    const result = db.fastForwardTalkTime(
      currentUser.uid,
      currentUser.nickname,
      currentUser.avatarConfig,
      partnerUser.uid,
      partnerUser.nickname,
      partnerUser.avatarConfig,
      secondsToAdd,
      room.name
    );
    setCoupleState(result.couple);

    if (result.newlyUnlocked) {
      playSound('romance');
      confetti({ particleCount: 100, spread: 80 });
      if (onCoupleUnlocked) {
        onCoupleUnlocked(result.couple);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: 'unlocked_' + Date.now(),
          senderUid: 'system',
          senderName: 'Sistema WePlay Isla de Parejas',
          text: `🎉 ¡Felicidades! ${currentUser.nickname} y ${partnerUser.nickname} han conversado continuamente por 30 minutos y han desbloqueado su 'Isla de Parejas' en la base de datos.`,
          timestamp: Date.now(),
          isSystem: true,
        },
      ]);
    }
  };

  const handleResetTalk = () => {
    playSound('click');
    const reset = db.resetTalkTime(currentUser.uid, partnerUser.uid);
    setCoupleState(reset);
  };

  // Simulated Voice Activity Wave
  useEffect(() => {
    const interval = setInterval(() => {
      // Toggle speaking randomly for bot users to simulate live Agora audio stream
      setSpeakingUserUids((prev) => {
        const bots = ['user_valeria', 'user_belico', 'user_sofia'];
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        return Math.random() > 0.4 ? [randomBot] : [];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const toggleMic = () => {
    playSound('click');
    const newState = !isMicOn;
    setIsMicOn(newState);

    if (newState) {
      setSpeakingUserUids((prev) => [...prev, currentUser.uid]);
    } else {
      setSpeakingUserUids((prev) => prev.filter((id) => id !== currentUser.uid));
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playSound('click');
    const newMsg: RoomMessage = {
      id: Date.now().toString(),
      senderUid: currentUser.uid,
      senderName: currentUser.nickname,
      text: chatInput.trim(),
      timestamp: Date.now(),
      bubbleStyle: currentUser.bubbleId,
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleSeatClick = (seat: RoomSeat) => {
    playSound('click');
    if (seat.user) {
      if (seat.user.uid === currentUser.uid) {
        onOpenUserProfile(seat.user);
      } else {
        setInteractionSeat(seat);
      }
    } else {
      // Sit down in empty seat
      playSound('pop');
      setSeats((prev) =>
        prev.map((s) => {
          if (s.user?.uid === currentUser.uid) {
            return { ...s, user: undefined };
          }
          if (s.index === seat.index) {
            return { ...s, user: currentUser };
          }
          return s;
        })
      );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#1A0B2E] via-[#2A1245] to-[#120624] overflow-hidden select-none">
      {/* Dynamic Background Room Theme Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FF2E9D_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      {/* VIP Mount Entrance Banner */}
      {activeMountIndex !== null && (
        <VIPMountEntranceBanner
          user={currentUser}
          mount={DEFAULT_MOUNTS[activeMountIndex]}
          onFinish={() => setActiveMountIndex(null)}
        />
      )}

      {/* Top Room Navbar Header */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-between border-b border-purple-800/40 bg-[#1A0B2E]/70 backdrop-blur-md">
        {/* Room Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF2E9D] to-[#8B5CF6] flex items-center justify-center font-black text-white text-lg shadow-lg">
            {room.category === 'dating' ? '💘' : room.category === 'gaming' ? '🎮' : '🎉'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-sm text-white truncate max-w-[150px] sm:max-w-xs">
                {room.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black border border-pink-500/30">
                {room.tag}
              </span>
            </div>
            <div className="text-[11px] text-purple-300 flex items-center gap-2 mt-0.5">
              <span>ID: {room.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {room.membersCount + 1} online
              </span>
            </div>
          </div>
        </div>

        {/* Top Actions: Red Packet, Mount, PK Battle, Exit */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Red Packet Trigger */}
          <button
            onClick={() => {
              playSound('pop');
              setShowRedPacketModal(true);
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs border border-red-400/40 shadow-md transition active:scale-95"
            title="Lluvia de Monedas / Sobre Rojo"
          >
            <span>🧧</span>
            <span className="hidden sm:inline">Sobre Rojo</span>
          </button>

          {/* Mount Animation Trigger */}
          <button
            onClick={() => {
              setActiveMountIndex((prev) => ((prev ?? 0) + 1) % DEFAULT_MOUNTS.length);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-yellow-300 font-black text-xs border border-purple-600/40 transition"
            title="Efecto de Entrada VIP (Monturas)"
          >
            <span>🏎️</span>
            <span className="hidden sm:inline">Montura</span>
          </button>

          {/* PK Battle Trigger */}
          <button
            onClick={() => {
              playSound('swords');
              onStartPKBattle();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs shadow-md animate-pulse hover:opacity-90 transition"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>PK BATALLA</span>
          </button>

          {/* Leave room */}
          <button
            onClick={() => {
              playSound('click');
              onLeaveRoom();
            }}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition"
            title="Salir de la Sala"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PK Battle Live Bar (If Active) */}
      {activePKBattle && (
        <div className="relative z-10 mx-4 mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-purple-950 via-black to-purple-950 border border-red-500/40 shadow-xl flex flex-col gap-1.5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-1.5 text-blue-400">
              <span>🔵 {activePKBattle.user1.nickname}</span>
              <span className="text-white font-mono bg-blue-900/60 px-2 py-0.5 rounded-md">
                {activePKBattle.points1} pts
              </span>
            </div>

            <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
              <Swords className="w-3.5 h-3.5 animate-spin" />
              <span>{Math.floor(activePKBattle.timeLeft / 60)}:{(activePKBattle.timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1.5 text-red-400">
              <span className="text-white font-mono bg-red-900/60 px-2 py-0.5 rounded-md">
                {activePKBattle.points2} pts
              </span>
              <span>{activePKBattle.user2.nickname} 🔴</span>
            </div>
          </div>

          {/* Tug of war bar */}
          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden flex border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{
                width: `${
                  (activePKBattle.points1 / (activePKBattle.points1 + activePKBattle.points2 || 1)) * 100
                }%`,
              }}
            />
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 flex-1"
            />
          </div>
        </div>
      )}

      {/* Couple Island 30-Minute Continuous Conversation Tracker Banner */}
      <div className="relative z-10 mx-4 mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-[#2F0A38] via-[#1B0A2E] to-[#2F0A38] border border-pink-500/40 shadow-lg flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-purple-600 flex items-center justify-center shadow-md animate-pulse">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <div>
              <div className="font-heading font-black text-white flex items-center gap-1.5">
                <span className="text-[11px]">Isla de Parejas:</span>
                <span className="text-pink-300 text-[11px] truncate max-w-[90px]">{partnerUser.nickname}</span>
              </div>
              <span className="text-[10px] text-purple-300 font-mono">
                {Math.floor(coupleState.continuousTalkSeconds / 60)}m {coupleState.continuousTalkSeconds % 60}s / 30m 00s
              </span>
            </div>
          </div>

          {coupleState.isUnlocked ? (
            <button
              onClick={() => {
                playSound('pop');
                if (onOpenCoupleIsland) onOpenCoupleIsland(coupleState);
              }}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF2E9D] to-amber-400 text-white font-black text-[11px] shadow-[0_0_12px_#FF2E9D] hover:scale-105 transition flex items-center gap-1"
            >
              <span>🏝️ Entrar a la Isla</span>
              <Sparkles className="w-3 h-3 text-yellow-200" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleFastForwardTalk(300)}
                className="px-2 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-[10px] font-bold text-pink-200 border border-pink-500/20"
                title="Avanzar 5 minutos para prueba"
              >
                +5m
              </button>
              <button
                onClick={() => handleFastForwardTalk(1800)}
                className="px-2 py-1 rounded-lg bg-[#FF2E9D] hover:bg-pink-600 text-[10px] font-black text-white shadow-sm"
                title="Simular 30 minutos continuos y desbloquear"
              >
                +30m (Desbloquear)
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar towards 30 minutes (1800 seconds) */}
        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{
              width: `${Math.min(100, (coupleState.continuousTalkSeconds / coupleState.targetSeconds) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* 8-Seat Voice Matrix Stage (Chibi 3D Avatars) */}
      <div className="relative z-10 px-4 py-4 flex-1 flex flex-col justify-start">
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 max-w-md mx-auto w-full">
          {seats.map((seat) => {
            const isUserSpeaking = seat.user && speakingUserUids.includes(seat.user.uid);
            return (
              <div
                key={seat.index}
                onClick={() => handleSeatClick(seat)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="relative">
                  {seat.user ? (
                    <>
                      {/* Host Crown */}
                      {seat.index === 0 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                          <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                        </div>
                      )}

                      {/* 3D Chibi Avatar */}
                      <ChibiAvatar
                        config={seat.user.avatarConfig}
                        size={64}
                        frameId={seat.user.frameId || (seat.index === 0 ? 'vip_gold' : 'default')}
                        isSpeaking={isUserSpeaking}
                      />

                      {/* Speaking Equalizer Waves */}
                      {isUserSpeaking && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5 px-1.5 py-0.5 rounded-full bg-black/70 border border-pink-500/50">
                          <div className="w-1 h-3 bg-[#FF2E9D] rounded-full animate-bounce" />
                          <div className="w-1 h-4 bg-yellow-400 rounded-full animate-bounce delay-75" />
                          <div className="w-1 h-2 bg-[#FF2E9D] rounded-full animate-bounce delay-150" />
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty Seat */
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-purple-500/40 bg-purple-950/20 flex flex-col items-center justify-center group-hover:border-[#FF2E9D] transition">
                      <span className="text-lg opacity-40">🎙️</span>
                      <span className="text-[9px] font-bold text-purple-400 mt-0.5">Asiento {seat.index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Nickname & Badge */}
                <div className="mt-1.5 flex flex-col items-center">
                  <span className="text-xs font-bold text-white max-w-[72px] truncate text-center">
                    {seat.user ? seat.user.nickname : 'Disponible'}
                  </span>
                  {seat.user && (
                    <span className="text-[9px] font-black text-amber-300 bg-amber-950/50 px-1.5 py-0.2 rounded-full">
                      Nv.{seat.user.level || 15}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Room Live Stream Chat Stream */}
        <div className="flex-1 mt-4 rounded-3xl bg-black/35 border border-purple-800/30 p-3 overflow-y-auto flex flex-col justify-end space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-xs animate-in fade-in slide-in-from-bottom-1 ${
                msg.isSystem
                  ? 'bg-purple-900/40 border border-purple-500/30 text-purple-200 px-3 py-1.5 rounded-2xl text-center'
                  : 'flex items-start gap-2'
              }`}
            >
              {!msg.isSystem && (
                <div
                  className={`px-3 py-1.5 rounded-2xl max-w-[85%] ${
                    msg.bubbleStyle === 'bubble_pink_neon'
                      ? 'bg-pink-950/60 border border-[#FF2E9D]/50 text-pink-100 neon-glow-pink'
                      : 'bg-purple-900/40 border border-white/10 text-gray-200'
                  }`}
                >
                  <span className="font-extrabold text-[#FF2E9D] mr-1.5 text-[11px]">
                    {msg.senderName}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              )}
              {msg.isSystem && <span>{msg.text}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Floating Interactive Dock & Mic Controls */}
      <div className="relative z-10 px-4 py-3 bg-[#1A0B2E]/90 border-t border-purple-800/40 backdrop-blur-md flex items-center justify-between gap-2">
        {/* Chat Input Pill */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center bg-purple-950/50 border border-purple-600/30 rounded-full px-3 py-1.5">
          <input
            type="text"
            placeholder="Comenta en la sala..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-purple-300 focus:outline-none"
          />
          <button type="submit" className="text-[#FF2E9D] hover:text-pink-400 p-1">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Soundboard Bar Button */}
        <button
          onClick={() => {
            playSound('click');
            setShowSoundboard(true);
          }}
          className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-500 text-black shadow-lg hover:scale-105 transition"
          title="Soundpad de Voz"
        >
          <span className="text-sm">🎛️</span>
        </button>

        {/* Games Bar Button */}
        <button
          onClick={() => {
            playSound('click');
            onOpenGamesModal();
          }}
          className="p-2.5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition"
          title="Party Games"
        >
          <Gamepad2 className="w-5 h-5" />
        </button>

        {/* Microphone Toggle (Agora voice) */}
        <button
          onClick={toggleMic}
          className={`p-2.5 rounded-full text-white shadow-lg transition ${
            isMicOn
              ? 'bg-[#FF2E9D] neon-glow-pink animate-pulse'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
          title={isMicOn ? 'Silenciar Micrófono' : 'Hablar por Micrófono'}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Gifts Button (Triggers 30 custom gifts catalog) */}
        <button
          onClick={() => {
            playSound('pop');
            onOpenGiftSelector();
          }}
          className="p-2.5 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-amber-500 text-white shadow-lg neon-glow-pink hover:scale-110 transition animate-bounce"
          title="Enviar Regalos 3D"
        >
          <GiftIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Active Red Packet in Room */}
      {activeRedPacket && (
        <div className="absolute top-20 right-4 z-40 animate-bounce">
          <button
            onClick={() => {
              if (claimedRedPacket) return;
              playSound('coin');
              playSound('applause');
              confetti({ particleCount: 80, spread: 70 });
              const won = Math.floor(Math.random() * 250) + 120;
              setClaimedRedPacket(true);
              if (onRewardCoins) onRewardCoins(won);
              setMessages((prev) => [
                ...prev,
                {
                  id: 'rp_' + Date.now(),
                  senderUid: 'system',
                  senderName: 'Lluvia de Monedas',
                  text: `🧧 ¡${currentUser.nickname} abrió el Sobre Rojo de ${activeRedPacket.sender} y ganó ${won} 🪙 monedas!`,
                  timestamp: Date.now(),
                  isSystem: true,
                },
              ]);
              setTimeout(() => {
                setActiveRedPacket(null);
                setClaimedRedPacket(false);
              }, 4000);
            }}
            className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 border-2 border-yellow-300 shadow-2xl flex items-center gap-2 text-white hover:scale-105 active:scale-95 transition"
          >
            <span className="text-3xl animate-pulse">🧧</span>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-yellow-200 block leading-tight">
                {claimedRedPacket ? '¡RECLAMADO!' : '¡TOCA PARA ABRIR!'}
              </span>
              <span className="text-[9px] text-white/90">
                {activeRedPacket.total} 🪙 de {activeRedPacket.sender}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Floating Soundboard reaction overlay */}
      {floatingReaction && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in zoom-in-50 fade-in duration-300">
          <div className="px-4 py-2 rounded-full bg-black/85 border border-amber-400 text-white font-black text-sm flex items-center gap-2 shadow-2xl">
            <span className="text-2xl animate-bounce">{floatingReaction.emoji}</span>
            <span className="text-amber-300">{floatingReaction.text}</span>
          </div>
        </div>
      )}

      {/* Thrown item projectile animation */}
      {thrownItemAnimation && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-ping">
          <div className="text-7xl filter drop-shadow-2xl">
            {thrownItemAnimation.emoji}
          </div>
        </div>
      )}

      {/* Red Packet Modal */}
      {showRedPacketModal && (
        <RedPacketModal
          currentUser={currentUser}
          onClose={() => setShowRedPacketModal(false)}
          onSendRedPacket={(totalCoins, packetsCount) => {
            setActiveRedPacket({
              id: Date.now().toString(),
              total: totalCoins,
              count: packetsCount,
              sender: currentUser.nickname,
            });
            setClaimedRedPacket(false);
            setMessages((prev) => [
              ...prev,
              {
                id: 'rp_sent_' + Date.now(),
                senderUid: 'system',
                senderName: 'Lluvia de Monedas',
                text: `🧧 ¡${currentUser.nickname} lanzó un Sobre Rojo con ${totalCoins} 🪙 a la sala! ¡Abran sus sobres!`,
                timestamp: Date.now(),
                isSystem: true,
              },
            ]);
          }}
        />
      )}

      {/* Soundboard Drawer */}
      {showSoundboard && (
        <SoundboardDrawer
          onClose={() => setShowSoundboard(false)}
          onTriggerSound={(name, emoji) => {
            setFloatingReaction({ id: Date.now().toString(), emoji, text: name });
            setTimeout(() => setFloatingReaction(null), 2200);
            setMessages((prev) => [
              ...prev,
              {
                id: 'sfx_' + Date.now(),
                senderUid: currentUser.uid,
                senderName: currentUser.nickname,
                text: `${emoji} [Efecto de audio: ${name}]`,
                timestamp: Date.now(),
              },
            ]);
          }}
        />
      )}

      {/* Seat Interaction Modal */}
      {interactionSeat && (
        <SeatInteractionModal
          currentUser={currentUser}
          targetSeat={interactionSeat}
          onClose={() => setInteractionSeat(null)}
          onViewProfile={() => {
            if (interactionSeat.user) {
              onOpenUserProfile(interactionSeat.user);
            }
          }}
          onThrowItem={(targetName, item) => {
            setThrownItemAnimation({ id: Date.now().toString(), emoji: item.emoji, targetName });
            setTimeout(() => setThrownItemAnimation(null), 1200);
            setMessages((prev) => [
              ...prev,
              {
                id: 'item_' + Date.now(),
                senderUid: currentUser.uid,
                senderName: currentUser.nickname,
                text: `¡Lanzó un ${item.name} ${item.emoji} a ${targetName}!`,
                timestamp: Date.now(),
              },
            ]);
          }}
        />
      )}
    </div>
  );
};
