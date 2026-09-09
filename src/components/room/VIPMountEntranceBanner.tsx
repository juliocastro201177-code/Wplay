import React, { useEffect, useState } from 'react';
import { Sparkles, Crown, Zap, Flame } from 'lucide-react';
import { User, VIPMount } from '../../types';
import { playSound } from '../../utils/audio';

interface VIPMountEntranceBannerProps {
  user: User;
  mount?: VIPMount;
  onFinish?: () => void;
}

export const DEFAULT_MOUNTS: VIPMount[] = [
  {
    id: 'cyber_ferrari',
    name: 'Cyber Ferrari Neón 2026',
    icon: '🏎️',
    tier: 'legendary',
    glowColor: 'from-pink-500 via-purple-600 to-cyan-400',
    bannerTitle: '¡LLEGÓ EN SU CYBER FERRARI NEÓN!',
    soundType: 'engine',
  },
  {
    id: 'golden_dragon',
    name: 'Dragón Imperial Ancestral',
    icon: '🐉',
    tier: 'legendary',
    glowColor: 'from-amber-400 via-yellow-500 to-red-600',
    bannerTitle: '¡DESCIENDE EL DRAGÓN IMPERIAL DORADO!',
    soundType: 'gift_huge',
  },
  {
    id: 'space_ufo',
    name: 'Nave Espacial Abductora',
    icon: '🛸',
    tier: 'diamond',
    glowColor: 'from-cyan-400 via-teal-500 to-indigo-600',
    bannerTitle: '¡ATERRIZAJE DE NAVE CÓSMICA!',
    soundType: 'engine',
  },
  {
    id: 'vip_heli',
    name: 'Helicóptero Platino VIP',
    icon: '🚁',
    tier: 'gold',
    glowColor: 'from-purple-500 via-indigo-600 to-pink-500',
    bannerTitle: '¡LLEGADA EXCLUSIVA EN HELICÓPTERO!',
    soundType: 'bass',
  },
];

export const VIPMountEntranceBanner: React.FC<VIPMountEntranceBannerProps> = ({
  user,
  mount = DEFAULT_MOUNTS[0],
  onFinish,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    playSound(mount.soundType || 'engine');

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, [mount]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex items-center justify-center px-4 overflow-hidden">
      {/* Moving Track */}
      <div className="w-full max-w-lg transform animate-in slide-in-from-right duration-700">
        <div className={`relative p-3.5 rounded-3xl bg-gradient-to-r ${mount.glowColor} p-[2px] shadow-[0_0_35px_rgba(255,46,157,0.5)]`}>
          <div className="bg-[#120726]/95 backdrop-blur-md rounded-3xl p-3 flex items-center justify-between border border-white/20">
            {/* Left Mount Graphic */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900 to-pink-900/60 border border-white/30 flex items-center justify-center text-3xl shadow-xl animate-pulse">
                  {mount.icon}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-400 text-black text-[9px] font-black shadow-md">
                  👑
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-yellow-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {mount.bannerTitle}
                  </span>
                </div>
                <div className="font-heading font-black text-white text-base flex items-center gap-1.5 mt-0.5">
                  <span>{user.nickname}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400/20 text-yellow-300 font-mono border border-yellow-400/40">
                    VIP {user.level || 32}
                  </span>
                </div>
                <div className="text-[10px] text-purple-200 font-medium">
                  Entrando con: <strong className="text-white">{mount.name}</strong>
                </div>
              </div>
            </div>

            {/* Right Wing Particle Light */}
            <div className="text-2xl animate-bounce pr-2">
              ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
