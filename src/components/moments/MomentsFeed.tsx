import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Gift as GiftIcon, 
  Send, 
  Plus, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  Crown,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, MomentPost, Gift } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { playSound } from '../../utils/audio';

interface MomentsFeedProps {
  currentUser: User;
  onSendGiftToAuthor: (authorName: string) => void;
  onOpenUserProfile: (user: User) => void;
}

export const MomentsFeed: React.FC<MomentsFeedProps> = ({
  currentUser,
  onSendGiftToAuthor,
  onOpenUserProfile,
}) => {
  const [feedTab, setFeedTab] = useState<'para_ti' | 'siguiendo' | 'cerca'>('para_ti');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // New post form
  const [isPosting, setIsPosting] = useState(false);
  const [newPostText, setNewPostText] = useState('');

  const [posts, setPosts] = useState<MomentPost[]>([
    {
      id: 'post_1',
      author: {
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
      text: '¡Terminó la noche de Draw & Guess y ganamos el primer lugar! 🎨🏆 Gracias a los que me mandaron el Ramo Buchón de 100 Rosas 🌹🖤',
      timestamp: Date.now() - 1000 * 60 * 35,
      likesCount: 184,
      commentsCount: 42,
      audioDurationSeconds: 12,
      tags: ['#DrawAndGuess', '#WePlayLATAM', '#CDMX'],
    },
    {
      id: 'post_2',
      author: {
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
      text: 'Aquí paseando la blindada en la sala 🚗💨 Quien se suba al asiento 2 le regalo un Buchón Truck en vivo 🔥',
      timestamp: Date.now() - 1000 * 60 * 95,
      likesCount: 342,
      commentsCount: 78,
      tags: ['#Bélico', '#TrocaBlindada', '#Sinaloa'],
    },
  ]);

  const handleToggleLike = (postId: string) => {
    playSound('pop');
    if (likedPosts.includes(postId)) {
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount - 1 } : p))
      );
    } else {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setLikedPosts((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
      );
    }
  };

  const handleToggleAudio = (postId: string) => {
    playSound('coin');
    if (isPlayingAudioId === postId) {
      setIsPlayingAudioId(null);
    } else {
      setIsPlayingAudioId(postId);
      setTimeout(() => setIsPlayingAudioId(null), 6000);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    playSound('coin');
    const newPost: MomentPost = {
      id: Date.now().toString(),
      author: currentUser,
      text: newPostText.trim(),
      timestamp: Date.now(),
      likesCount: 1,
      commentsCount: 0,
      tags: ['#WePlay', '#LATAM'],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setIsPosting(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1A0B2E] select-none">
      {/* Top Tabs */}
      <div className="flex items-center justify-around border-b border-purple-800/40 bg-[#1A0B2E]/90 py-3 px-4">
        {[
          { id: 'para_ti', label: 'Para Ti 🔥' },
          { id: 'siguiendo', label: 'Siguiendo 👥' },
          { id: 'cerca', label: 'Cerca de Mí 📍' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setFeedTab(tab.id as typeof feedTab);
            }}
            className={`text-xs font-black transition relative pb-1 ${
              feedTab === tab.id ? 'text-[#FF2E9D]' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            {feedTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2E9D] shadow-[0_0_8px_#FF2E9D]" />
            )}
          </button>
        ))}
      </div>

      {/* New Post Creator Trigger */}
      <div className="p-4 border-b border-purple-900/40 bg-[#25133E]/50">
        <div className="flex items-center gap-3">
          <ChibiAvatar config={currentUser.avatarConfig} size={42} frameId={currentUser.frameId} />
          <button
            onClick={() => setIsPosting(true)}
            className="flex-1 text-left bg-purple-950/60 hover:bg-purple-900/60 border border-purple-600/30 rounded-full px-4 py-2.5 text-xs text-purple-300 transition"
          >
            ¿Qué estás pensando hoy en WePlay? ✨
          </button>
        </div>
      </div>

      {/* Modal / Overlay for Creating Moment */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/40 rounded-3xl p-5 shadow-2xl">
            <h3 className="font-heading font-black text-sm text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF2E9D]" />
              Nuevo Momento WePlay
            </h3>
            <textarea
              rows={4}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Escribe lo que sientes, presume tu racha de juegos o saluda a la comunidad..."
              className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-2xl p-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#FF2E9D]"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 text-xs">
                <span className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1 cursor-pointer hover:bg-white/10">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> Foto
                </span>
                <span className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1 cursor-pointer hover:bg-white/10">
                  <Volume2 className="w-3.5 h-3.5 text-yellow-400" /> Nota de voz
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPosting(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-1.5 rounded-xl bg-[#FF2E9D] text-white font-black text-xs shadow-md neon-glow-pink hover:bg-pink-600"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {posts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const isPlayingAudio = isPlayingAudioId === post.id;
          return (
            <div
              key={post.id}
              className="p-4 rounded-3xl bg-gradient-to-b from-[#26133F] to-[#1C0D32] border border-purple-700/30 shadow-xl"
            >
              {/* Post Author Info */}
              <div className="flex items-center justify-between mb-3">
                <div
                  onClick={() => onOpenUserProfile(post.author)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <ChibiAvatar
                    config={post.author.avatarConfig}
                    size={46}
                    frameId={post.author.frameId}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-black text-sm text-white group-hover:text-[#FF2E9D] transition">
                        {post.author.nickname}
                      </span>
                      {post.author.vip && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-purple-300">
                      <span>Nv.{post.author.level || 20}</span>
                      <span>•</span>
                      <span>Hace 40 min</span>
                    </div>
                  </div>
                </div>

                {/* Send gift directly to post author */}
                <button
                  onClick={() => {
                    playSound('pop');
                    onSendGiftToAuthor(post.author.nickname);
                  }}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[11px] shadow-sm flex items-center gap-1 hover:opacity-95"
                >
                  <GiftIcon className="w-3 h-3" />
                  <span>Regalar</span>
                </button>
              </div>

              {/* Text Body */}
              <p className="text-xs text-gray-200 leading-relaxed">{post.text}</p>

              {/* Audio Note (If Present) */}
              {post.audioDurationSeconds && (
                <div className="mt-3 flex items-center gap-3 bg-purple-950/60 p-2.5 rounded-2xl border border-purple-500/30 max-w-xs">
                  <button
                    onClick={() => handleToggleAudio(post.id)}
                    className="w-8 h-8 rounded-full bg-[#FF2E9D] flex items-center justify-center text-white shadow-md"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <div className={`h-2 rounded-full flex-1 ${isPlayingAudio ? 'bg-pink-400 animate-pulse' : 'bg-purple-800'}`} />
                      <div className={`h-3 rounded-full flex-1 ${isPlayingAudio ? 'bg-pink-400 animate-pulse delay-75' : 'bg-purple-800'}`} />
                      <div className={`h-4 rounded-full flex-1 ${isPlayingAudio ? 'bg-pink-400 animate-pulse delay-150' : 'bg-purple-800'}`} />
                      <div className={`h-2 rounded-full flex-1 ${isPlayingAudio ? 'bg-pink-400 animate-pulse' : 'bg-purple-800'}`} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-pink-300">
                    {post.audioDurationSeconds}s
                  </span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold text-pink-400">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Interactions Footer: Like, Comment, Share */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-purple-800/30 text-xs text-gray-400">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition ${
                    isLiked ? 'text-pink-500' : 'hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-white transition">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount} comentarios</span>
                </button>

                <button className="hover:text-white transition">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
