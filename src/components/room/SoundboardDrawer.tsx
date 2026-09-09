import React from 'react';
import { X, Volume2, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface SoundboardDrawerProps {
  onClose: () => void;
  onTriggerSound: (soundName: string, emoji: string) => void;
}

const SOUND_EFFECTS = [
  { id: 'applause', name: 'Aplausos', emoji: '👏', color: 'from-amber-500 to-yellow-500' },
  { id: 'laughter', name: 'Risas', emoji: '😂', color: 'from-pink-500 to-rose-500' },
  { id: 'fart', name: 'Pedo cómico', emoji: '💨', color: 'from-emerald-600 to-teal-700' },
  { id: 'drumroll', name: 'Redoble', emoji: '🥁', color: 'from-purple-600 to-indigo-600' },
  { id: 'horn', name: 'Trompeta / Claxon', emoji: '🎺', color: 'from-orange-500 to-amber-600' },
  { id: 'splat', name: 'Tomatazo', emoji: '🍅', color: 'from-red-600 to-rose-700' },
  { id: 'buzz', name: 'Error / Buzzer', emoji: '❌', color: 'from-red-700 to-red-900' },
  { id: 'win', name: 'Fanfarria VIP', emoji: '👑', color: 'from-yellow-400 to-amber-600' },
];

export const SoundboardDrawer: React.FC<SoundboardDrawerProps> = ({
  onClose,
  onTriggerSound,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#160724] border-t-2 border-purple-500/40 rounded-t-3xl p-4 shadow-2xl animate-slide-up max-w-lg mx-auto">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600 flex items-center justify-center text-sm">
            🎛️
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Efectos de Sonido en Vivo (Soundpad)</h3>
            <p className="text-[9px] text-purple-300">Toca para reproducir y animar a la sala de voz</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SOUND_EFFECTS.map(effect => (
          <button
            key={effect.id}
            onClick={() => {
              playSound(effect.id as any);
              onTriggerSound(effect.name, effect.emoji);
            }}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center gap-1 transition active:scale-95 group"
          >
            <span className="text-2xl group-hover:scale-110 transition">{effect.emoji}</span>
            <span className="text-[10px] font-bold text-purple-200 truncate w-full text-center">
              {effect.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
