import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift } from '../../types';
import { GiftSvgIcon } from './GiftSvgIcon';
import { playSound, speakAnnouncement } from '../../utils/audio';

interface GiftAnimationOverlayProps {
  activeGift: {
    gift: Gift;
    senderName: string;
    receiverName: string;
    count: number;
  } | null;
  onComplete: () => void;
}

export const GiftAnimationOverlay: React.FC<GiftAnimationOverlayProps> = ({
  activeGift,
  onComplete,
}) => {
  useEffect(() => {
    if (!activeGift) return;

    const { gift, senderName, receiverName } = activeGift;

    // Trigger audio effects
    if (gift.price >= 1000) {
      playSound('gift_huge');
      speakAnnouncement(`¡REGALAZO! ¡${senderName} le mandó ${gift.name} a ${receiverName}!`);
    } else if (gift.id === 'italika_moto' || gift.id === 'buchona_truck') {
      playSound('engine');
    } else if (gift.price >= 300) {
      playSound('gift_huge');
    } else {
      playSound('gift_small');
    }

    // Burst confetti for premium gifts
    if (gift.price >= 500) {
      confetti({
        particleCount: gift.price >= 5000 ? 150 : 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF2E9D', '#FBBF24', '#8B5CF6', '#10B981', '#FFFFFF'],
      });
    }

    // Vibrator on mobile if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(gift.price >= 1000 ? [100, 50, 150, 50, 200] : [80]);
      } catch {
        // Safe fail
      }
    }

    const timer = setTimeout(() => {
      onComplete();
    }, gift.durationSeconds * 1000);

    return () => clearTimeout(timer);
  }, [activeGift, onComplete]);

  if (!activeGift) return null;

  const { gift, senderName, receiverName, count } = activeGift;
  const isHighValue = gift.price >= 1000;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      {/* Dark overlay backdrop with animated radial glow */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          gift.isFullScreen ? 'bg-black/65 backdrop-blur-[2px]' : 'bg-transparent'
        }`} 
      />

      {/* Top Banner Alert */}
      <div className="absolute top-16 z-20 animate-bounce flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF2E9D] via-[#8B5CF6] to-[#FF2E9D] shadow-2xl border border-white/30 text-white font-heading">
        <span className="text-xl font-black tracking-wider text-yellow-300">
          {isHighValue ? '🔥 ¡REGALAZO ÉPICO! 🔥' : '✨ ¡REGALO ENVIADO! ✨'}
        </span>
        <div className="text-sm font-semibold flex items-center gap-1.5">
          <span className="text-yellow-200 font-bold">{senderName}</span>
          <span className="opacity-80">envió a</span>
          <span className="text-pink-200 font-bold">{receiverName}</span>
        </div>
      </div>

      {/* Main 3D / SVG Animation Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6">
        {/* Dynamic animations depending on gift type */}
        {gift.id === 'buchona_truck' ? (
          <div className="animate-[slideTruck_3.5s_ease-in-out_forwards] flex flex-col items-center">
            <GiftSvgIcon iconType={gift.iconType} size={220} className="filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]" />
            <div className="text-xl font-black text-emerald-400 bg-black/70 px-4 py-1 rounded-full border border-emerald-500/50 mt-2">
              🚗💨 ¡TRUCKÓN BLINDADO!
            </div>
          </div>
        ) : gift.id === 'italika_moto' ? (
          <div className="animate-[slideMoto_3s_ease-in-out_forwards] flex flex-col items-center">
            <GiftSvgIcon iconType={gift.iconType} size={180} className="filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]" />
            <div className="text-lg font-black text-red-400 bg-black/70 px-4 py-1 rounded-full border border-red-500/50 mt-2">
              🏍️💨 ¡A TODO GAS!
            </div>
          </div>
        ) : gift.id === 'military_heli' || gift.id === 'private_jet' ? (
          <div className="animate-[flyHeli_4.5s_ease-in-out_forwards] flex flex-col items-center">
            <GiftSvgIcon iconType={gift.iconType} size={220} className="filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.9)]" />
            <div className="text-xl font-black text-cyan-300 bg-black/70 px-5 py-1 rounded-full border border-cyan-400/50 mt-3">
              ✈️ ATERRIZAJE VIP
            </div>
          </div>
        ) : gift.id === 'server_god' ? (
          <div className="animate-pulse flex flex-col items-center scale-125">
            <div className="relative">
              <div className="absolute -inset-8 bg-amber-400/30 rounded-full blur-2xl animate-ping" />
              <GiftSvgIcon iconType={gift.iconType} size={240} className="relative z-10 filter drop-shadow-[0_0_30px_#F59E0B]" />
            </div>
            <div className="text-2xl font-black text-amber-300 bg-gradient-to-r from-amber-600 to-yellow-500 px-8 py-2 rounded-2xl border-2 border-white shadow-2xl mt-4">
              👑 ¡DIOS DEL SERVER! 👑
            </div>
          </div>
        ) : (
          /* Standard floating / scaling 3D Chibi gift */
          <div className="flex flex-col items-center animate-speaking">
            <div className="relative">
              <div 
                className="absolute -inset-6 rounded-full blur-xl opacity-80"
                style={{ backgroundColor: gift.accentColor }} 
              />
              <GiftSvgIcon 
                iconType={gift.iconType} 
                size={isHighValue ? 200 : 140} 
                className="relative z-10 animate-float drop-shadow-2xl" 
              />
            </div>
            <div className="mt-4 flex items-center gap-3 bg-black/80 px-6 py-2 rounded-2xl border border-white/20 shadow-2xl">
              <span className="font-heading font-extrabold text-xl text-white">
                {gift.name}
              </span>
              <span className="font-black text-2xl text-yellow-400 bg-yellow-950/60 px-3 py-0.5 rounded-lg border border-yellow-500/40">
                x{count}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideTruck {
          0% { transform: translateX(120vw) scale(0.7); }
          50% { transform: translateX(0) scale(1.1); }
          80% { transform: translateX(-10px) scale(1.05); }
          100% { transform: translateX(-120vw) scale(0.8); }
        }
        @keyframes slideMoto {
          0% { transform: translateX(110vw) rotate(-5deg); }
          40% { transform: translateX(0) rotate(5deg) scale(1.1); }
          75% { transform: translateX(-20px) rotate(0deg); }
          100% { transform: translateX(-110vw) scale(0.9); }
        }
        @keyframes flyHeli {
          0% { transform: translate(-100vw, -30vh) scale(0.6); }
          45% { transform: translate(0, 0) scale(1.15); }
          70% { transform: translate(10px, -10px) scale(1.1); }
          100% { transform: translate(110vw, -40vh) scale(0.7); }
        }
      `}</style>
    </div>
  );
};
