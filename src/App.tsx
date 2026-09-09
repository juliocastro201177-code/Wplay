import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gamepad2, 
  Heart, 
  User as UserIcon, 
  Coins, 
  Sparkles, 
  Plus, 
  Bell, 
  Search,
  Crown,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Room, Gift, GameType, RoomSeat, CoupleRecord } from './types';
import { RoomLobby } from './components/lobby/RoomLobby';
import { CreateRoomModal } from './components/lobby/CreateRoomModal';
import { VoicePartyRoom } from './components/room/VoicePartyRoom';
import { PartyGamesTab } from './components/party/PartyGamesTab';
import { DrawAndGuessGame } from './components/games/DrawAndGuessGame';
import { WhoIsSpyGame } from './components/games/WhoIsSpyGame';
import { SpaceWerewolfGame } from './components/games/SpaceWerewolfGame';
import { KaraokeGame } from './components/games/KaraokeGame';
import { LudoGame } from './components/games/LudoGame';
import { TruthOrDareGame } from './components/games/TruthOrDareGame';
import { DailyWheelModal } from './components/games/DailyWheelModal';
import { MiniGamesModal } from './components/games/MiniGamesModal';
import { BottleSpinModal } from './components/games/BottleSpinModal';
import { WePlayClanModal } from './components/party/WePlayClanModal';
import { GiftSelectorModal } from './components/gifts/GiftSelectorModal';
import { GiftAnimationOverlay } from './components/gifts/GiftAnimationOverlay';
import { ProfileModal } from './components/profile/ProfileModal';
import { AvatarEditorModal } from './components/avatar/AvatarEditorModal';
import { ShopModal } from './components/shop/ShopModal';
import { MomentsFeed } from './components/moments/MomentsFeed';
import { DirectMessagesModal } from './components/chat/DirectMessagesModal';
import { CoupleIslandModal } from './components/couple/CoupleIslandModal';
import { CoupleUnlockCelebration } from './components/couple/CoupleUnlockCelebration';
import { WePlayPermissionsModal } from './components/permissions/WePlayPermissionsModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { ChibiAvatar } from './components/avatar/ChibiAvatar';
import { playSound } from './utils/audio';
import { db } from './services/databaseService';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Permissions Modal state (first launch prompt & settings)
  const [showPermissionsModal, setShowPermissionsModal] = useState<boolean>(false);

  // Navigation State: 'rooms' | 'games' | 'moments' | 'me'
  const [activeTab, setActiveTab] = useState<'rooms' | 'games' | 'moments' | 'me'>('rooms');

  // Check permissions & load photos on first mount/login
  useEffect(() => {
    if (currentUser) {
      // Check if user has prompted permissions
      const perms = db.getAppPermissions();
      if (!perms.hasPrompted) {
        // Automatically prompt on first opening
        const timer = setTimeout(() => {
          setShowPermissionsModal(true);
        }, 800);
        return () => clearTimeout(timer);
      }

      // Restore custom saved avatar & banner if existing
      const savedPhotos = db.getUserSavedPhotos(currentUser.uid);
      if (savedPhotos.avatarUrl && savedPhotos.avatarUrl !== currentUser.avatarUrl) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                avatarUrl: savedPhotos.avatarUrl,
                bannerUrl: savedPhotos.bannerUrl || prev.bannerUrl,
              }
            : null
        );
      }
    }
  }, [currentUser?.uid]);

  // Couple Island State
  const [activeCoupleIsland, setActiveCoupleIsland] = useState<CoupleRecord | null>(null);
  const [unlockedCoupleCelebration, setUnlockedCoupleCelebration] = useState<CoupleRecord | null>(null);

  // Active Voice Room (null = in lobby)
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  // Rooms List
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '802931',
      name: 'Puro Desmadre Culiacán 🚗💨',
      category: 'friends',
      tag: '#Bélico',
      hostUid: 'host_1',
      hostName: 'El_Compa_Bélico',
      hostAvatar: '',
      membersCount: 42,
      maxSeats: 8,
      seats: [],
      currentGame: 'draw_and_guess',
    },
    {
      id: '719382',
      name: 'Citas & Parejas CDMX 💘',
      category: 'dating',
      tag: '#Romance',
      hostUid: 'host_2',
      hostName: 'Valeria_CDMX',
      hostAvatar: '',
      membersCount: 28,
      maxSeats: 8,
      seats: [],
    },
    {
      id: '992014',
      name: 'Torneo Draw & Guess Oficial 🎨',
      category: 'gaming',
      tag: '#Torneo',
      hostUid: 'host_3',
      hostName: 'WePlay_Master',
      hostAvatar: '',
      membersCount: 65,
      maxSeats: 8,
      seats: [],
      currentGame: 'draw_and_guess',
    },
    {
      id: '450291',
      name: 'Noche de Karaoke & Corridos 🎤',
      category: 'karaoke',
      tag: '#Karaoke',
      hostUid: 'host_4',
      hostName: 'Sofia_Gdl',
      hostAvatar: '',
      membersCount: 19,
      maxSeats: 8,
      seats: [],
    },
  ]);

  // Modals & Overlays
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(null);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [showDrawAndGuess, setShowDrawAndGuess] = useState(false);
  const [showBottleSpin, setShowBottleSpin] = useState(false);
  const [showWhoIsSpy, setShowWhoIsSpy] = useState(false);
  const [showSpaceWerewolf, setShowSpaceWerewolf] = useState(false);
  const [showKaraoke, setShowKaraoke] = useState(false);
  const [showLudo, setShowLudo] = useState(false);
  const [showTruthOrDare, setShowTruthOrDare] = useState(false);
  const [showDailyWheel, setShowDailyWheel] = useState(false);
  const [showClanModal, setShowClanModal] = useState(false);
  const [directChatTarget, setDirectChatTarget] = useState<{ uid: string; nickname: string; level?: number } | null>(null);

  // Full Screen 3D Gift Animation state
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{
    gift: Gift;
    senderName: string;
    receiverName: string;
    count: number;
  } | null>(null);

  // Active PK Battle in Voice Room
  const [activePKBattle, setActivePKBattle] = useState<{
    user1: User;
    user2: User;
    points1: number;
    points2: number;
    timeLeft: number;
  } | null>(null);

  // Gift Sending Handler
  const handleSendGift = (gift: Gift, receiverName: string, count: number) => {
    if (!currentUser) return;
    const totalCost = gift.price * count;

    // Deduct coins
    setCurrentUser((prev) => (prev ? { ...prev, coins: Math.max(0, prev.coins - totalCost) } : null));

    // Trigger PK points if in battle
    if (activePKBattle) {
      setActivePKBattle((prev) =>
        prev
          ? {
              ...prev,
              points1: prev.points1 + totalCost,
            }
          : null
      );
    }

    // Trigger Full screen cinematic animation & speech synthesis
    setActiveGiftAnimation({
      gift,
      senderName: currentUser.nickname,
      receiverName,
      count,
    });
  };

  // Start PK Battle
  const handleStartPKBattle = () => {
    if (!currentUser) return;
    playSound('swords');
    confetti({ particleCount: 80, spread: 80 });

    const opponent: User = {
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
      friendsCount: 210,
      followingCount: 340,
      followersCount: 1980,
    };

    setActivePKBattle({
      user1: currentUser,
      user2: opponent,
      points1: 1500,
      points2: 2400,
      timeLeft: 180, // 3 minutes
    });
  };

  // If user not authenticated, show AuthScreen (with 2s splash)
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F051D] text-white select-none">
      {/* Mobile container framing (optimized for Android applet preview & desktop responsive) */}
      <div className="relative w-full max-w-md h-screen max-h-[920px] bg-[#1A0B2E] flex flex-col overflow-hidden shadow-2xl md:rounded-3xl md:border md:border-purple-800/40">
        {/* Top Header Bar (When not inside a room) */}
        {!activeRoom && (
          <div className="relative z-20 px-4 py-3 bg-[#1A0B2E]/90 border-b border-purple-800/40 backdrop-blur-md flex items-center justify-between">
            {/* User Profile Mini Trigger */}
            <div
              onClick={() => {
                playSound('click');
                setSelectedUserProfile(currentUser);
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              {currentUser.avatarUrl ? (
                <div className="w-[38px] h-[38px] rounded-full overflow-hidden border-2 border-yellow-400 shadow-md group-hover:scale-105 transition">
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <ChibiAvatar
                  config={currentUser.avatarConfig}
                  size={38}
                  frameId={currentUser.frameId}
                />
              )}
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-heading font-black text-xs text-white group-hover:text-[#FF2E9D] transition">
                    {currentUser.nickname}
                  </span>
                  {currentUser.vip && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
                </div>
                <span className="text-[10px] font-bold text-pink-300">Nv.{currentUser.level || 5}</span>
              </div>
            </div>

            {/* Currency Badges: Coins & Diamonds */}
            <div className="flex items-center gap-1.5">
              {/* Coins + Top-up */}
              <div
                onClick={() => {
                  playSound('click');
                  setShowShop(true);
                }}
                className="cursor-pointer flex items-center gap-1.5 bg-black/50 hover:bg-black/70 px-2.5 py-1 rounded-full border border-yellow-500/40 transition"
              >
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-black text-yellow-300">
                  {currentUser.coins.toLocaleString()}
                </span>
                <span className="w-4 h-4 rounded-full bg-[#FF2E9D] text-white text-[10px] font-black flex items-center justify-center ml-0.5 shadow-sm">
                  +
                </span>
              </div>

              {/* Isla de Parejas Quick Access Button */}
              <button
                onClick={() => {
                  playSound('pop');
                  const couple = db.getOrCreateCouple(
                    currentUser.uid,
                    currentUser.nickname,
                    currentUser.avatarConfig,
                    'user_valeria',
                    'Valeria_CDMX',
                    {
                      skinColor: '#FFDFBA',
                      hairStyle: 'long_straight',
                      hairColor: '#78350F',
                      expression: 'wink',
                      outfit: 'suit_vip',
                      outfitColor: '#BE185D',
                      headwear: 'golden_crown',
                      glasses: 'none',
                      accessory: 'diamond_earring',
                    }
                  );
                  setActiveCoupleIsland(couple);
                }}
                className="p-1.5 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-purple-600 hover:opacity-90 border border-pink-400/40 text-white shadow-[0_0_10px_rgba(255,46,157,0.4)] transition"
                title="Isla de Parejas"
              >
                <span className="text-sm">🏝️</span>
              </button>

              {/* Permisos WePlay Modal Button */}
              <button
                onClick={() => {
                  playSound('pop');
                  setShowPermissionsModal(true);
                }}
                className="p-1.5 rounded-full bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-purple-200 hover:text-pink-300 transition"
                title="Permisos (Mic, Cámara, Galería, Notificaciones)"
              >
                <Shield className="w-4 h-4 text-pink-400" />
              </button>

              {/* Daily Fortune Wheel Button */}
              <button
                onClick={() => {
                  playSound('horn');
                  setShowDailyWheel(true);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-[11px] shadow-lg transition active:scale-95 animate-pulse"
                title="Ruleta de la Suerte WePlay"
              >
                <span>🎡</span>
                <span className="hidden sm:inline">Ruleta</span>
              </button>

              {/* VIP Badge or Shop */}
              <button
                onClick={() => {
                  playSound('click');
                  setShowShop(true);
                }}
                className="p-1.5 rounded-full bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-yellow-400 transition"
                title="Tienda VIP WePlay"
              >
                <Crown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Body Stage */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeRoom ? (
            /* Inside Voice Party Room */
            <VoicePartyRoom
              room={activeRoom}
              currentUser={currentUser}
              onLeaveRoom={() => {
                setActiveRoom(null);
                setActivePKBattle(null);
              }}
              onOpenGiftSelector={() => setShowGiftSelector(true)}
              onOpenGamesModal={() => setShowMiniGames(true)}
              onOpenUserProfile={(target) => setSelectedUserProfile(target)}
              onStartPKBattle={handleStartPKBattle}
              onOpenCoupleIsland={(couple) => setActiveCoupleIsland(couple)}
              onCoupleUnlocked={(couple) => setUnlockedCoupleCelebration(couple)}
              onRewardCoins={(amount) => {
                setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
              }}
              activePKBattle={activePKBattle}
            />
          ) : (
            /* Tab Content */
            <>
              {activeTab === 'rooms' && (
                <RoomLobby
                  currentUser={currentUser}
                  rooms={rooms}
                  onJoinRoom={(room) => setActiveRoom(room)}
                  onCreateRoomClick={() => setShowCreateRoom(true)}
                  onOpenShop={() => setShowShop(true)}
                  onOpenMyProfile={() => setSelectedUserProfile(currentUser)}
                  onOpenDrawAndGuessQuick={() => setShowDrawAndGuess(true)}
                  onOpenCoupleIsland={() => {
                    const couple = db.getOrCreateCouple(
                      currentUser.uid,
                      currentUser.nickname,
                      currentUser.avatarConfig,
                      'user_valeria',
                      'Valeria_CDMX',
                      {
                        skinColor: '#FFDFBA',
                        hairStyle: 'long_straight',
                        hairColor: '#78350F',
                        expression: 'wink',
                        outfit: 'suit_vip',
                        outfitColor: '#BE185D',
                        headwear: 'golden_crown',
                        glasses: 'none',
                        accessory: 'diamond_earring',
                      }
                    );
                    setActiveCoupleIsland(couple);
                  }}
                  onOpenClanModal={() => setShowClanModal(true)}
                />
              )}

              {activeTab === 'games' && (
                <PartyGamesTab
                  onPlayGame={(game) => {
                    if (game === 'draw_and_guess') {
                      setShowDrawAndGuess(true);
                    } else if (game === 'bottle_spin') {
                      setShowBottleSpin(true);
                    } else if (game === 'who_is_spy') {
                      setShowWhoIsSpy(true);
                    } else if (game === 'space_werewolf') {
                      setShowSpaceWerewolf(true);
                    } else if (game === 'karaoke') {
                      setShowKaraoke(true);
                    } else if (game === 'ludo') {
                      setShowLudo(true);
                    } else if (game === 'truth_or_dare') {
                      setShowTruthOrDare(true);
                    } else {
                      setShowMiniGames(true);
                    }
                  }}
                  onOpenBottleSpin={() => setShowBottleSpin(true)}
                  onOpenClanModal={() => setShowClanModal(true)}
                />
              )}

              {activeTab === 'moments' && (
                <MomentsFeed
                  currentUser={currentUser}
                  onSendGiftToAuthor={(authorName) => {
                    setShowGiftSelector(true);
                  }}
                  onOpenUserProfile={(user) => setSelectedUserProfile(user)}
                />
              )}

              {activeTab === 'me' && (
                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                  <ProfileModal
                    user={currentUser}
                    isCurrentUser={true}
                    onEditProfile={() => setShowAvatarEditor(true)}
                    onUpdateUser={(updated) => setCurrentUser(updated)}
                    onOpenPermissions={() => setShowPermissionsModal(true)}
                    onClose={() => setActiveTab('rooms')}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation Bar (Shown when not inside active room) */}
        {!activeRoom && (
          <div className="relative z-20 h-16 bg-[#1A0B2E]/95 border-t border-purple-800/40 backdrop-blur-md flex items-center justify-around px-2">
            {[
              { id: 'rooms', label: 'Salas', icon: Users },
              { id: 'games', label: 'Juegos', icon: Gamepad2 },
              { id: 'moments', label: 'Momentos', icon: Heart },
              { id: 'me', label: 'Yo', icon: UserIcon },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(nav.id as typeof activeTab);
                  }}
                  className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                    isActive ? 'text-[#FF2E9D] scale-105' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF2E9D] shadow-[0_0_6px_#FF2E9D]" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold mt-1 tracking-tight">{nav.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* --- ALL OVERLAY MODALS & ENGINES --- */}

        {/* 1. Full Screen Cinematic Gift Animation & Audio Announcer */}
        <GiftAnimationOverlay
          activeGift={activeGiftAnimation}
          onComplete={() => setActiveGiftAnimation(null)}
        />

        {/* 2. Gift Selector Modal (30 Custom SVG Kawaii Gifts) */}
        {showGiftSelector && (
          <GiftSelectorModal
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onSendGift={handleSendGift}
            onOpenShop={() => {
              setShowGiftSelector(false);
              setShowShop(true);
            }}
            onClose={() => setShowGiftSelector(false)}
          />
        )}

        {/* 3. Draw & Guess Interactive Game */}
        {showDrawAndGuess && (
          <DrawAndGuessGame
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onClose={() => setShowDrawAndGuess(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 4. Tumba la Botella 3D Spin Modal */}
        {showBottleSpin && (
          <BottleSpinModal
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onOpenPrivateChatWith={(target) => setDirectChatTarget(target)}
            onClose={() => setShowBottleSpin(false)}
          />
        )}

        {/* 5. Mini Games Modal (Party Bar) */}
        {showMiniGames && (
          <MiniGamesModal
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onSelectGame={(game) => {
              setShowMiniGames(false);
              if (game === 'draw_and_guess') {
                setShowDrawAndGuess(true);
              } else if (game === 'bottle_spin') {
                setShowBottleSpin(true);
              } else if (game === 'who_is_spy') {
                setShowWhoIsSpy(true);
              } else if (game === 'space_werewolf') {
                setShowSpaceWerewolf(true);
              } else if (game === 'karaoke') {
                setShowKaraoke(true);
              } else if (game === 'ludo') {
                setShowLudo(true);
              } else if (game === 'truth_or_dare') {
                setShowTruthOrDare(true);
              }
            }}
            onOpenBottleSpin={() => {
              setShowMiniGames(false);
              setShowBottleSpin(true);
            }}
            onClose={() => setShowMiniGames(false)}
          />
        )}

        {/* 5B. Juego del Espía (Who is the Spy) */}
        {showWhoIsSpy && (
          <WhoIsSpyGame
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onClose={() => setShowWhoIsSpy(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 5C. Space Werewolf (Hombre Lobo) */}
        {showSpaceWerewolf && (
          <SpaceWerewolfGame
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onClose={() => setShowSpaceWerewolf(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 5D. Karaoke & Mic Grab */}
        {showKaraoke && (
          <KaraokeGame
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onClose={() => setShowKaraoke(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 5E. Ludo King WePlay */}
        {showLudo && (
          <LudoGame
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onClose={() => setShowLudo(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 5F. 100 Preguntas Incómodas (Truth or Dare) */}
        {showTruthOrDare && (
          <TruthOrDareGame
            currentUser={currentUser}
            roomSeats={activeRoom?.seats || []}
            onClose={() => setShowTruthOrDare(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 5G. Ruleta Diaria de la Suerte WePlay */}
        {showDailyWheel && (
          <DailyWheelModal
            currentUser={currentUser}
            onClose={() => setShowDailyWheel(false)}
            onRewardCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
          />
        )}

        {/* 5D. Sistema de Familias / Clanes WePlay */}
        {showClanModal && (
          <WePlayClanModal
            currentUser={currentUser}
            onClose={() => setShowClanModal(false)}
            onOpenClanRoom={(clan) => {
              // Automatically enter or create the Clan's private voice room
              const clanRoom: Room = {
                id: `room_${clan.id}`,
                name: `Sala Oficial ${clan.name} 🛡️`,
                category: 'party',
                tag: `#${clan.tag}`,
                hostUid: clan.leaderUid,
                hostName: clan.leaderName,
                hostAvatar: '',
                membersCount: clan.memberCount,
                maxSeats: 8,
                seats: [],
              };
              setActiveRoom(clanRoom);
              setShowClanModal(false);
            }}
          />
        )}

        {/* 6. Profile Modal (View any user or self) */}
        {selectedUserProfile && (
          <ProfileModal
            user={selectedUserProfile}
            isCurrentUser={selectedUserProfile.uid === currentUser.uid}
            onEditProfile={() => {
              setSelectedUserProfile(null);
              setShowAvatarEditor(true);
            }}
            onUpdateUser={(updated) => {
              if (updated.uid === currentUser.uid) {
                setCurrentUser(updated);
              }
              setSelectedUserProfile(updated);
            }}
            onOpenPermissions={() => setShowPermissionsModal(true)}
            onSendGiftToUser={(target) => {
              setSelectedUserProfile(null);
              setShowGiftSelector(true);
            }}
            onOpenDirectChat={(target) => {
              setSelectedUserProfile(null);
              setDirectChatTarget({ uid: target.uid, nickname: target.nickname, level: target.level });
            }}
            onClose={() => setSelectedUserProfile(null)}
          />
        )}

        {/* 7. Chibi Avatar 3D & Wardrobe Editor Modal */}
        {showAvatarEditor && (
          <AvatarEditorModal
            currentConfig={currentUser.avatarConfig}
            currentFrameId={currentUser.frameId}
            currentBubbleId={currentUser.bubbleId}
            currentEnterEffectId={currentUser.enterEffectId}
            onSave={(data) => {
              setCurrentUser((prev) =>
                prev
                  ? {
                      ...prev,
                      avatarConfig: data.avatarConfig,
                      frameId: data.frameId,
                      bubbleId: data.bubbleId,
                      enterEffectId: data.enterEffectId,
                    }
                  : null
              );
            }}
            onClose={() => setShowAvatarEditor(false)}
          />
        )}

        {/* 8. Shop & VIP Recharge Modal */}
        {showShop && (
          <ShopModal
            currentUser={currentUser}
            onAddCoins={(amount) => {
              setCurrentUser((prev) => (prev ? { ...prev, coins: prev.coins + amount } : null));
            }}
            onActivateVIP={() => {
              setCurrentUser((prev) =>
                prev
                  ? {
                      ...prev,
                      vip: true,
                      coins: prev.coins + 5000,
                      frameId: 'vip_gold',
                    }
                  : null
              );
            }}
            onClose={() => setShowShop(false)}
          />
        )}

        {/* 9. Create Room Modal */}
        {showCreateRoom && (
          <CreateRoomModal
            currentUser={currentUser}
            onCreateRoom={(newRoom) => {
              setRooms([newRoom, ...rooms]);
              setActiveRoom(newRoom);
            }}
            onClose={() => setShowCreateRoom(false)}
          />
        )}

        {/* 10. Direct Messages 1-on-1 Modal */}
        {directChatTarget && (
          <DirectMessagesModal
            currentUser={currentUser}
            targetUser={directChatTarget}
            onSendGiftToUser={(name) => {
              setShowGiftSelector(true);
            }}
            onOpenCoupleIsland={() => {
              const couple = db.getOrCreateCouple(
                currentUser.uid,
                currentUser.nickname,
                currentUser.avatarConfig,
                directChatTarget.uid,
                directChatTarget.nickname,
                {
                  skinColor: '#FFDFBA',
                  hairStyle: 'long_straight',
                  hairColor: '#78350F',
                  expression: 'wink',
                  outfit: 'suit_vip',
                  outfitColor: '#BE185D',
                  headwear: 'golden_crown',
                  glasses: 'none',
                  accessory: 'diamond_earring',
                }
              );
              setDirectChatTarget(null);
              setActiveCoupleIsland(couple);
            }}
            onClose={() => setDirectChatTarget(null)}
          />
        )}

        {/* 11. Couple Island Modal (Isla de Parejas Privada) */}
        {activeCoupleIsland && (
          <CoupleIslandModal
            currentUser={currentUser}
            couple={activeCoupleIsland}
            onClose={() => setActiveCoupleIsland(null)}
            onSendGift={(receiver) => setShowGiftSelector(true)}
          />
        )}

        {/* 12. Couple Unlock Celebration (30 Minutes Milestone) */}
        {unlockedCoupleCelebration && (
          <CoupleUnlockCelebration
            couple={unlockedCoupleCelebration}
            onEnterIsland={() => {
              setActiveCoupleIsland(unlockedCoupleCelebration);
              setUnlockedCoupleCelebration(null);
            }}
            onClose={() => setUnlockedCoupleCelebration(null)}
          />
        )}

        {/* 13. WePlay Beautiful Purple Permissions Modal */}
        <WePlayPermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
        />
      </div>
    </div>
  );
}
