import React from 'react';
import { Gamepad2, Trophy, Flame, Users, Sparkles, Star } from 'lucide-react';
import { GameType } from '../../types';
import { playSound } from '../../utils/audio';

interface PartyGamesTabProps {
  onPlayGame: (game: GameType) => void;
  onOpenBottleSpin: () => void;
  onOpenClanModal?: () => void;
}

export const PartyGamesTab: React.FC<PartyGamesTabProps> = ({
  onPlayGame,
  onOpenBottleSpin,
  onOpenClanModal,
}) => {
  const games = [
    {
      id: 'draw_and_guess' as GameType,
      title: 'Draw & Guess (Píntalo)',
      subtitle: '¡Pizarra en vivo y adivina la palabra!',
      players: '2-8 Jugadores',
      tag: '🔥 POPULAR WEPLAY',
      color: 'from-pink-500 via-rose-600 to-purple-700',
      icon: '🎨',
      bgGlow: '#FF2E9D',
    },
    {
      id: 'bottle_spin' as GameType,
      title: 'Tumba la Botella 3D',
      subtitle: 'Gira y desbloquea chat privado si coinciden',
      players: '4-8 Jugadores',
      tag: '💘 CITAS / ROMANCE',
      color: 'from-purple-600 via-pink-600 to-indigo-700',
      icon: '🍾',
      bgGlow: '#A855F7',
    },
    {
      id: 'space_werewolf' as GameType,
      title: 'Space Werewolf / Mafia',
      subtitle: 'Encuentra al impostor en la nave por chat de voz',
      players: '6-10 Jugadores',
      tag: '🐺 ESTRATEGIA',
      color: 'from-amber-600 via-orange-600 to-red-700',
      icon: '🚀',
      bgGlow: '#F59E0B',
    },
    {
      id: 'who_is_spy' as GameType,
      title: "Who's the Spy",
      subtitle: 'Misma palabra menos uno. Describe con cuidado',
      players: '4-8 Jugadores',
      tag: '🕵️ DESMADRE',
      color: 'from-blue-600 via-indigo-600 to-violet-700',
      icon: '🔍',
      bgGlow: '#3B82F6',
    },
    {
      id: 'karaoke' as GameType,
      title: 'Mic Grab / Karaoke',
      subtitle: 'Roba el micrófono y canta los mejores temas latinos',
      players: 'Todos cantan',
      tag: '🎤 MÚSICA EN VIVO',
      color: 'from-yellow-500 via-amber-600 to-pink-600',
      icon: '🎵',
      bgGlow: '#EAB308',
    },
    {
      id: 'truth_or_dare' as GameType,
      title: '100 Preguntas Incómodas',
      subtitle: 'Verdad o reto candente para romper el hielo',
      players: 'Cualquier grupo',
      tag: '😈 CANDENTE',
      color: 'from-red-600 via-rose-600 to-purple-800',
      icon: '🃏',
      bgGlow: '#EF4444',
    },
    {
      id: 'ludo' as GameType,
      title: 'Ludo King WePlay',
      subtitle: '4 colores, dados rápidos y apuestas de 500 🪙',
      players: '2-4 Jugadores',
      tag: '🎲 APUESTAS',
      color: 'from-violet-600 via-purple-600 to-indigo-800',
      icon: '🎲',
      bgGlow: '#8B5CF6',
    },
    {
      id: 'word_bomb' as GameType,
      title: 'Pasa la Bomba WePlay',
      subtitle: '¡La mecha se consume! Di una palabra rápida o explota',
      players: '2-8 Jugadores',
      tag: '💣 EXPLOSIVO',
      color: 'from-orange-500 via-red-600 to-amber-700',
      icon: '💣',
      bgGlow: '#F97316',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#1A0B2E] p-4 select-none pb-24">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <span>Party Games WePlay 2026</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </h2>
          <p className="text-xs text-purple-300">
            Juegos multijugador sincronizados con voz en tiempo real
          </p>
        </div>

        {onOpenClanModal && (
          <button
            onClick={() => {
              playSound('click');
              onOpenClanModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-black text-xs shadow-lg transition"
          >
            <span>🛡️</span>
            <span>Familias</span>
          </button>
        )}
      </div>

      {/* Featured Big Card (Draw & Guess) */}
      <div
        onClick={() => {
          playSound('pop');
          onPlayGame('draw_and_guess');
        }}
        className="cursor-pointer group relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-[#8B5CF6] p-6 shadow-2xl border border-white/20 mb-5 transform transition hover:scale-[1.02]"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-[70%]">
            <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-yellow-300 text-[10px] font-black tracking-wider uppercase border border-yellow-400/30">
              🔥 MÁS JUGADO EN LATAM
            </span>
            <h3 className="font-heading font-black text-2xl text-white mt-2 leading-tight">
              Draw & Guess (Píntalo)
            </h3>
            <p className="text-xs text-pink-100 mt-1">
              Pizarra blanca en tiempo real, pistas de letras automáticas y recompensas de monedas.
            </p>
            <button className="mt-4 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-heading font-black text-xs shadow-lg hover:bg-yellow-300 transition">
              ¡Entrar a Partida Rápida! ➔
            </button>
          </div>

          <div className="text-6xl animate-bounce filter drop-shadow-xl">
            🎨
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {games.map((g) => (
          <div
            key={g.id}
            onClick={() => {
              playSound('click');
              if (g.id === 'bottle_spin') {
                onOpenBottleSpin();
              } else {
                onPlayGame(g.id);
              }
            }}
            className="cursor-pointer group relative rounded-3xl bg-[#26133E] border border-purple-600/30 hover:border-[#FF2E9D] p-4 shadow-xl transition-all hover:scale-[1.01] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${g.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition`}
              >
                {g.icon}
              </div>
              <div>
                <span className="text-[9px] font-black bg-purple-900/60 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/20">
                  {g.tag}
                </span>
                <h4 className="font-heading font-black text-sm text-white mt-1 group-hover:text-[#FF2E9D] transition">
                  {g.title}
                </h4>
                <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-1">{g.subtitle}</p>
                <span className="text-[10px] text-purple-400 font-semibold">{g.players}</span>
              </div>
            </div>

            <button className="px-3.5 py-1.5 rounded-xl bg-[#FF2E9D] group-hover:bg-pink-500 text-white font-black text-xs shadow-md neon-glow-pink transition">
              Jugar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
