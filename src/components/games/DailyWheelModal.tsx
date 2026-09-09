import React, { useState } from 'react';
import { X, Sparkles, Trophy, Award, Gift } from 'lucide-react';
import { User } from '../../types';
import { playSound } from '../../utils/audio';

interface DailyWheelModalProps {
  currentUser: User;
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

interface WheelPrize {
  id: string;
  name: string;
  coins: number;
  icon: string;
  color: string;
}

const PRIZES: WheelPrize[] = [
  { id: 'p1', name: '500 Monedas', coins: 500, icon: '🪙', color: 'from-amber-500 to-yellow-600' },
  { id: 'p2', name: 'Marco Dragón', coins: 300, icon: '🐉', color: 'from-purple-600 to-pink-600' },
  { id: 'p3', name: '1,000 Monedas', coins: 1000, icon: '💰', color: 'from-emerald-500 to-teal-600' },
  { id: 'p4', name: 'Cyber Ferrari', coins: 800, icon: '🏎️', color: 'from-rose-600 to-red-600' },
  { id: 'p5', name: '250 Monedas', coins: 250, icon: '🪙', color: 'from-blue-500 to-indigo-600' },
  { id: 'p6', name: '999 Rosas VIP', coins: 600, icon: '🌹', color: 'from-pink-500 to-rose-600' },
  { id: 'p7', name: '2,000 Monedas', coins: 2000, icon: '💎', color: 'from-yellow-400 to-amber-500' },
  { id: 'p8', name: '100 Monedas', coins: 100, icon: '🪙', color: 'from-violet-600 to-purple-800' },
];

export const DailyWheelModal: React.FC<DailyWheelModalProps> = ({
  currentUser,
  onClose,
  onRewardCoins,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelPrize | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  const handleSpin = () => {
    if (isSpinning || hasSpunToday) return;
    setIsSpinning(true);
    playSound('horn');

    // Pick random prize
    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const selected = PRIZES[randomIndex];

    // Calculate rotation: 5 full spins (1800 deg) + wedge angle
    const sliceAngle = 360 / PRIZES.length;
    const targetAngle = 1800 + randomIndex * sliceAngle + sliceAngle / 2;

    setRotation(targetAngle);

    // Audio ticks during spin
    let tickCount = 0;
    const interval = setInterval(() => {
      playSound('click');
      tickCount++;
      if (tickCount > 15) clearInterval(interval);
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      setWonPrize(selected);
      setHasSpunToday(true);
      playSound('win');
      onRewardCoins(selected.coins);
    }, 4200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#1A082C] border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-600/30 via-purple-900/40 to-pink-600/30 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-lg shadow-md">
              🎡
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                Ruleta de la Suerte WePlay
                <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[8px] font-bold">
                  GRATIS HOY
                </span>
              </h2>
              <p className="text-[10px] text-purple-300">¡Gira y gana monedas, monturas y marcos VIP!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Wheel Stage */}
        <div className="p-4 flex flex-col items-center justify-center">
          {/* Daily Streak Indicator */}
          <div className="flex items-center gap-1 mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-[10px] text-purple-200 font-bold">Racha Diaria:</span>
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <span
                key={day}
                className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${
                  day <= 3
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'bg-white/10 text-purple-400'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Wheel Graphic Container */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Top Indicator Arrow */}
            <div className="absolute -top-3 z-30 text-2xl filter drop-shadow animate-bounce">
              🔻
            </div>

            {/* Rotating Wheel Disc */}
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              }}
              className="w-60 h-60 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden relative bg-[#240A3D]"
            >
              {PRIZES.map((prize, idx) => {
                const angle = (360 / PRIZES.length) * idx;
                return (
                  <div
                    key={prize.id}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 100%',
                    }}
                    className="absolute top-0 left-[22%] w-[56%] h-[50%] flex flex-col items-center pt-2 text-center"
                  >
                    <span className="text-xl filter drop-shadow">{prize.icon}</span>
                    <span className="text-[9px] font-black text-white leading-none mt-0.5">
                      {prize.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Hub Button */}
            <button
              disabled={isSpinning || hasSpunToday}
              onClick={handleSpin}
              className={`absolute z-20 w-16 h-16 rounded-full font-black text-xs uppercase shadow-2xl flex flex-col items-center justify-center border-4 border-amber-300 transition-all ${
                !hasSpunToday && !isSpinning
                  ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-black hover:scale-105 active:scale-95 animate-pulse'
                  : 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
              }`}
            >
              <span>{isSpinning ? '...' : hasSpunToday ? 'LISTO' : 'GIRAR'}</span>
            </button>
          </div>

          {/* Result or Status */}
          {wonPrize ? (
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-400/50 text-center w-full animate-bounce">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">¡PREMIO OBTENIDO!</span>
              <h4 className="text-sm font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
                <span>{wonPrize.icon}</span>
                <span>{wonPrize.name}</span>
              </h4>
              <p className="text-[10px] text-purple-200">+{wonPrize.coins} Monedas acreditadas a tu cuenta</p>
            </div>
          ) : (
            <p className="text-[11px] text-purple-300 mt-4 text-center">
              1 Giro diario gratuito. Vuelve mañana para multiplicar tu racha.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
