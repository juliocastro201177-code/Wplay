import React, { useState } from 'react';
import { X, Trophy, Crown, Flame, Heart, Shield, Star, Award } from 'lucide-react';
import { User, LeaderboardEntry } from '../../types';
import { playSound } from '../../utils/audio';

interface LeaderboardModalProps {
  currentUser: User;
  onClose: () => void;
  onOpenUserProfile?: (user: Partial<User>) => void;
}

const WEALTH_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, uid: 'u_carlos', name: 'Carlos_VIP', score: 185000, scoreLabel: '🪙 Donadas', vip: true, level: 48, title: '💎 Magnate Supremo' },
  { rank: 2, uid: 'u_lucia', name: 'Lucia_Reina', score: 142000, scoreLabel: '🪙 Donadas', vip: true, level: 42, title: '👑 Reina de la Noche' },
  { rank: 3, uid: 'u_matias', name: 'Matias_Flow', score: 98000, scoreLabel: '🪙 Donadas', vip: true, level: 36, title: '🐉 Domador de Dragones' },
  { rank: 4, uid: 'u_dani', name: 'Daniela_Pop', score: 65000, scoreLabel: '🪙 Donadas', vip: false, level: 29, title: '🎵 Voz de Oro' },
  { rank: 5, uid: 'u_jorge', name: 'Jorge_Gaming', score: 48000, scoreLabel: '🪙 Donadas', vip: false, level: 24, title: '🎲 Rey del Ludo' },
];

const CHARISMA_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, uid: 'u_valeria', name: 'Valeria_CDMX', score: 94200, scoreLabel: '🌹 Regalos Recibidos', vip: true, level: 45, title: '💖 Diosa del Carisma' },
  { rank: 2, uid: 'u_camila', name: 'Camila_Live', score: 81000, scoreLabel: '🌹 Regalos Recibidos', vip: true, level: 39, title: '💘 Rompecorazones' },
  { rank: 3, uid: 'u_esteban', name: 'Esteban_Voz', score: 67500, scoreLabel: '🌹 Regalos Recibidos', vip: true, level: 34, title: '🎤 Ídolo del Micrófono' },
  { rank: 4, uid: 'u_andrea', name: 'Andrea_Luna', score: 41200, scoreLabel: '🌹 Regalos Recibidos', vip: false, level: 27, title: '⭐ Estrella WePlay' },
  { rank: 5, uid: 'u_miguel', name: 'Miguelito', score: 32000, scoreLabel: '🌹 Regalos Recibidos', vip: false, level: 21, title: '🔥 Chico Fuego' },
];

const CP_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, uid: 'cp_1', name: 'Carlos_VIP ❤️ Lucia_Reina', score: 1840, scoreLabel: 'hrs Juntos', vip: true, level: 50, title: '💍 Amor Milenario' },
  { rank: 2, uid: 'cp_2', name: 'Valeria_CDMX ❤️ TÚ', score: 120, scoreLabel: 'hrs Juntos', vip: true, level: 12, title: '🏝️ Isla Desbloqueada' },
  { rank: 3, uid: 'cp_3', name: 'Matias_Flow ❤️ Sofia_Gamer', score: 98, scoreLabel: 'hrs Juntos', vip: false, level: 9, title: '💖 Juramento Dorado' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentUser,
  onClose,
  onOpenUserProfile,
}) => {
  const [category, setCategory] = useState<'wealth' | 'charisma' | 'cp'>('wealth');

  const getActiveList = () => {
    switch (category) {
      case 'wealth':
        return WEALTH_RANKINGS;
      case 'charisma':
        return CHARISMA_RANKINGS;
      case 'cp':
        return CP_RANKINGS;
    }
  };

  const list = getActiveList();
  const top1 = list[0];
  const top2 = list[1];
  const top3 = list[2];
  const rest = list.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#180829] border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600/40 via-purple-900/50 to-pink-600/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-lg border border-amber-300">
              🏆
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Salón de la Fama WePlay</h2>
              <p className="text-[10px] text-amber-200">Los mejores jugadores, donadores y parejas de la comunidad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-white/10 bg-[#230C39] p-1 gap-1">
          <button
            onClick={() => {
              playSound('click');
              setCategory('wealth');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              category === 'wealth' ? 'bg-amber-500 text-black shadow' : 'text-amber-200 hover:bg-white/5'
            }`}
          >
            <span>👑</span>
            <span>Riqueza</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setCategory('charisma');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              category === 'charisma' ? 'bg-pink-600 text-white shadow' : 'text-pink-200 hover:bg-white/5'
            }`}
          >
            <span>💖</span>
            <span>Carisma</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setCategory('cp');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              category === 'cp' ? 'bg-rose-600 text-white shadow' : 'text-rose-200 hover:bg-white/5'
            }`}
          >
            <span>💍</span>
            <span>Parejas CP</span>
          </button>
        </div>

        {/* Podium Top 3 */}
        <div className="p-4 pb-2 flex items-end justify-center gap-2 pt-6">
          {/* Rank 2 */}
          {top2 && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  {top2.name.slice(0, 2)}
                </div>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">🥈</span>
              </div>
              <span className="text-[10px] font-black text-white mt-1 truncate w-20 text-center">{top2.name}</span>
              <span className="text-[9px] text-slate-300 font-bold">{top2.score.toLocaleString()}</span>
              <div className="w-full h-14 rounded-t-xl bg-slate-700/60 mt-1 flex items-center justify-center font-black text-slate-300 text-sm">
                #2
              </div>
            </div>
          )}

          {/* Rank 1 (Tallest) */}
          {top1 && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <div className="w-18 h-18 rounded-full border-2 border-amber-400 bg-amber-950 flex items-center justify-center text-white font-bold text-sm shadow-xl animate-pulse">
                  {top1.name.slice(0, 2)}
                </div>
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</span>
              </div>
              <span className="text-[11px] font-black text-amber-300 mt-1 truncate w-24 text-center">{top1.name}</span>
              <span className="text-[9px] text-amber-200 font-bold">{top1.score.toLocaleString()}</span>
              <div className="w-full h-20 rounded-t-xl bg-gradient-to-t from-amber-600/60 to-yellow-500/60 mt-1 flex items-center justify-center font-black text-black text-base border-t-2 border-amber-300">
                #1
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3 && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-amber-700 bg-amber-900/60 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  {top3.name.slice(0, 2)}
                </div>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">🥉</span>
              </div>
              <span className="text-[10px] font-black text-white mt-1 truncate w-20 text-center">{top3.name}</span>
              <span className="text-[9px] text-amber-600 font-bold">{top3.score.toLocaleString()}</span>
              <div className="w-full h-10 rounded-t-xl bg-amber-900/40 mt-1 flex items-center justify-center font-black text-amber-500 text-sm">
                #3
              </div>
            </div>
          )}
        </div>

        {/* Ranks 4+ List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1 bg-black/20">
          {rest.map(item => (
            <div
              key={item.uid}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-center font-black text-xs text-purple-300">#{item.rank}</span>
                <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-xs font-bold text-white border border-purple-400/30">
                  {item.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{item.name}</h4>
                  <span className="text-[9px] text-purple-300 font-bold">{item.title}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-amber-300">{item.score.toLocaleString()}</span>
                <span className="text-[9px] text-purple-300 block">{item.scoreLabel}</span>
              </div>
            </div>
          ))}

          {/* Current User Row */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-800/40 to-pink-800/40 border border-purple-400/40 flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-300">TÚ</span>
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {currentUser.nickname.slice(0, 2)}
              </div>
              <span className="text-xs font-black text-white">{currentUser.nickname}</span>
            </div>
            <span className="text-xs font-black text-amber-300">🪙 {currentUser.coins.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
