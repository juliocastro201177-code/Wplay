import React, { useState, useEffect } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Send, 
  Clock, 
  AlertTriangle, 
  Trophy, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Volume2, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, RoomSeat, SpyPlayer, WhoIsSpyGameData } from '../../types';
import { playSound } from '../../utils/audio';
import { ChibiAvatar } from '../avatar/ChibiAvatar';

interface WhoIsSpyGameProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onClose: () => void;
  onRewardCoins?: (amount: number) => void;
}

const SPY_WORD_PAIRS = [
  { civ: 'Tacos 🌮', spy: 'Burrito 🌯', category: 'Comida Mexicana' },
  { civ: 'Pizza 🍕', spy: 'Lasaña 🍲', category: 'Comida Italiana' },
  { civ: 'Café ☕', spy: 'Té 🍵', category: 'Bebidas Calientes' },
  { civ: 'Avión ✈️', spy: 'Helicóptero 🚁', category: 'Transporte Aéreo' },
  { civ: 'Playa 🏖️', spy: 'Piscina 🏊', category: 'Vacaciones' },
  { civ: 'Guitarra 🎸', spy: 'Violín 🎻', category: 'Instrumentos Musicales' },
  { civ: 'Instagram 📸', spy: 'TikTok 🎵', category: 'Redes Sociales' },
  { civ: 'Fútbol ⚽', spy: 'Básquetbol 🏀', category: 'Deportes' },
  { civ: 'Cine 🎬', spy: 'Netflix 📺', category: 'Entretenimiento' },
  { civ: 'León 🦁', spy: 'Tigre 🐯', category: 'Felinos Salvajes' },
];

const BOT_NICKNAMES = [
  'Valeria_CDMX',
  'Mateo_Regio',
  'Sofia_Gamer',
  'Carlos_VIP',
  'Camila_Love',
];

const BOT_CLUES: Record<string, string[]> = {
  'Tacos 🌮': ['Lleva tortilla y salsa verde picante', 'Se come de pie en la esquina', 'Con limón y cebolla es perfecto'],
  'Burrito 🌯': ['Viene enrollado en harina', 'Se come bien envuelto en papel', 'Relleno con frijol y queso'],
  'Pizza 🍕': ['Se corta en triángulos con queso', 'Masa horneada crujiente', 'Muy popular para ver películas'],
  'Lasaña 🍲': ['Capas de pasta y carne al horno', 'Tiene mucha salsa boloñesa', 'Se come con tenedor y cuchillo'],
  'Café ☕': ['Me despierta todas las mañanas', 'Tiene cafeína y aroma tostado', 'Lo pido con leche o solo'],
  'Té 🍵': ['Se prepara con bolsita en agua caliente', 'Es muy relajante y aromático', 'Viene de hojas naturales'],
};

export const WhoIsSpyGame: React.FC<WhoIsSpyGameProps> = ({
  currentUser,
  roomSeats,
  onClose,
  onRewardCoins,
}) => {
  // Select initial pair
  const [pairIndex, setPairIndex] = useState(() => Math.floor(Math.random() * SPY_WORD_PAIRS.length));
  const activePair = SPY_WORD_PAIRS[pairIndex];

  // Game state
  const [gameState, setGameState] = useState<WhoIsSpyGameData>(() => {
    // Build 5 players (currentUser + other occupied seats or bots)
    const initialPlayers: SpyPlayer[] = [];
    
    // Player 1 is currentUser
    initialPlayers.push({
      uid: currentUser.uid,
      nickname: currentUser.nickname,
      avatarUrl: currentUser.avatarUrl,
      avatarConfig: currentUser.avatarConfig,
      isSpy: false,
      word: '',
      isAlive: true,
      votesReceived: 0,
    });

    // Add occupied room seats or bot players to reach 5 players
    let botIndex = 0;
    const existingOccupied = roomSeats.filter(s => s.user && s.user.uid !== currentUser.uid);
    existingOccupied.forEach(s => {
      if (initialPlayers.length < 5 && s.user) {
        initialPlayers.push({
          uid: s.user.uid,
          nickname: s.user.nickname,
          avatarUrl: s.user.avatarUrl,
          avatarConfig: s.user.avatarConfig,
          isSpy: false,
          word: '',
          isAlive: true,
          votesReceived: 0,
        });
      }
    });

    while (initialPlayers.length < 5) {
      const bName = BOT_NICKNAMES[botIndex % BOT_NICKNAMES.length];
      initialPlayers.push({
        uid: `bot_spy_${botIndex}_${Date.now()}`,
        nickname: bName,
        avatarConfig: {
          skinColor: '#FFDFBA',
          hairStyle: botIndex % 2 === 0 ? 'fluffy_curls' : 'short_anime',
          hairColor: '#4A2810',
          expression: 'smile',
          outfit: 'hoodie_street',
          outfitColor: '#EC4899',
          headwear: 'none',
          glasses: 'none',
          accessory: 'none',
        },
        isSpy: false,
        word: '',
        isAlive: true,
        votesReceived: 0,
      });
      botIndex++;
    }

    // Randomly assign 1 spy among players (e.g. 30% chance for currentUser, 70% for a bot)
    const spyIndex = Math.floor(Math.random() * initialPlayers.length);
    initialPlayers.forEach((p, idx) => {
      if (idx === spyIndex) {
        p.isSpy = true;
        p.word = activePair.spy;
      } else {
        p.isSpy = false;
        p.word = activePair.civ;
      }
    });

    return {
      status: 'word_reveal',
      players: initialPlayers,
      activeCluePlayerIndex: 0,
      currentRound: 1,
      timeLeft: 12,
      civilianWord: activePair.civ,
      spyWord: activePair.spy,
    };
  });

  const [isWordRevealed, setIsWordRevealed] = useState(false);
  const [customClueInput, setCustomClueInput] = useState('');
  const [selectedVoteUid, setSelectedVoteUid] = useState<string | null>(null);
  const [spyGuessOption, setSpyGuessOption] = useState<string>('');

  const currentPlayer = gameState.players.find(p => p.uid === currentUser.uid);
  const activeCluePlayer = gameState.players[gameState.activeCluePlayerIndex];

  // Countdown timer effect
  useEffect(() => {
    if (gameState.status === 'finished') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft > 1) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }

        // Time ran out handler depending on status
        if (prev.status === 'word_reveal') {
          // Transition to clue phase
          playSound('bell');
          return {
            ...prev,
            status: 'clue_phase',
            activeCluePlayerIndex: 0,
            timeLeft: 15,
          };
        }

        if (prev.status === 'clue_phase') {
          // Current clue player's time finished
          const updatedPlayers = [...prev.players];
          const curr = updatedPlayers[prev.activeCluePlayerIndex];
          if (!curr.clue) {
            // Auto generate fallback clue
            const clues = BOT_CLUES[curr.word] || ['Es algo muy común y me gusta bastante'];
            curr.clue = clues[Math.floor(Math.random() * clues.length)];
          }

          // Next alive player
          let nextIdx = prev.activeCluePlayerIndex + 1;
          while (nextIdx < prev.players.length && !prev.players[nextIdx].isAlive) {
            nextIdx++;
          }

          if (nextIdx >= prev.players.length) {
            // All players finished clues! Start voting phase
            playSound('swords');
            return {
              ...prev,
              players: updatedPlayers,
              status: 'voting',
              timeLeft: 18,
            };
          }

          playSound('pop');
          return {
            ...prev,
            players: updatedPlayers,
            activeCluePlayerIndex: nextIdx,
            timeLeft: 15,
          };
        }

        if (prev.status === 'voting') {
          // Tally votes
          playSound('bass');
          return handleTallyVotes(prev);
        }

        if (prev.status === 'verdict') {
          // After verdict, check win conditions
          const spy = prev.players.find(p => p.isSpy);
          if (!spy?.isAlive) {
            // Spy was eliminated! Give spy one final guess attempt
            playSound('alert' as any);
            return {
              ...prev,
              status: 'spy_guess',
              timeLeft: 15,
            };
          }

          // Count remaining alive civilians vs spy
          const aliveCivilians = prev.players.filter(p => !p.isSpy && p.isAlive).length;
          if (aliveCivilians <= 1) {
            // Spy wins!
            playSound('win');
            confetti({ particleCount: 120, spread: 80 });
            return {
              ...prev,
              status: 'finished',
              winner: 'spy',
            };
          }

          // Start next round of clues
          let firstAlive = prev.players.findIndex(p => p.isAlive);
          // Reset clues and votes
          const cleaned = prev.players.map(p => ({
            ...p,
            clue: undefined,
            votesReceived: 0,
            hasVoted: false,
          }));

          playSound('bell');
          return {
            ...prev,
            players: cleaned,
            status: 'clue_phase',
            activeCluePlayerIndex: firstAlive,
            currentRound: prev.currentRound + 1,
            timeLeft: 15,
          };
        }

        if (prev.status === 'spy_guess') {
          // Time expired for spy guess -> Civilians win
          playSound('win');
          confetti({ particleCount: 150, spread: 90 });
          return {
            ...prev,
            status: 'finished',
            winner: 'civilians',
          };
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, gameState.activeCluePlayerIndex]);

  // Bot auto-clue generator when it's bot's turn
  useEffect(() => {
    if (gameState.status === 'clue_phase') {
      const active = gameState.players[gameState.activeCluePlayerIndex];
      if (active && active.uid !== currentUser.uid && active.isAlive && !active.clue) {
        const timeout = setTimeout(() => {
          const pool = BOT_CLUES[active.word] || ['Se usa frecuentemente en momentos divertidos', 'Es bastante popular entre mis amigos', 'Tiene muy buen aroma y sabor'];
          const randomClue = pool[Math.floor(Math.random() * pool.length)];

          setGameState(prev => {
            const updated = [...prev.players];
            if (updated[prev.activeCluePlayerIndex]) {
              updated[prev.activeCluePlayerIndex].clue = randomClue;
            }
            return { ...prev, players: updated };
          });
          playSound('pop');
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [gameState.status, gameState.activeCluePlayerIndex]);

  // Submit human player clue
  const handleSendClue = () => {
    if (!customClueInput.trim()) return;
    playSound('pop');
    setGameState(prev => {
      const updated = [...prev.players];
      const me = updated.find(p => p.uid === currentUser.uid);
      if (me) me.clue = customClueInput.trim();

      // Find next player
      let nextIdx = prev.activeCluePlayerIndex + 1;
      while (nextIdx < prev.players.length && !prev.players[nextIdx].isAlive) {
        nextIdx++;
      }

      if (nextIdx >= prev.players.length) {
        playSound('swords');
        return {
          ...prev,
          players: updated,
          status: 'voting',
          timeLeft: 18,
        };
      }

      return {
        ...prev,
        players: updated,
        activeCluePlayerIndex: nextIdx,
        timeLeft: 15,
      };
    });
    setCustomClueInput('');
  };

  // Submit player vote
  const handleCastVote = (targetUid: string) => {
    if (selectedVoteUid || gameState.status !== 'voting') return;
    playSound('coin');
    setSelectedVoteUid(targetUid);

    setGameState(prev => {
      const updated = [...prev.players];
      const target = updated.find(p => p.uid === targetUid);
      if (target) target.votesReceived += 1;

      // Simulate bot votes
      updated.forEach(p => {
        if (p.uid !== currentUser.uid && p.isAlive && !p.hasVoted) {
          p.hasVoted = true;
          // Bots pick someone who isn't themselves
          const possibleTargets = updated.filter(cand => cand.isAlive && cand.uid !== p.uid);
          if (possibleTargets.length > 0) {
            const botChoice = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
            botChoice.votesReceived += 1;
          }
        }
      });

      return {
        ...prev,
        players: updated,
      };
    });
  };

  // Tally votes logic
  const handleTallyVotes = (state: WhoIsSpyGameData): WhoIsSpyGameData => {
    let maxVotes = -1;
    let eliminated: SpyPlayer | undefined = undefined;

    state.players.forEach(p => {
      if (p.isAlive && p.votesReceived > maxVotes) {
        maxVotes = p.votesReceived;
        eliminated = p;
      }
    });

    const updated = state.players.map(p => {
      if (eliminated && p.uid === eliminated.uid) {
        return { ...p, isAlive: false };
      }
      return p;
    });

    return {
      ...state,
      players: updated,
      status: 'verdict',
      eliminatedPlayer: eliminated,
      timeLeft: 6,
    };
  };

  // Spy Guess resolution
  const handleSpyGuess = (guessWord: string) => {
    const isCorrect = guessWord.toLowerCase().trim() === activePair.civ.toLowerCase().trim();
    if (isCorrect) {
      playSound('win');
      confetti({ particleCount: 150, spread: 90 });
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        winner: 'spy',
        spyGuessWord: guessWord,
        isSpyGuessCorrect: true,
      }));
    } else {
      playSound('buzz');
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        winner: 'civilians',
        spyGuessWord: guessWord,
        isSpyGuessCorrect: false,
      }));
    }
  };

  // Restart game
  const handleRestart = () => {
    playSound('pop');
    const newPairIndex = (pairIndex + 1) % SPY_WORD_PAIRS.length;
    setPairIndex(newPairIndex);
    const newPair = SPY_WORD_PAIRS[newPairIndex];

    const resetPlayers = gameState.players.map((p, idx) => ({
      ...p,
      isAlive: true,
      clue: undefined,
      votesReceived: 0,
      hasVoted: false,
      isSpy: idx === 1, // alternate spy
      word: idx === 1 ? newPair.spy : newPair.civ,
    }));

    setSelectedVoteUid(null);
    setIsWordRevealed(false);
    setGameState({
      status: 'word_reveal',
      players: resetPlayers,
      activeCluePlayerIndex: 0,
      currentRound: 1,
      timeLeft: 12,
      civilianWord: newPair.civ,
      spyWord: newPair.spy,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 animate-in fade-in">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#1C0F38] via-[#2A154D] to-[#120726] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-800/40 bg-[#120726]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-white text-base">¿Quién es el Espía?</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Ronda {gameState.currentRound}
                </span>
              </div>
              <p className="text-[11px] text-purple-300">
                Categoría: <span className="font-bold text-yellow-300">{activePair.category}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clock Timer */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
              gameState.timeLeft <= 5 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                : 'bg-purple-900/60 text-purple-200 border-purple-700/50'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{gameState.timeLeft}s</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Phase Indicator Banner */}
        <div className="px-5 py-2 bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-purple-900/60 border-b border-purple-800/30 flex items-center justify-between text-xs">
          <span className="text-purple-200 font-medium">
            {gameState.status === 'word_reveal' && '👀 Memoriza tu palabra secreta. ¡Nadie debe verla!'}
            {gameState.status === 'clue_phase' && `🎙️ Turno de descripción: ${activeCluePlayer?.nickname}`}
            {gameState.status === 'voting' && '🗳️ Vota por quién crees que tiene la palabra diferente'}
            {gameState.status === 'verdict' && '⚖️ ¡El pueblo ha hablado! Veredicto final'}
            {gameState.status === 'spy_guess' && '🧠 Última oportunidad: El espía puede adivinar la palabra'}
            {gameState.status === 'finished' && '🏆 ¡Fin de la partida!'}
          </span>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
            {gameState.status.replace('_', ' ')}
          </span>
        </div>

        {/* Secret Word Card (Current User) */}
        {currentPlayer && (
          <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-500/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {isWordRevealed ? '📜' : '🔒'}
              </div>
              <div>
                <div className="text-[10px] text-purple-300 uppercase font-black tracking-wider">
                  Tu Palabra Secreta:
                </div>
                <div className="font-heading font-black text-lg text-white tracking-wide">
                  {isWordRevealed ? (
                    <span className="text-yellow-300 font-mono">{currentPlayer.word}</span>
                  ) : (
                    <span className="text-purple-400">•••••••••• (Toca para ver)</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('pop');
                setIsWordRevealed(!isWordRevealed);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-800/60 hover:bg-purple-700/80 text-white text-xs font-bold border border-purple-600/40 flex items-center gap-1.5 transition"
            >
              {isWordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isWordRevealed ? 'Ocultar' : 'Revelar'}</span>
            </button>
          </div>
        )}

        {/* Players Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {gameState.players.map((p, idx) => {
            const isCurrentClue = gameState.status === 'clue_phase' && idx === gameState.activeCluePlayerIndex;
            const isMe = p.uid === currentUser.uid;

            return (
              <div
                key={p.uid}
                className={`p-3 rounded-2xl border transition relative flex items-center justify-between ${
                  !p.isAlive 
                    ? 'opacity-45 bg-gray-900/40 border-gray-800' 
                    : isCurrentClue
                    ? 'bg-gradient-to-r from-pink-950/40 to-purple-900/40 border-[#FF2E9D] shadow-[0_0_15px_rgba(255,46,157,0.3)] ring-1 ring-[#FF2E9D]'
                    : 'bg-purple-950/30 border-purple-800/40 hover:border-purple-600/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar with Status */}
                  <div className="relative">
                    {p.avatarUrl ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-400">
                        <img src={p.avatarUrl} alt={p.nickname} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <ChibiAvatar
                        config={p.avatarConfig}
                        size={44}
                        frameId={isMe ? currentUser.frameId : 'vip_gold'}
                      />
                    )}

                    {/* Eliminated Ghost Badge */}
                    {!p.isAlive && (
                      <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center text-sm">
                        💀
                      </div>
                    )}

                    {/* Active Mic speaking pulse */}
                    {isCurrentClue && p.isAlive && (
                      <div className="absolute -top-1 -right-1 p-1 rounded-full bg-[#FF2E9D] text-white shadow-md animate-bounce text-[9px]">
                        🎤
                      </div>
                    )}
                  </div>

                  {/* Nickname & Clue display */}
                  <div className="max-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-black text-xs text-white">
                        {p.nickname}
                      </span>
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                          Tú
                        </span>
                      )}
                      {!p.isAlive && (
                        <span className="text-[9px] text-gray-400 font-mono">
                          (Eliminado)
                        </span>
                      )}
                    </div>

                    {/* Clue bubble */}
                    {p.clue ? (
                      <div className="mt-1 px-2.5 py-1 rounded-xl bg-purple-900/60 border border-purple-700/40 text-purple-200 text-xs italic font-medium inline-block">
                        "{p.clue}"
                      </div>
                    ) : isCurrentClue ? (
                      <div className="text-[11px] text-pink-400 font-semibold animate-pulse mt-0.5">
                        Pensando pista...
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Esperando su turno
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action: Voting Button or Vote Counter */}
                <div>
                  {gameState.status === 'voting' && p.isAlive && !isMe && (
                    <button
                      onClick={() => handleCastVote(p.uid)}
                      disabled={selectedVoteUid !== null}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 ${
                        selectedVoteUid === p.uid
                          ? 'bg-rose-600 text-white shadow-lg'
                          : selectedVoteUid
                          ? 'bg-purple-900/40 text-gray-500 cursor-not-allowed'
                          : 'bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40'
                      }`}
                    >
                      <span>Votar</span>
                      {p.votesReceived > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">
                          {p.votesReceived}
                        </span>
                      )}
                    </button>
                  )}

                  {gameState.status !== 'voting' && p.votesReceived > 0 && (
                    <div className="px-2 py-1 rounded-lg bg-rose-950/60 border border-rose-800/40 text-[10px] font-bold text-rose-300">
                      {p.votesReceived} votos
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Clue Input Footer (When it's currentUser's turn) */}
        {gameState.status === 'clue_phase' && activeCluePlayer?.uid === currentUser.uid && (
          <div className="p-3 bg-[#120726] border-t border-purple-800/40 flex items-center gap-2">
            <input
              type="text"
              value={customClueInput}
              onChange={(e) => setCustomClueInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendClue()}
              placeholder="Describe tu palabra sin decirla (ej: se come con salsa)..."
              maxLength={60}
              className="flex-1 bg-purple-950/60 border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#FF2E9D]"
            />
            <button
              onClick={handleSendClue}
              disabled={!customClueInput.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 disabled:opacity-40 text-white text-xs font-black shadow-md flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        )}

        {/* Spy Guess Phase (If spy was caught and gets a revenge guess) */}
        {gameState.status === 'spy_guess' && (
          <div className="p-4 bg-gradient-to-r from-red-950/70 to-purple-950/70 border-t border-red-500/40">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>¡El Espía fue descubierto! Pero puede robar la victoria si adivina la palabra de los civiles:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                activePair.civ,
                'Empanadas 🥟',
                'Quesadillas 🧀',
                'Nachos con Queso 🧀',
              ].sort().map((wordOption) => (
                <button
                  key={wordOption}
                  onClick={() => handleSpyGuess(wordOption)}
                  className="p-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 text-white text-xs font-bold transition"
                >
                  {wordOption}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Verdict Display Overlay */}
        {gameState.status === 'verdict' && gameState.eliminatedPlayer && (
          <div className="p-4 bg-purple-950 border-t border-purple-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚖️</span>
              <div>
                <div className="font-heading font-black text-sm text-white">
                  {gameState.eliminatedPlayer.nickname} fue expulsado.
                </div>
                <div className="text-xs text-purple-300 font-medium">
                  {gameState.eliminatedPlayer.isSpy ? (
                    <span className="text-emerald-400 font-bold">¡ERA EL ESPÍA INFILTRADO! 🎯</span>
                  ) : (
                    <span className="text-rose-400 font-bold">¡ERA UN CIVIL INOCENTE! 😱</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finished Game Summary */}
        {gameState.status === 'finished' && (
          <div className="p-5 bg-gradient-to-b from-purple-950 to-[#120726] border-t border-purple-700/60 text-center space-y-3">
            <div className="text-3xl">
              {gameState.winner === 'civilians' ? '🎉' : '🕵️'}
            </div>
            <h3 className="font-heading font-black text-lg text-white">
              {gameState.winner === 'civilians'
                ? '¡Los Civiles Ganaron! 🎉'
                : '¡El Espía se Llevó la Victoria! 😈'}
            </h3>
            <p className="text-xs text-purple-300">
              Palabra de Civiles: <strong className="text-emerald-300">{activePair.civ}</strong> | Palabra del Espía: <strong className="text-rose-300">{activePair.spy}</strong>
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  if (onRewardCoins) {
                    onRewardCoins(200);
                  }
                  handleRestart();
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:opacity-90 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jugar Otra Ronda (+200 🪙)</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-gray-300 text-xs font-bold transition"
              >
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
