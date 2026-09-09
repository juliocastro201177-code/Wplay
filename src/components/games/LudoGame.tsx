import React, { useState, useEffect } from 'react';
import { X, Dices, Trophy, Sparkles, RotateCw, Volume2, Shield, Flame } from 'lucide-react';
import { User, RoomSeat } from '../../types';
import { playSound } from '../../utils/audio';

interface LudoGameProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

interface LudoPlayer {
  id: string;
  name: string;
  avatar: string;
  color: PlayerColor;
  tokens: number[]; // position: -1 is at home base, 0-51 on main circuit, 52-56 on finish runway, 57 is Goal!
  isBot?: boolean;
}

const COLOR_STYLES: Record<PlayerColor, { bg: string; border: string; text: string; glow: string; name: string }> = {
  red: { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-400', glow: 'shadow-red-500/50', name: 'Rojo' },
  green: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400', glow: 'shadow-emerald-500/50', name: 'Verde' },
  yellow: { bg: 'bg-amber-400', border: 'border-amber-300', text: 'text-amber-400', glow: 'shadow-amber-400/50', name: 'Amarillo' },
  blue: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-400', glow: 'shadow-blue-500/50', name: 'Azul' },
};

export const LudoGame: React.FC<LudoGameProps> = ({
  currentUser,
  roomSeats,
  onClose,
  onRewardCoins,
}) => {
  const [players, setPlayers] = useState<LudoPlayer[]>([
    {
      id: currentUser.id,
      name: currentUser.nickname,
      avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      color: 'red',
      tokens: [-1, -1, 0, 4],
    },
    {
      id: 'bot_p2',
      name: 'Diego_CDMX 🇲🇽',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      color: 'green',
      tokens: [-1, 0, 8, 14],
      isBot: true,
    },
    {
      id: 'bot_p3',
      name: 'Camila_VIP 👑',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      color: 'yellow',
      tokens: [-1, -1, 0, 18],
      isBot: true,
    },
    {
      id: 'bot_p4',
      name: 'Santi_Gamer 🎮',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      color: 'blue',
      tokens: [-1, 0, 12, 24],
      isBot: true,
    },
  ]);

  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [waitingMove, setWaitingMove] = useState(false);
  const [gameWinner, setGameWinner] = useState<LudoPlayer | null>(null);
  const [historyLog, setHistoryLog] = useState<string[]>(['¡Partida iniciada! Es turno de Rojo.']);

  const currentPlayer = players[currentTurn];
  const isUserTurn = currentPlayer.id === currentUser.id;

  // Bot AI automated turn
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentPlayer.isBot && !gameWinner && !waitingMove && !isRolling) {
      timer = setTimeout(() => {
        handleRollDice();
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [currentTurn, currentPlayer, waitingMove, isRolling, gameWinner]);

  // If bot rolled and has to move token
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentPlayer.isBot && waitingMove && diceValue !== null) {
      timer = setTimeout(() => {
        // Find best token to move
        const tokens = currentPlayer.tokens;
        let chosenTokenIdx = 0;
        if (diceValue === 6 && tokens.includes(-1)) {
          chosenTokenIdx = tokens.indexOf(-1);
        } else {
          // move the furthest active token
          chosenTokenIdx = tokens.reduce((bestIdx, pos, idx) => {
            return pos > tokens[bestIdx] ? idx : bestIdx;
          }, 0);
        }
        executeTokenMove(chosenTokenIdx);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [waitingMove, diceValue, currentPlayer]);

  const handleRollDice = () => {
    if (isRolling || waitingMove) return;
    setIsRolling(true);
    playSound('dice');

    // Quick rolling animation
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 6) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        setWaitingMove(true);

        // Check if any move is possible
        const hasValidMoves = currentPlayer.tokens.some(t => (t === -1 && finalValue === 6) || (t >= 0 && t + finalValue <= 57));
        if (!hasValidMoves) {
          setTimeout(() => {
            passTurn(`Sacó un ${finalValue} pero no tiene movimientos válidos.`);
          }, 1200);
        }
      }
    }, 80);
  };

  const executeTokenMove = (tokenIdx: number) => {
    if (!diceValue) return;
    const currentPos = currentPlayer.tokens[tokenIdx];

    if (currentPos === -1 && diceValue !== 6) {
      playSound('buzz');
      return;
    }

    let newPos = currentPos;
    if (currentPos === -1 && diceValue === 6) {
      newPos = 0; // Spawn out to starting track tile
      playSound('correct');
    } else {
      newPos = Math.min(57, currentPos + diceValue);
      playSound('pop');
    }

    // Check if knocking out an opponent token
    let knockOutText = '';
    const updatedPlayers = players.map(p => {
      if (p.id === currentPlayer.id) {
        const newTokens = [...p.tokens];
        newTokens[tokenIdx] = newPos;
        return { ...p, tokens: newTokens };
      } else {
        // Check collision (safe zones are every 8 tiles: 0, 8, 16, 24, etc.)
        const isSafeZone = newPos % 8 === 0;
        if (!isSafeZone && newPos < 52) {
          const knockTokenIdx = p.tokens.findIndex(t => t === newPos);
          if (knockTokenIdx !== -1) {
            const bumpedTokens = [...p.tokens];
            bumpedTokens[knockTokenIdx] = -1; // back to base!
            knockOutText = `¡${currentPlayer.name} se comió una ficha de ${p.name}! 💥`;
            playSound('splat');
            return { ...p, tokens: bumpedTokens };
          }
        }
        return p;
      }
    });

    setPlayers(updatedPlayers);
    setWaitingMove(false);

    // Check for win (all tokens reach 57 or first to reach 57)
    if (newPos >= 52) {
      const winner = updatedPlayers.find(p => p.id === currentPlayer.id);
      if (winner && (newPos === 57 || winner.tokens.every(t => t >= 52))) {
        setGameWinner(winner);
        playSound('win');
        if (winner.id === currentUser.id) {
          onRewardCoins(500);
        }
        return;
      }
    }

    // Advance turn (if rolled a 6, gets another turn!)
    if (diceValue === 6) {
      setDiceValue(null);
      setHistoryLog(prev => [
        `¡${currentPlayer.name} sacó 6 y repite tiro! ${knockOutText}`,
        ...prev.slice(0, 5),
      ]);
    } else {
      passTurn(knockOutText);
    }
  };

  const passTurn = (extraInfo?: string) => {
    setWaitingMove(false);
    setDiceValue(null);
    const nextTurn = (currentTurn + 1) % players.length;
    setCurrentTurn(nextTurn);
    setHistoryLog(prev => [
      `${extraInfo ? extraInfo + ' ' : ''}Turno de ${players[nextTurn].name} (${COLOR_STYLES[players[nextTurn].color].name})`,
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#18092B] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-700/40 via-purple-900/40 to-pink-600/30 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-lg shadow-md">
              🎲
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                Ludo King WePlay
                <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                  POZO 500 🪙
                </span>
              </h2>
              <p className="text-[10px] text-purple-300">¡Gira el dado, come fichas rivales y llega al centro!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Game Stage */}
        <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Players Status Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {players.map((p, idx) => {
              const isTurn = idx === currentTurn && !gameWinner;
              const style = COLOR_STYLES[p.color];
              return (
                <div
                  key={p.id}
                  className={`p-2 rounded-2xl border transition flex items-center gap-2 ${
                    isTurn
                      ? `bg-[#280E42] ${style.border} ${style.glow} shadow-lg ring-1 ring-white/20`
                      : 'bg-[#1C0A2F]/70 border-white/10 opacity-75'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-xl object-cover border border-white/20" />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${style.bg} border-2 border-[#18092B]`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white truncate">{p.name}</span>
                      {isTurn && (
                        <span className={`text-[8px] font-black uppercase px-1 rounded ${style.bg} text-black`}>
                          TIRA
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {p.tokens.map((pos, tIdx) => (
                        <span
                          key={tIdx}
                          className={`w-2 h-2 rounded-full ${
                            pos === -1 ? 'bg-white/20' : pos >= 52 ? 'bg-amber-400 animate-pulse' : style.bg
                          }`}
                        />
                      ))}
                      <span className="text-[9px] text-purple-300 ml-1">
                        {p.tokens.filter(t => t >= 0).length}/4 en juego
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graphical Ludo Board Canvas */}
          <div className="relative aspect-square w-full max-w-[340px] mx-auto bg-[#130424] rounded-3xl border-2 border-purple-500/30 p-2 shadow-inner flex flex-col justify-between">
            {/* Top row: Red Base & Green Base */}
            <div className="flex justify-between items-center">
              {/* Red Home Base */}
              <div className="w-28 h-28 rounded-2xl bg-red-950/40 border-2 border-red-500/50 p-1.5 flex flex-col justify-between">
                <span className="text-[9px] font-black text-red-400 uppercase">Base Roja</span>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {players[0].tokens.map((pos, idx) => (
                    <div
                      key={idx}
                      onClick={() => isUserTurn && waitingMove && executeTokenMove(idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition ${
                        pos === -1
                          ? 'bg-red-500 text-white shadow-md hover:scale-105 border border-red-300'
                          : 'bg-white/5 border border-dashed border-red-500/30'
                      }`}
                    >
                      {pos === -1 ? '🔴' : '✓'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Green Home Base */}
              <div className="w-28 h-28 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 p-1.5 flex flex-col justify-between">
                <span className="text-[9px] font-black text-emerald-400 uppercase text-right">Base Verde</span>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {players[1].tokens.map((pos, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        pos === -1
                          ? 'bg-emerald-500 text-white shadow-md border border-emerald-300'
                          : 'bg-white/5 border border-dashed border-emerald-500/30'
                      }`}
                    >
                      {pos === -1 ? '🟢' : '✓'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Runway and Triangles */}
            <div className="relative my-2 py-3 px-4 bg-[#230C3B]/60 rounded-2xl border border-white/10 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] text-purple-300">Zona Triunfo</span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-xl shadow-lg border border-yellow-200 animate-pulse">
                  ⭐
                </div>
              </div>

              {/* Active Tokens on track status */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white">Casillas Seguras ⭐</span>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                    Pos: {players[0].tokens.filter(t => t >= 0).join(', ') || '0'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Pos: {players[1].tokens.filter(t => t >= 0).join(', ') || '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: Blue Base & Yellow Base */}
            <div className="flex justify-between items-center">
              {/* Blue Home Base */}
              <div className="w-28 h-28 rounded-2xl bg-blue-950/40 border-2 border-blue-500/50 p-1.5 flex flex-col justify-between">
                <span className="text-[9px] font-black text-blue-400 uppercase">Base Azul</span>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {players[3].tokens.map((pos, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        pos === -1
                          ? 'bg-blue-500 text-white shadow-md border border-blue-300'
                          : 'bg-white/5 border border-dashed border-blue-500/30'
                      }`}
                    >
                      {pos === -1 ? '🔵' : '✓'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Yellow Home Base */}
              <div className="w-28 h-28 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 p-1.5 flex flex-col justify-between">
                <span className="text-[9px] font-black text-amber-400 uppercase text-right">Base Amarilla</span>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {players[2].tokens.map((pos, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        pos === -1
                          ? 'bg-amber-400 text-black shadow-md border border-amber-200'
                          : 'bg-white/5 border border-dashed border-amber-500/30'
                      }`}
                    >
                      {pos === -1 ? '🟡' : '✓'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action & Dice Rolling Section */}
          <div className="mt-3 p-3 rounded-2xl bg-[#200B36] border border-white/10 flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-3">
              <span className="text-[10px] text-purple-300">
                {isUserTurn ? '¡Es tu turno!' : `Esperando a ${currentPlayer.name}...`}
              </span>
              <p className="text-xs font-bold text-white truncate">
                {waitingMove && isUserTurn
                  ? `Sacaste un ${diceValue}. Toca una ficha para moverla.`
                  : historyLog[0]}
              </p>
            </div>

            {/* 3D Dice */}
            <div className="flex items-center gap-2">
              <button
                disabled={!isUserTurn || waitingMove || isRolling}
                onClick={handleRollDice}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-white to-gray-200 text-black font-black text-2xl shadow-xl flex items-center justify-center border-2 border-purple-300 transition-all ${
                  isRolling ? 'animate-spin' : ''
                } ${
                  isUserTurn && !waitingMove
                    ? 'hover:scale-105 active:scale-95 shadow-purple-500/50 animate-bounce'
                    : 'opacity-80'
                }`}
              >
                {diceValue !== null ? (
                  <span>
                    {diceValue === 1 && '⚀'}
                    {diceValue === 2 && '⚁'}
                    {diceValue === 3 && '⚂'}
                    {diceValue === 4 && '⚃'}
                    {diceValue === 5 && '⚄'}
                    {diceValue === 6 && '⚅'}
                  </span>
                ) : (
                  <Dices size={28} className="text-purple-900" />
                )}
              </button>
            </div>
          </div>

          {/* WINNER MODAL CELEBRATION */}
          {gameWinner && (
            <div className="absolute inset-0 bg-black/90 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-40">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-2xl mb-3">
                👑
              </div>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400 mb-1">
                ¡VICTORIA EN LUDO!
              </span>
              <h3 className="text-lg font-black text-white">{gameWinner.name} se llevó la corona</h3>
              <p className="text-xs text-purple-300 mt-1">Todas sus fichas llegaron a la zona de gloria.</p>

              {gameWinner.id === currentUser.id && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-center w-full">
                  <span className="text-xs font-black text-amber-300">RECOMPENSA DE GANADOR</span>
                  <p className="text-xl font-black text-white">+500 🪙 Monedas</p>
                </div>
              )}

              <button
                onClick={() => {
                  setGameWinner(null);
                  setCurrentTurn(0);
                  setDiceValue(null);
                  setWaitingMove(false);
                  setPlayers(prev => prev.map(p => ({ ...p, tokens: [-1, -1, 0, 4] })));
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs hover:brightness-110 transition"
              >
                Jugar Otra Partida 🎲
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
