import React, { useEffect } from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoupleRecord } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { playSound } from '../../utils/audio';

interface CoupleUnlockCelebrationProps {
  couple: CoupleRecord;
  onEnterIsland: () => void;
  onClose: () => void;
}

export const CoupleUnlockCelebration: React.FC<CoupleUnlockCelebrationProps> = ({
  couple,
  onEnterIsland,
  onClose,
}) => {
  useEffect(() => {
    playSound('romance');
    playSound('gift_huge');

    // Multi-burst romantic confetti
    const end = Date.now() + 2500;
    const colors = ['#FF2E9D', '#FF69B4', '#FFD700', '#A855F7', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#380E46] via-[#240A38] to-[#120422] border-2 border-pink-500/50 rounded-3xl p-6 shadow-[0_0_80px_rgba(255,46,157,0.4)] text-center overflow-hidden">
        {/* Glowing Background Elements */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Heart & Island Badge */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF2E9D] via-purple-600 to-amber-400 p-1 shadow-xl animate-bounce">
            <div className="w-full h-full rounded-full bg-[#1A0B2E] flex items-center justify-center text-3xl">
              🏝️
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] font-black tracking-widest uppercase mb-2">
          ¡CONEXIÓN DE VOZ 30 MINUTOS COMPLETADA!
        </span>

        <h2 className="font-heading font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-300 drop-shadow-md">
          ¡Isla de Parejas Desbloqueada!
        </h2>

        <p className="text-xs text-purple-200 mt-2 max-w-xs mx-auto leading-relaxed">
          Han conversado continuamente durante <strong>30 minutos</strong> en la sala de voz. Se ha registrado en la base de datos su refugio secreto y privado.
        </p>

        {/* Couple Avatars Facing Together */}
        <div className="my-5 p-4 rounded-2xl bg-black/40 border border-pink-500/30 flex items-center justify-around relative">
          {/* User 1 */}
          <div className="flex flex-col items-center">
            <ChibiAvatar config={couple.user1AvatarConfig} size={70} frameId="vip_gold" />
            <span className="font-heading font-black text-xs text-white mt-1.5 truncate max-w-[90px]">
              {couple.user1Name}
            </span>
          </div>

          {/* Connected Heart Beat */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF2E9D] to-purple-600 flex items-center justify-center shadow-[0_0_15px_#FF2E9D] animate-pulse">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-[10px] font-mono font-bold text-pink-300 mt-1">30:00+</span>
            <span className="text-[9px] text-amber-300 font-bold">100% Match</span>
          </div>

          {/* User 2 */}
          <div className="flex flex-col items-center">
            <ChibiAvatar config={couple.user2AvatarConfig} size={70} frameId="vip_gold" />
            <span className="font-heading font-black text-xs text-white mt-1.5 truncate max-w-[90px]">
              {couple.user2Name}
            </span>
          </div>
        </div>

        {/* Unlocked Perks List */}
        <div className="grid grid-cols-2 gap-2 text-left mb-6">
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-700/30 flex items-center gap-2">
            <span className="text-lg">💬</span>
            <div>
              <div className="text-[11px] font-bold text-white">Chat Íntimo 1 a 1</div>
              <div className="text-[9px] text-purple-300">Mensajería privada 24/7</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-700/30 flex items-center gap-2">
            <span className="text-lg">📸</span>
            <div>
              <div className="text-[11px] font-bold text-white">Diario Secreto</div>
              <div className="text-[9px] text-purple-300">Momentos solo para dos</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              playSound('pop');
              onEnterIsland();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-[#8B5CF6] text-white font-heading font-black text-sm shadow-[0_0_25px_#FF2E9D] hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <span>¡Entrar a Nuestra Isla de Parejas!</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="text-xs text-purple-300 hover:text-white py-1 transition"
          >
            Continuar en la Sala de Voz
          </button>
        </div>
      </div>
    </div>
  );
};
