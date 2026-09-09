import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { User, RoomSeat } from '../../types';
import { playSound } from '../../utils/audio';

interface SeatInteractionModalProps {
  currentUser: User;
  targetSeat: RoomSeat;
  onClose: () => void;
  onThrowItem: (targetUserName: string, item: { name: string; emoji: string; sound: 'splat' | 'pop' | 'romance' | 'bass' }) => void;
  onViewProfile?: () => void;
}

const ITEMS = [
  { id: 'tomato', name: 'Tomatazo', emoji: '🍅', desc: '¡Estrellar tomate!', sound: 'splat' as const },
  { id: 'chancla', name: 'Chanclazo', emoji: '🩴', desc: '¡Chanclazo de mamá!', sound: 'splat' as const },
  { id: 'rose', name: 'Rosa de Amor', emoji: '🌹', desc: 'Regalar flor tierna', sound: 'romance' as const },
  { id: 'kiss', name: 'Beso Volador', emoji: '💋', desc: 'Mandar besito caliente', sound: 'pop' as const },
  { id: 'water', name: 'Cubeta de Agua', emoji: '💦', desc: '¡Empaparlo de golpe!', sound: 'splat' as const },
  { id: 'bomb', name: 'Bomba Cómica', emoji: '💣', desc: '¡Hacerlo volar!', sound: 'bass' as const },
];

export const SeatInteractionModal: React.FC<SeatInteractionModalProps> = ({
  currentUser,
  targetSeat,
  onClose,
  onThrowItem,
  onViewProfile,
}) => {
  if (!targetSeat.user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xs bg-[#19082C] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-3 bg-[#240D3D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={targetSeat.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={targetSeat.user.nickname}
              className="w-8 h-8 rounded-full object-cover border border-purple-400"
            />
            <div>
              <span className="text-[9px] text-purple-300">Interacción de Asiento #{targetSeat.index + 1}</span>
              <h3 className="text-xs font-black text-white">{targetSeat.user.nickname}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={13} />
          </button>
        </div>

        {/* Items Grid */}
        <div className="p-3 grid grid-cols-3 gap-2">
          {ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                playSound(item.sound);
                onThrowItem(targetSeat.user!.nickname, item);
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center gap-1 transition active:scale-90 group"
            >
              <span className="text-3xl group-hover:scale-110 transition">{item.emoji}</span>
              <span className="text-[10px] font-black text-white text-center leading-tight">
                {item.name}
              </span>
              <span className="text-[8px] text-purple-300 text-center leading-tight">
                {item.desc}
              </span>
            </button>
          ))}
        </div>

        {onViewProfile && (
          <div className="p-3 pt-0">
            <button
              onClick={() => {
                playSound('click');
                onClose();
                onViewProfile();
              }}
              className="w-full py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-white font-bold text-xs transition"
            >
              Ver Perfil Completo 👤
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
