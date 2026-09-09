import React, { useState } from 'react';
import { Sparkles, Send, X, Flame } from 'lucide-react';
import { GlobalMegaphoneAnnouncement, User } from '../../types';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface GlobalMegaphoneBannerProps {
  announcement: GlobalMegaphoneAnnouncement | null;
  onSendMegaphone: (text: string, style: 'golden_rocket' | 'love_heart' | 'neon_dragon') => void;
  currentUser: User;
  onCloseBanner: () => void;
}

export const GlobalMegaphoneBanner: React.FC<GlobalMegaphoneBannerProps> = ({
  announcement,
  onSendMegaphone,
  currentUser,
  onCloseBanner,
}) => {
  if (!announcement) return null;

  return (
    <div className="fixed top-14 inset-x-3 z-50 pointer-events-auto animate-bounce max-w-lg mx-auto">
      <div className="relative p-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white shadow-2xl border-2 border-yellow-300 flex items-center justify-between gap-2 overflow-hidden">
        {/* Shimmer Light */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        <div className="flex items-center gap-2.5 z-10 overflow-hidden">
          <span className="text-2xl animate-pulse shrink-0">
            {announcement.style === 'golden_rocket' ? '🚀' : announcement.style === 'love_heart' ? '💖' : '🐉'}
          </span>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-yellow-200 uppercase tracking-wider">
                [MEGÁFONO GLOBAL]
              </span>
              <span className="text-xs font-black text-white truncate">{announcement.senderName}:</span>
            </div>
            <p className="text-xs font-bold text-white drop-shadow truncate">{announcement.text}</p>
          </div>
        </div>

        <button
          onClick={onCloseBanner}
          className="w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center shrink-0 z-10"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

interface SendMegaphoneModalProps {
  currentUser: User;
  onClose: () => void;
  onSend: (text: string, style: 'golden_rocket' | 'love_heart' | 'neon_dragon') => void;
}

export const SendMegaphoneModal: React.FC<SendMegaphoneModalProps> = ({
  currentUser,
  onClose,
  onSend,
}) => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState<'golden_rocket' | 'love_heart' | 'neon_dragon'>('golden_rocket');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (currentUser.coins < 150) {
      playSound('buzz');
      return;
    }
    playSound('horn');
    playSound('gift_huge');
    confetti({ particleCount: 70, spread: 80 });
    onSend(text.trim(), style);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#19062A] border-2 border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📢</span>
            <div>
              <h3 className="text-sm font-black text-white">Megáfono Global de Servidor</h3>
              <p className="text-[10px] text-amber-300">Cruza la pantalla de todas las salas y el lobby (Costo: 150 🪙)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-75">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSend} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-purple-200 block mb-1">Estilo de Vuelo:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStyle('golden_rocket')}
                className={`p-2 rounded-xl border text-xs font-black flex items-center justify-center gap-1 transition ${
                  style === 'golden_rocket'
                    ? 'bg-amber-500 text-black border-amber-300'
                    : 'bg-white/5 text-white border-white/10'
                }`}
              >
                <span>🚀</span> Cohete
              </button>
              <button
                type="button"
                onClick={() => setStyle('love_heart')}
                className={`p-2 rounded-xl border text-xs font-black flex items-center justify-center gap-1 transition ${
                  style === 'love_heart'
                    ? 'bg-pink-600 text-white border-pink-400'
                    : 'bg-white/5 text-white border-white/10'
                }`}
              >
                <span>💖</span> Amor
              </button>
              <button
                type="button"
                onClick={() => setStyle('neon_dragon')}
                className={`p-2 rounded-xl border text-xs font-black flex items-center justify-center gap-1 transition ${
                  style === 'neon_dragon'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-white/5 text-white border-white/10'
                }`}
              >
                <span>🐉</span> Dragón
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-purple-200 block mb-1">Mensaje para la Comunidad:</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={80}
              placeholder="Ej: ¡Busco gente buena onda para jugar Ludo y cantar en sala!"
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-purple-400/40 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
            <span className="text-[10px] text-purple-300 text-right block">{text.length}/80 caracteres</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <span>📢</span>
            <span>¡Lanzar Megáfono Global (150 🪙)!</span>
          </button>
        </form>
      </div>
    </div>
  );
};
