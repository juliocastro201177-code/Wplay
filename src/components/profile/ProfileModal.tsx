import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Heart, 
  Gift as GiftIcon, 
  MessageCircle, 
  UserPlus, 
  Edit3, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Flame,
  Camera,
  Image as ImageIcon,
  Shield
} from 'lucide-react';
import { User, Gender } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { ALL_GIFTS } from '../../data/giftsData';
import { GiftSvgIcon } from '../gifts/GiftSvgIcon';
import { playSound } from '../../utils/audio';
import { ImageCropperModal } from './ImageCropperModal';

interface ProfileModalProps {
  user: User;
  isCurrentUser: boolean;
  onEditProfile?: () => void;
  onSendGiftToUser?: (user: User) => void;
  onOpenDirectChat?: (user: User) => void;
  onUpdateUser?: (updatedUser: User) => void;
  onOpenPermissions?: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isCurrentUser,
  onEditProfile,
  onSendGiftToUser,
  onOpenDirectChat,
  onUpdateUser,
  onOpenPermissions,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'muro' | 'regalos' | 'insignias' | 'datos'>('muro');
  const [isFollowing, setIsFollowing] = useState(false);
  const [bioText, setBioText] = useState(user.bio || 'Soltera y sin compromiso 🖤');
  const [cropperType, setCropperType] = useState<'avatar' | 'banner' | null>(null);
  const [viewMode, setViewMode] = useState<'photo' | 'chibi'>(user.avatarUrl ? 'photo' : 'chibi');

  const handleFollowToggle = () => {
    playSound('coin');
    setIsFollowing(!isFollowing);
  };

  // Badges data
  const badgesList = [
    { id: 'vip_gold', title: 'Socio VIP LATAM', desc: 'Membresía activa 2026', icon: '👑', color: 'border-yellow-400 text-yellow-300' },
    { id: 'master_draw', title: 'Maestro Pincel', desc: '100+ palabras acertadas en Draw & Guess', icon: '🎨', color: 'border-pink-500 text-pink-300' },
    { id: 'party_king', title: 'Rey de la Fiesta', desc: '50 horas transmitidas en salas', icon: '🔥', color: 'border-orange-500 text-orange-300' },
    { id: 'millionaire', title: 'Magnate WePlay', desc: 'Ha regalado más de 10,000 monedas', icon: '💎', color: 'border-cyan-400 text-cyan-300' },
  ];

  // Moments feed posts for this user
  const userMoments = [
    {
      id: 'm1',
      date: 'Hoy 15:30',
      text: '¡Increíble noche de party rooms en Culiacán! Gracias por las Buchona Trucks 🚗💨✨',
      likes: 128,
      comments: 34,
      imageTag: 'FIESTA LATAM',
    },
    {
      id: 'm2',
      date: 'Ayer 22:10',
      text: 'Nueva campeona de Draw & Guess invicta 5 rondas seguidas 🎨🏆 ¿Quién reta?',
      likes: 89,
      comments: 19,
      imageTag: 'GAMING ROOM',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1A0B2E] via-[#2D1B4E] to-[#4A1E6E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Customizable Banner */}
        <div 
          onClick={() => {
            if (isCurrentUser) {
              playSound('pop');
              setCropperType('banner');
            }
          }}
          className={`relative h-36 bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 overflow-hidden flex items-end ${
            isCurrentUser ? 'cursor-pointer group' : ''
          }`}
        >
          {user.bannerUrl ? (
            <img 
              src={user.bannerUrl} 
              alt="Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#FF2E9D_1px,transparent_1px)] [background-size:16px_16px]" />
          )}

          {/* Hover overlay hint for banner */}
          {isCurrentUser && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold pointer-events-none">
              <Camera className="w-4 h-4 text-pink-400" />
              <span>Click para cambiar portada</span>
            </div>
          )}

          {/* Change Banner Action Button */}
          {isCurrentUser && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound('pop');
                setCropperType('banner');
              }}
              className="absolute bottom-2 right-3 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 transition z-10 backdrop-blur-sm"
              title="Cambiar Portada"
            >
              <Camera className="w-3 h-3 text-pink-400" />
              <span>Cambiar Fondo</span>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* VIP Banner tag */}
          {user.vip && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black font-black text-xs shadow-lg">
              <Crown className="w-3.5 h-3.5" />
              <span>VIP PLATINO</span>
            </div>
          )}
        </div>

        {/* Avatar & Badges Header */}
        <div className="relative px-6 pt-0 pb-3 flex flex-col items-center -mt-14">
          <div className="relative flex items-center justify-center">
            {/* Left Badge: Level */}
            <div className="absolute -left-12 bottom-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/50 text-[10px] font-black text-white shadow-md">
              Nv.{user.level || 32}
            </div>

            {/* Clickable Avatar Container */}
            <div 
              onClick={() => {
                if (isCurrentUser) {
                  playSound('pop');
                  setCropperType('avatar');
                }
              }}
              className={`relative p-1 rounded-full bg-[#1A0B2E] shadow-2xl group ${
                isCurrentUser ? 'cursor-pointer' : ''
              }`}
              title={isCurrentUser ? 'Click para cambiar foto de perfil' : undefined}
            >
              {viewMode === 'photo' && user.avatarUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                  <img
                    src={user.avatarUrl}
                    alt={user.nickname}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {/* VIP Ring indicator */}
                  <div className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none" />
                </div>
              ) : (
                <ChibiAvatar
                  config={user.avatarConfig}
                  size={96}
                  frameId={user.frameId || 'vip_gold'}
                />
              )}

              {/* Hover overlay hint for avatar */}
              {isCurrentUser && (
                <div className="absolute inset-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white z-10">
                  <Camera className="w-5 h-5 text-pink-400 mb-0.5" />
                  <span className="text-[9px] font-black">Cambiar Foto</span>
                </div>
              )}

              {/* Camera icon badge in corner */}
              {isCurrentUser && (
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-purple-600 border-2 border-[#1A0B2E] text-white shadow-lg group-hover:scale-110 transition z-20">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Right Badge: Gender / Age */}
            <div className="absolute -right-12 bottom-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border border-pink-400/50 text-[10px] font-black text-white shadow-md flex items-center gap-1">
              <span>{user.gender === 'female' ? '♀' : '♂'}</span>
              <span>{user.age || 22}</span>
            </div>
          </div>

          {/* Quick switcher between Photo and Chibi if user has uploaded photo */}
          {user.avatarUrl && (
            <div className="mt-2 flex items-center gap-1 p-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-[10px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('pop');
                  setViewMode('photo');
                }}
                className={`px-2 py-0.5 rounded-full font-bold transition ${
                  viewMode === 'photo' ? 'bg-[#FF2E9D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                📷 Foto Real
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('pop');
                  setViewMode('chibi');
                }}
                className={`px-2 py-0.5 rounded-full font-bold transition ${
                  viewMode === 'chibi' ? 'bg-[#FF2E9D] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                🧝 Chibi 3D
              </button>
            </div>
          )}

          {/* Nickname & ID */}
          <h2 className="font-heading font-black text-xl text-white mt-2 flex items-center gap-1.5">
            <span>{user.nickname}</span>
            {user.vip && <Crown className="w-4 h-4 text-yellow-400" />}
          </h2>
          <div className="text-[11px] font-mono text-purple-300 tracking-wider">
            ID: {user.idNumber || '8927392'}
          </div>

          {/* Signature / Bio */}
          <p className="text-xs text-gray-200 mt-2 text-center max-w-[280px] italic">
            "{bioText}"
          </p>

          {/* 3 Stats in Row: Followers | Following | Friends */}
          <div className="flex items-center justify-center gap-6 mt-3 w-full py-2 bg-purple-950/40 rounded-2xl border border-white/5">
            <div className="text-center">
              <div className="text-sm font-black text-white">{user.followersCount || 1420}</div>
              <div className="text-[10px] text-gray-400">Seguidores</div>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="text-center">
              <div className="text-sm font-black text-white">{user.followingCount || 230}</div>
              <div className="text-[10px] text-gray-400">Siguiendo</div>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="text-center">
              <div className="text-sm font-black text-white">{user.friendsCount || 98}</div>
              <div className="text-[10px] text-gray-400">Amigos</div>
            </div>
          </div>

          {/* Wealth Progress Bar */}
          <div className="w-full mt-3 px-2">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <div className="flex items-center gap-1 text-amber-300">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span>Nivel de Riqueza {user.wealthLevel || 12}</span>
              </div>
              <span className="text-gray-400 text-[10px]">7,500 / 10,000 XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden border border-purple-800/40">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full w-[75%]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full mt-3">
            {isCurrentUser ? (
              <button
                onClick={() => {
                  playSound('click');
                  if (onEditProfile) onEditProfile();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF2E9D] hover:bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg neon-glow-pink transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Perfil & Armario</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition ${
                    isFollowing
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-500/30'
                      : 'bg-[#FF2E9D] hover:bg-pink-600 text-white neon-glow-pink'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isFollowing ? 'Siguiendo' : 'Seguir'}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    if (onSendGiftToUser) onSendGiftToUser(user);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <GiftIcon className="w-4 h-4" />
                  <span>Regalar</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    if (onOpenDirectChat) onOpenDirectChat(user);
                  }}
                  className="p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-white transition"
                  title="Mensaje Privado"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs: Muro | Regalos | Insignias | Datos */}
        <div className="flex border-b border-purple-800/40 px-4 bg-[#1A0B2E]/50">
          {[
            { id: 'muro', label: 'Muro' },
            { id: 'regalos', label: 'Vitrina Regalos' },
            { id: 'insignias', label: 'Insignias' },
            { id: 'datos', label: 'Datos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex-1 py-2.5 text-xs font-extrabold transition relative ${
                activeTab === tab.id
                  ? 'text-[#FF2E9D]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2E9D] shadow-[0_0_8px_#FF2E9D]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'muro' && (
            <div className="space-y-3">
              {userMoments.map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/30 shadow-md">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                    <span>{m.date}</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                      {m.imageTag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">{m.text}</p>
                  <div className="flex items-center gap-4 mt-2.5 text-xs text-purple-300">
                    <span className="flex items-center gap-1 font-bold text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      {m.likes}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-gray-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {m.comments} comentarios
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'regalos' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-purple-300 font-bold">Colección 3D Recibida</span>
                <span className="text-yellow-400 font-black">Total: 48 regalos</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {ALL_GIFTS.slice(0, 9).map((gift) => (
                  <div
                    key={gift.id}
                    className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex flex-col items-center text-center shadow-md"
                  >
                    <GiftSvgIcon iconType={gift.iconType} size={42} />
                    <span className="text-[11px] font-bold text-white mt-1 truncate w-full">
                      {gift.name}
                    </span>
                    <span className="text-[10px] font-black text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded-full mt-0.5">
                      x{Math.floor(Math.random() * 8 + 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insignias' && (
            <div className="grid grid-cols-2 gap-2.5">
              {badgesList.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl bg-purple-950/30 border ${b.color} flex items-start gap-2.5 shadow-md`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-white">{b.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'datos' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  Ciudad / País
                </span>
                <span className="font-bold text-white">{user.city || 'Los Mochis, Sinaloa'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Signo Zodiacal
                </span>
                <span className="font-bold text-white">{user.zodiacSign || 'Escorpio ♏'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
                <span className="text-gray-400">Fecha de Nacimiento</span>
                <span className="font-bold text-white">{user.birthDate || '2004-11-14'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
                <span className="text-gray-400">Verificación de Cuenta</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verificado +18
                </span>
              </div>

              {/* Permissions & Photo Actions (Current User) */}
              {isCurrentUser && (
                <div className="pt-2 space-y-2">
                  <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                    Configuración de Medios & Sistema
                  </div>

                  <button
                    onClick={() => {
                      playSound('pop');
                      setCropperType('avatar');
                    }}
                    className="w-full p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/40 flex items-center justify-between text-white transition"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <Camera className="w-4 h-4 text-pink-400" />
                      <span>Subir Foto de Perfil (Recorte Circular)</span>
                    </span>
                    <span className="text-[10px] text-pink-300 font-mono">/avatars/{user.uid}.jpg</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound('pop');
                      setCropperType('banner');
                    }}
                    className="w-full p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/40 flex items-center justify-between text-white transition"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Subir Portada / Banner (16:9)</span>
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">/banners/{user.uid}.jpg</span>
                  </button>

                  {onOpenPermissions && (
                    <button
                      onClick={() => {
                        playSound('pop');
                        onOpenPermissions();
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-pink-900/40 hover:opacity-90 border border-purple-500/40 flex items-center justify-between text-white transition"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <Shield className="w-4 h-4 text-purple-300" />
                        <span>Permisos de la App (Mic, Cam, Galería, Notif)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                        Ver Estado
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Image Cropper Modal for Avatar & Banner */}
        {cropperType && (
          <ImageCropperModal
            isOpen={true}
            type={cropperType}
            currentUserId={user.uid}
            onImageSaved={(url, type, storagePath) => {
              const updatedUser = {
                ...user,
                [type === 'avatar' ? 'avatarUrl' : 'bannerUrl']: url,
              };
              if (type === 'avatar') {
                setViewMode('photo');
              }
              if (onUpdateUser) {
                onUpdateUser(updatedUser);
              }
              setCropperType(null);
            }}
            onClose={() => setCropperType(null)}
          />
        )}
      </div>
    </div>
  );
};
