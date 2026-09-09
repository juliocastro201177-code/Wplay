import React, { useState } from 'react';
import { X, Heart, MessageCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, RoomSeat } from '../../types';
import { playSound } from '../../utils/audio';

interface BottleSpinModalProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onOpenPrivateChatWith: (targetUser: { uid: string; nickname: string; level: number }) => void;
  onClose: () => void;
}

export const BottleSpinModal: React.FC<BottleSpinModalProps> = ({
  currentUser,
  roomSeats,
  onOpenPrivateChatWith,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [matchedUser, setMatchedUser] = useState<{ uid: string; nickname: string; level: number } | null>(null);

  // Filter occupied seats other than current user
  const otherUsers = roomSeats
    .filter((s) => s.user && s.user.uid !== currentUser.uid)
    .map((s) => s.user!) || [];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setMatchedUser(null);
    playSound('engine');

    // Random extra spins (between 4 and 8 full turns + random degrees)
    const extraTurns = Math.floor(Math.random() * 4 + 4) * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + extraTurns + randomAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      playSound('win');
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

      const target = otherUsers.length > 0
        ? otherUsers[Math.floor(Math.random() * otherUsers.length)]
        : { uid: 'bot_valeria', nickname: 'Valeria_CDMX', level: 32 };

      setMatchedUser({
        uid: target.uid,
        nickname: target.nickname,
        level: target.level || 15,
      });
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🍾</span>
          <h3 className="font-heading font-black text-lg text-white">Tumba la Botella</h3>
        </div>
        <p className="text-xs text-purple-300 mb-6">
          ¡Si caen juntos se desbloquea el chat privado automático!
        </p>

        {/* 3D Spinning Bottle Arena */}
        <div className="relative w-56 h-56 rounded-full bg-gradient-to-b from-purple-900/40 to-[#1A0B2E] border-2 border-purple-600/30 flex items-center justify-center shadow-inner mb-6">
          {/* Circular avatars markers */}
          <div className="absolute top-2 text-[10px] font-bold text-pink-300 bg-black/50 px-2 py-0.5 rounded-full">
            Valeria_CDMX
          </div>
          <div className="absolute right-2 text-[10px] font-bold text-blue-300 bg-black/50 px-2 py-0.5 rounded-full">
            El_Bélico
          </div>
          <div className="absolute bottom-2 text-[10px] font-bold text-yellow-300 bg-black/50 px-2 py-0.5 rounded-full">
            Tú ({currentUser.nickname})
          </div>
          <div className="absolute left-2 text-[10px] font-bold text-emerald-300 bg-black/50 px-2 py-0.5 rounded-full">
            Sofia_Gdl
          </div>

          {/* SVG 3D Bottle */}
          <div
            className="transition-transform duration-[3200ms] ease-out select-none"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg width="60" height="140" viewBox="0 0 60 140" fill="none" className="filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
              <rect x="25" y="8" width="10" height="28" rx="2" fill="#D97706" />
              <path d="M25 36 Q10 50 10 70 L10 120 C10 128 50 128 50 120 L50 70 Q50 50 35 36 Z" fill="#047857" stroke="#064E3B" strokeWidth="2" />
              <rect x="18" y="70" width="24" height="28" fill="#FEF3C7" rx="2" />
              <text x="21" y="86" fill="#78350F" fontSize="7" fontWeight="bold">WEPLAY</text>
              <ellipse cx="30" cy="12" rx="4" ry="2" fill="#DC2626" />
            </svg>
          </div>
        </div>

        {/* Matched Result */}
        {matchedUser && (
          <div className="mb-4 animate-in zoom-in-95 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 p-3.5 rounded-2xl w-full">
            <div className="flex items-center justify-center gap-1 text-pink-400 font-extrabold text-sm mb-1">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              <span>¡DESTINO ENCONTRADO!</span>
            </div>
            <p className="text-xs text-white">
              La botella cayó en <strong className="text-yellow-300">{matchedUser.nickname}</strong>
            </p>
            <button
              onClick={() => {
                playSound('pop');
                onClose();
                onOpenPrivateChatWith(matchedUser);
              }}
              className="mt-2.5 w-full py-2 rounded-xl bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md neon-glow-pink"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat Privado
            </button>
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-[#8B5CF6] text-white font-heading font-black text-sm shadow-xl neon-glow-pink hover:opacity-95 disabled:opacity-50 transition"
        >
          {isSpinning ? 'GIRANDO BOTELLA...' : '¡GIRAR BOTELLA! 🍾'}
        </button>
      </div>
    </div>
  );
};
