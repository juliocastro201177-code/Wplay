import React, { useState } from 'react';
import { X, Sparkles, Trophy, Users, Heart, Disc, Flame } from 'lucide-react';
import { User, RoomSeat, GameType } from '../../types';
import { playSound } from '../../utils/audio';

interface MiniGamesModalProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onSelectGame: (game: GameType) => void;
  onOpenBottleSpin: () => void;
  onClose: () => void;
}

export const MiniGamesModal: React.FC<MiniGamesModalProps> = ({
  currentUser,
  roomSeats,
  onSelectGame,
  onOpenBottleSpin,
  onClose,
}) => {
  const games = [
    {
      id: 'draw_and_guess' as GameType,
      title: 'Draw & Guess (Píntalo)',
      badge: 'POPULAR 🔥',
      players: '2-8 Jugadores',
      desc: 'Dibuja en la pizarra en tiempo real mientras los demás adivinan la palabra secreta.',
      color: 'from-pink-500 to-rose-600',
      icon: '🎨',
      playable: true,
    },
    {
      id: 'bottle_spin' as GameType,
      title: 'Tumba la Botella 3D',
      badge: 'CITAS / PAREJA 💘',
      players: '4-8 Jugadores',
      desc: 'Gira la botella en el centro de la sala. Si caen juntos se desbloquea chat privado.',
      color: 'from-purple-600 to-indigo-600',
      icon: '🍾',
      playable: true,
    },
    {
      id: 'space_werewolf' as GameType,
      title: 'Space Werewolf / Mafia',
      badge: 'ESTRATEGIA 🐺',
      players: '6-10 Jugadores',
      desc: 'Roles secretos, tripulantes vs impostores en nave espacial, debate por voz y votación.',
      color: 'from-amber-600 to-red-600',
      icon: '🚀',
      playable: true,
    },
    {
      id: 'who_is_spy' as GameType,
      title: "Who's the Spy (El Espía)",
      badge: 'DESMADRE 🕵️',
      players: '4-8 Jugadores',
      desc: 'Todos reciben la misma palabra excepto un espía infiltrado. Describe sin delatarte.',
      color: 'from-blue-600 to-cyan-600',
      icon: '🔍',
      playable: true,
    },
    {
      id: 'karaoke' as GameType,
      title: 'Mic Grab / Karaoke',
      badge: 'CANTAR 🎤',
      players: 'Toda la sala',
      desc: 'Robo de micrófono con los mejores éxitos latinos. Votación del público con aplausos.',
      color: 'from-yellow-500 to-amber-600',
      icon: '🎵',
      playable: true,
    },
    {
      id: 'truth_or_dare' as GameType,
      title: '100 Preguntas Incómodas',
      badge: 'VERDAD O RETO 😈',
      players: 'Todos',
      desc: 'Cartas candentes de verdad o reto picantes para romper el hielo y confesar secretos.',
      color: 'from-red-500 to-pink-600',
      icon: '🃏',
      playable: true,
    },
    {
      id: 'uno' as GameType,
      title: 'UNO Online con Voz',
      badge: 'CLÁSICO 🃏',
      players: '2-4 Jugadores',
      desc: 'Cartas +4, cambios de color y grita UNO antes de que te atrapen los demás.',
      color: 'from-emerald-500 to-teal-600',
      icon: '🎴',
      playable: true,
    },
    {
      id: 'ludo' as GameType,
      title: 'Ludo King con Apuestas',
      badge: 'MONEDAS 🎲',
      players: '2-4 Jugadores',
      desc: 'Dados rápidos y apuestas de monedas por llegar a la meta en primer lugar.',
      color: 'from-violet-600 to-purple-800',
      icon: '🎲',
      playable: true,
    },
    {
      id: 'word_bomb' as GameType,
      title: 'Pasa la Bomba WePlay',
      badge: 'EXPLOSIVO 💣',
      players: '2-8 Jugadores',
      desc: 'Di una palabra con la sílaba indicada antes de que la mecha se consuma y explote en tu cara.',
      color: 'from-orange-500 to-red-600',
      icon: '💣',
      playable: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-800/40 bg-[#1A0B2E]/70">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <div>
              <h2 className="font-heading font-extrabold text-base text-white">Party Games Bar WePlay 2026</h2>
              <p className="text-[11px] text-purple-300">Juegos sincronizados en tiempo real dentro de tu sala</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Party Games */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                playSound('click');
                if (g.id === 'bottle_spin') {
                  onOpenBottleSpin();
                } else {
                  onSelectGame(g.id);
                }
              }}
              className="group cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-purple-900/20 border border-purple-700/30 hover:border-[#FF2E9D] hover:scale-[1.01] transition shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition`}>
                  {g.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-sm text-white">{g.title}</h3>
                    <span className="text-[9px] font-black bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">
                      {g.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-1">{g.desc}</p>
                  <span className="text-[10px] text-purple-400 font-semibold">{g.players}</span>
                </div>
              </div>

              <button className="px-3 py-1.5 rounded-xl bg-[#FF2E9D] text-white text-xs font-bold shadow-md neon-glow-pink group-hover:bg-pink-500 transition">
                Jugar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
