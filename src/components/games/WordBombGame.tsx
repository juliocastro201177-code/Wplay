import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Flame, Heart, Trophy, Send, Volume2 } from 'lucide-react';
import { User, RoomSeat, WordBombPlayer } from '../../types';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface WordBombGameProps {
  currentUser: User;
  roomSeats?: RoomSeat[];
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

const SYLLABLES = [
  { syllable: 'MAR', hint: 'Palabras que contengan MAR (ej: Martes, Marea, Camarón)' },
  { syllable: 'TRA', hint: 'Palabras que contengan TRA (ej: Trabajo, Trago, Atrás)' },
  { syllable: 'CAN', hint: 'Palabras que contengan CAN (ej: Canción, Cantar, Volcán)' },
  { syllable: 'PLA', hint: 'Palabras que contengan PLA (ej: Playa, Plato, Planeta)' },
  { syllable: 'COR', hint: 'Palabras que contengan COR (ej: Corona, Corazón, Recordar)' },
  { syllable: 'SOL', hint: 'Palabras que contengan SOL (ej: Soldado, Consola, Insolente)' },
  { syllable: 'PAS', hint: 'Palabras que contengan PAS (ej: Pasta, Pasto, Pasaporte)' },
  { syllable: 'BRI', hint: 'Palabras que contengan BRI (ej: Brillo, Fábrica, Sombrilla)' },
];

export const WordBombGame: React.FC<WordBombGameProps> = ({
  currentUser,
  roomSeats = [],
  onClose,
  onRewardCoins,
}) => {
  // Initialize players: Current user + 3 AI/room participants
  const initialPlayers: WordBombPlayer[] = [
    {
      uid: currentUser.uid,
      nickname: currentUser.nickname,
      avatarUrl: currentUser.avatarUrl,
      avatarConfig: currentUser.avatarConfig,
      lives: 3,
      isEliminated: false,
    },
    {
      uid: 'p_valeria',
      nickname: 'Valeria_CDMX',
      lives: 3,
      isEliminated: false,
    },
    {
      uid: 'p_mateo',
      nickname: 'Mateo_Flow',
      lives: 2,
      isEliminated: false,
    },
    {
      uid: 'p_sofia',
      nickname: 'Sofi_Gamer',
      lives: 3,
      isEliminated: false,
    },
  ];

  const [players, setPlayers] = useState<WordBombPlayer[]>(initialPlayers);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(SYLLABLES[0]);
  const [inputWord, setInputWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(8);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [explodedPlayer, setExplodedPlayer] = useState<WordBombPlayer | null>(null);
  const [winner, setWinner] = useState<WordBombPlayer | null>(null);
  const [gameStarted, setGameStarted] = useState(true);

  const activePlayer = players[activePlayerIndex];
  const isMyTurn = activePlayer?.uid === currentUser.uid;

  // Countdown timer for active bomb
  useEffect(() => {
    if (!gameStarted || winner || explodedPlayer) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // BOMB EXPLODED!
          handleBombExplosion();
          return 8;
        }
        if (prev <= 4) {
          playSound('click');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, activePlayerIndex, winner, explodedPlayer]);

  // AI bots automatic play
  useEffect(() => {
    if (!gameStarted || winner || explodedPlayer || isMyTurn) return;

    const botThinkTime = Math.random() * 3000 + 2000;
    const botTimer = setTimeout(() => {
      // 80% chance bot gets word right
      if (Math.random() < 0.85) {
        passBombToNext(`Ejemplo_${currentChallenge.syllable}`);
      }
    }, botThinkTime);

    return () => clearTimeout(botTimer);
  }, [activePlayerIndex, gameStarted, winner, explodedPlayer, isMyTurn]);

  const handleBombExplosion = () => {
    playSound('bass');
    playSound('splat');
    const victim = players[activePlayerIndex];
    setExplodedPlayer(victim);

    setPlayers(prev =>
      prev.map((p, idx) => {
        if (idx === activePlayerIndex) {
          const newLives = p.lives - 1;
          return { ...p, lives: newLives, isEliminated: newLives <= 0 };
        }
        return p;
      })
    );

    setTimeout(() => {
      setExplodedPlayer(null);
      // Check remaining alive players
      setPlayers(currentP => {
        const alive = currentP.filter(p => !p.isEliminated);
        if (alive.length <= 1) {
          setWinner(alive[0] || currentP[0]);
          playSound('win');
          confetti({ particleCount: 100, spread: 80 });
          if (alive[0]?.uid === currentUser.uid) {
            onRewardCoins(600);
          }
        } else {
          // Pick next alive player
          let nextIdx = (activePlayerIndex + 1) % currentP.length;
          while (currentP[nextIdx].isEliminated) {
            nextIdx = (nextIdx + 1) % currentP.length;
          }
          setActivePlayerIndex(nextIdx);
          // Pick new syllable
          const nextSyllable = SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
          setCurrentChallenge(nextSyllable);
          setTimeLeft(8);
        }
        return currentP;
      });
    }, 2200);
  };

  const passBombToNext = (word: string) => {
    playSound('pop');
    setUsedWords(prev => [word, ...prev]);

    // Move to next player
    let nextIdx = (activePlayerIndex + 1) % players.length;
    while (players[nextIdx].isEliminated) {
      nextIdx = (nextIdx + 1) % players.length;
    }
    setActivePlayerIndex(nextIdx);
    setTimeLeft(8);

    // Occasionally change syllable
    if (Math.random() > 0.5) {
      const nextSyllable = SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
      setCurrentChallenge(nextSyllable);
    }
  };

  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMyTurn || !inputWord.trim()) return;

    const clean = inputWord.trim().toUpperCase();
    if (!clean.includes(currentChallenge.syllable)) {
      playSound('buzz');
      return;
    }

    if (usedWords.includes(clean)) {
      playSound('buzz');
      return;
    }

    setInputWord('');
    passBombToNext(clean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#18051E] border-2 border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 via-red-600 to-rose-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/30 border border-orange-300/40 flex items-center justify-center text-2xl animate-pulse">
              💣
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                Pasa la Bomba WePlay
                <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-black text-[9px] font-black">
                  EN VIVO
                </span>
              </h2>
              <p className="text-[10px] text-orange-200">¡Escribe una palabra antes de que explote en tu cara!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Game Stage */}
        <div className="p-4 flex flex-col items-center flex-1 overflow-y-auto">
          {/* Players Circles */}
          <div className="grid grid-cols-4 gap-2 w-full mb-3">
            {players.map((player, idx) => (
              <div
                key={player.uid}
                className={`p-2 rounded-2xl border flex flex-col items-center transition-all ${
                  player.isEliminated
                    ? 'bg-black/40 border-gray-700 opacity-40 grayscale'
                    : idx === activePlayerIndex
                    ? 'bg-gradient-to-b from-orange-500/30 to-red-600/30 border-orange-400 scale-105 shadow-lg'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-purple-900 border-2 border-white/20 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                    {player.avatarUrl ? (
                      <img src={player.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      player.nickname.slice(0, 2)
                    )}
                  </div>
                  {idx === activePlayerIndex && !player.isEliminated && (
                    <div className="absolute -top-2 -right-1 text-sm animate-bounce">
                      💣
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-black text-white truncate w-full text-center mt-1">
                  {player.nickname}
                </span>

                {/* Lives */}
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(player.lives)].map((_, i) => (
                    <span key={i} className="text-[9px]">❤️</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Central Bomb Fuse Stage */}
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-[#280816] to-[#0E0308] border-4 border-orange-500/40 flex flex-col items-center justify-center shadow-2xl my-2">
            {explodedPlayer ? (
              <div className="text-center animate-bounce">
                <span className="text-6xl">💥</span>
                <span className="text-xs font-black text-red-400 block mt-1">
                  ¡BOOM! {explodedPlayer.nickname} chamuscado
                </span>
              </div>
            ) : winner ? (
              <div className="text-center animate-pulse">
                <span className="text-6xl">👑</span>
                <span className="text-xs font-black text-yellow-300 block mt-1">
                  ¡{winner.nickname} GANÓ!
                </span>
              </div>
            ) : (
              <>
                {/* Fuse sparks */}
                <div className="absolute top-2 text-2xl animate-spin">✨</div>
                <div className="text-6xl filter drop-shadow-xl animate-pulse">
                  💣
                </div>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-black text-white font-mono">{timeLeft}s</span>
                </div>
              </>
            )}
          </div>

          {/* Syllable Challenge Box */}
          <div className="w-full p-3 rounded-2xl bg-orange-950/40 border border-orange-500/40 text-center mb-3">
            <span className="text-[9px] font-black uppercase text-orange-400 tracking-wider block">
              Sílaba Obligatoria:
            </span>
            <div className="text-2xl font-black text-yellow-300 tracking-widest my-0.5">
              "{currentChallenge.syllable}"
            </div>
            <p className="text-[10px] text-orange-200">{currentChallenge.hint}</p>
          </div>

          {/* Input Word Form */}
          {isMyTurn && !winner && !explodedPlayer ? (
            <form onSubmit={handleSubmitWord} className="w-full flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={e => setInputWord(e.target.value)}
                placeholder={`Escribe palabra con ${currentChallenge.syllable}...`}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-2xl bg-black/60 border border-orange-400 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-1"
              >
                <Send size={14} />
                <span>Pasa</span>
              </button>
            </form>
          ) : (
            <div className="text-center text-xs font-bold text-orange-300 py-2">
              {winner
                ? `Partida finalizada. ¡Premio otorgado!`
                : `Turno de ${activePlayer?.nickname}... ¡La bomba hace tic-tac!`}
            </div>
          )}

          {/* Words Log */}
          {usedWords.length > 0 && (
            <div className="w-full mt-3 p-2 rounded-xl bg-black/30 border border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px] text-gray-300">
              <span className="text-orange-400 font-bold shrink-0">Dichas:</span>
              {usedWords.slice(0, 6).map((w, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 shrink-0 font-mono">
                  {w}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
