import React, { useState, useEffect } from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Shield, 
  Eye, 
  Skull, 
  FlaskConical, 
  Sparkles, 
  Clock, 
  AlertOctagon, 
  Check, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, RoomSeat, WerewolfPlayer, WerewolfRole, WerewolfGameState } from '../../types';
import { playSound } from '../../utils/audio';
import { ChibiAvatar } from '../avatar/ChibiAvatar';

interface SpaceWerewolfGameProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onClose: () => void;
  onRewardCoins?: (amount: number) => void;
}

const BOT_NAMES = [
  'Valeria_CDMX',
  'Mateo_Regio',
  'Sofia_Astral',
  'Carlos_Cosmic',
  'Camila_Star',
];

export const SpaceWerewolfGame: React.FC<SpaceWerewolfGameProps> = ({
  currentUser,
  roomSeats,
  onClose,
  onRewardCoins,
}) => {
  const [gameState, setGameState] = useState<WerewolfGameState>(() => {
    // 6 Players configuration: 2 Werewolves, 1 Seer, 1 Witch, 2 Villagers
    const players: WerewolfPlayer[] = [];

    // Current user role
    players.push({
      uid: currentUser.uid,
      nickname: currentUser.nickname,
      avatarUrl: currentUser.avatarUrl,
      avatarConfig: currentUser.avatarConfig,
      role: 'werewolf', // Assigned dynamically below
      isAlive: true,
      votesReceived: 0,
    });

    let bIdx = 0;
    roomSeats.filter(s => s.user && s.user.uid !== currentUser.uid).forEach(s => {
      if (players.length < 6 && s.user) {
        players.push({
          uid: s.user.uid,
          nickname: s.user.nickname,
          avatarUrl: s.user.avatarUrl,
          avatarConfig: s.user.avatarConfig,
          role: 'villager',
          isAlive: true,
          votesReceived: 0,
        });
      }
    });

    while (players.length < 6) {
      players.push({
        uid: `bot_wolf_${bIdx}`,
        nickname: BOT_NAMES[bIdx % BOT_NAMES.length],
        avatarConfig: {
          skinColor: '#FFDFBA',
          hairStyle: bIdx % 2 === 0 ? 'fluffy_curls' : 'short_anime',
          hairColor: '#3B2011',
          expression: 'cool',
          outfit: 'cyber_jacket',
          outfitColor: '#8B5CF6',
          headwear: 'none',
          glasses: 'none',
          accessory: 'none',
        },
        role: 'villager',
        isAlive: true,
        votesReceived: 0,
      });
      bIdx++;
    }

    // Role distribution: 2 werewolves, 1 seer, 1 witch, 2 villagers
    const rolesPool: WerewolfRole[] = ['werewolf', 'werewolf', 'seer', 'witch', 'villager', 'villager'];
    // Shuffle pool
    const shuffledRoles = [...rolesPool].sort(() => Math.random() - 0.5);
    players.forEach((p, idx) => {
      p.role = shuffledRoles[idx];
    });

    return {
      phase: 'night_werewolf',
      dayNumber: 1,
      timeLeft: 12,
      players,
      nightVictimUid: null,
      witchHealed: false,
      witchPoisonedUid: null,
      witchHasHealPotion: true,
      witchHasPoisonPotion: true,
      eliminatedUid: null,
      log: ['🚀 La nave espacial entra en órbita nocturna. Cierren los ojos...'],
    };
  });

  const [selectedTargetUid, setSelectedTargetUid] = useState<string | null>(null);
  const [seerInspectionResult, setSeerInspectionResult] = useState<string | null>(null);

  const me = gameState.players.find(p => p.uid === currentUser.uid);

  // Auto phase timer engine
  useEffect(() => {
    if (gameState.phase === 'game_over') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft > 1) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }

        // Phase transitions when timer expires:
        if (prev.phase === 'night_werewolf') {
          // If wolf didn't pick, pick a random non-wolf
          let victim = prev.nightVictimUid;
          if (!victim) {
            const nonWolves = prev.players.filter(p => p.isAlive && p.role !== 'werewolf');
            if (nonWolves.length > 0) {
              victim = nonWolves[Math.floor(Math.random() * nonWolves.length)].uid;
            }
          }
          playSound('swords');
          return {
            ...prev,
            nightVictimUid: victim,
            phase: 'night_seer',
            timeLeft: 10,
            log: [...prev.log, '🐺 Los hombres lobo han elegido a su presa...'],
          };
        }

        if (prev.phase === 'night_seer') {
          playSound('bell');
          return {
            ...prev,
            phase: 'night_witch',
            timeLeft: 10,
            log: [...prev.log, '🔮 El vidente ha completado su inspección cósmica.'],
          };
        }

        if (prev.phase === 'night_witch') {
          // Night ends, calculate deaths
          playSound('engine');
          const deaths: string[] = [];
          if (prev.nightVictimUid && !prev.witchHealed) {
            deaths.push(prev.nightVictimUid);
          }
          if (prev.witchPoisonedUid) {
            deaths.push(prev.witchPoisonedUid);
          }

          const updatedPlayers = prev.players.map(p => ({
            ...p,
            isAlive: deaths.includes(p.uid) ? false : p.isAlive,
            votesReceived: 0,
          }));

          const victimNames = prev.players
            .filter(p => deaths.includes(p.uid))
            .map(p => p.nickname)
            .join(' y ');

          const morningLog = deaths.length > 0
            ? `☀️ ¡Amanecer en la nave! Lamentablemente falleció: ${victimNames} 💀`
            : '☀️ ¡Amanecer pacífico! La bruja salvó a la víctima milagrosamente 💖';

          return {
            ...prev,
            players: updatedPlayers,
            phase: 'day_announcement',
            timeLeft: 6,
            log: [...prev.log, morningLog],
          };
        }

        if (prev.phase === 'day_announcement') {
          // Check if game over immediately
          const check = checkVictory(prev.players);
          if (check) {
            if (check === 'villagers') {
              playSound('win');
              confetti({ particleCount: 150, spread: 80 });
            } else {
              playSound('bass');
            }
            return {
              ...prev,
              phase: 'game_over',
              winner: check,
            };
          }

          playSound('bell');
          return {
            ...prev,
            phase: 'day_discussion',
            timeLeft: 18,
            log: [...prev.log, '🎙️ Comienza la asamblea de emergencia. ¡Debatan y busquen sospechosos!'],
          };
        }

        if (prev.phase === 'day_discussion') {
          playSound('swords');
          return {
            ...prev,
            phase: 'day_voting',
            timeLeft: 15,
            log: [...prev.log, '🗳️ ¡Votación abierta! Selecciona a quién expulsar por la esclusa.'],
          };
        }

        if (prev.phase === 'day_voting') {
          // Tally day votes
          let maxVotes = -1;
          let ejectedUid: string | null = null;
          prev.players.forEach(p => {
            if (p.isAlive && p.votesReceived > maxVotes) {
              maxVotes = p.votesReceived;
              ejectedUid = p.uid;
            }
          });

          // Simulate bots voting if they didn't
          const updated = prev.players.map(p => ({
            ...p,
            isAlive: p.uid === ejectedUid ? false : p.isAlive,
          }));

          const ejectedPlayer = prev.players.find(p => p.uid === ejectedUid);
          const verdictMsg = ejectedPlayer
            ? `🚀 ${ejectedPlayer.nickname} fue expulsado al espacio. Era: ${ejectedPlayer.role.toUpperCase()}`
            : '⚖️ Votación empatada. Nadie fue expulsado hoy.';

          playSound('bass');

          return {
            ...prev,
            players: updated,
            eliminatedUid: ejectedUid,
            phase: 'verdict',
            timeLeft: 6,
            log: [...prev.log, verdictMsg],
          };
        }

        if (prev.phase === 'verdict') {
          // Check win conditions
          const check = checkVictory(prev.players);
          if (check) {
            if (check === 'villagers') {
              playSound('win');
              confetti({ particleCount: 150, spread: 80 });
            } else {
              playSound('bass');
            }
            return {
              ...prev,
              phase: 'game_over',
              winner: check,
            };
          }

          // Next night
          playSound('romance');
          return {
            ...prev,
            phase: 'night_werewolf',
            dayNumber: prev.dayNumber + 1,
            timeLeft: 12,
            nightVictimUid: null,
            witchHealed: false,
            witchPoisonedUid: null,
            eliminatedUid: null,
            log: [...prev.log, `🌙 Noche ${prev.dayNumber + 1}. Las luces de la nave se apagan...`],
          };
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.phase]);

  // Victory checker helper
  const checkVictory = (players: WerewolfPlayer[]): 'villagers' | 'werewolves' | null => {
    const aliveWolves = players.filter(p => p.isAlive && p.role === 'werewolf').length;
    const aliveHumans = players.filter(p => p.isAlive && p.role !== 'werewolf').length;

    if (aliveWolves === 0) return 'villagers';
    if (aliveWolves >= aliveHumans) return 'werewolves';
    return null;
  };

  // Action handlers
  const handleWerewolfAttack = (targetUid: string) => {
    playSound('swords');
    setSelectedTargetUid(targetUid);
    setGameState(prev => ({
      ...prev,
      nightVictimUid: targetUid,
      log: [...prev.log, `🐺 Lobo atacó a un tripulante`],
    }));
  };

  const handleSeerInspect = (targetUid: string) => {
    playSound('bell');
    const target = gameState.players.find(p => p.uid === targetUid);
    if (target) {
      setSeerInspectionResult(target.role === 'werewolf' ? '¡ES UN HOMBRE LOBO! 🐺' : 'Es Inocente / Humano 😇');
    }
  };

  const handleWitchHeal = () => {
    playSound('sparkle' as any);
    setGameState(prev => ({
      ...prev,
      witchHealed: true,
      witchHasHealPotion: false,
      log: [...prev.log, '🧙 La bruja usó su poción de vida para salvar a la víctima.'],
    }));
  };

  const handleCastDayVote = (targetUid: string) => {
    playSound('coin');
    setSelectedTargetUid(targetUid);
    setGameState(prev => {
      const updated = prev.players.map(p => {
        if (p.uid === targetUid) {
          return { ...p, votesReceived: p.votesReceived + 1 };
        }
        return p;
      });
      return { ...prev, players: updated };
    });
  };

  // Restart
  const handleRestart = () => {
    playSound('pop');
    setSelectedTargetUid(null);
    setSeerInspectionResult(null);
    setGameState(prev => {
      const rolesPool: WerewolfRole[] = ['werewolf', 'werewolf', 'seer', 'witch', 'villager', 'villager'];
      const shuffledRoles = [...rolesPool].sort(() => Math.random() - 0.5);
      const resetPlayers = prev.players.map((p, i) => ({
        ...p,
        isAlive: true,
        role: shuffledRoles[i],
        votesReceived: 0,
      }));
      return {
        phase: 'night_werewolf',
        dayNumber: 1,
        timeLeft: 12,
        players: resetPlayers,
        nightVictimUid: null,
        witchHealed: false,
        witchPoisonedUid: null,
        witchHasHealPotion: true,
        witchHasPoisonPotion: true,
        eliminatedUid: null,
        log: ['🚀 Nueva partida de Space Werewolf iniciada.'],
      };
    });
  };

  const isNight = gameState.phase.startsWith('night_');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 animate-in fade-in">
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] border transition-colors duration-700 ${
        isNight
          ? 'bg-gradient-to-b from-[#0B061A] via-[#120B2E] to-[#080314] border-purple-900/60'
          : 'bg-gradient-to-b from-[#1E1138] via-[#2F1C4E] to-[#150B28] border-purple-500/40'
      }`}>
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-800/40 bg-black/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xl shadow-lg ${
              isNight ? 'bg-indigo-950 border border-indigo-500/50' : 'bg-amber-500/20 border border-amber-500/50'
            }`}>
              {isNight ? '🌙' : '☀️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-white text-base">Space Werewolf</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  Día {gameState.dayNumber}
                </span>
              </div>
              <p className="text-[11px] text-purple-300">
                Tu Rol: <strong className="text-yellow-300 uppercase">{me?.role}</strong> {me?.role === 'werewolf' ? '🐺' : me?.role === 'seer' ? '🔮' : me?.role === 'witch' ? '🧙' : '👨‍🚀'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-purple-900/60 text-purple-200 border border-purple-700/50">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
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

        {/* Phase Announcement Banner */}
        <div className={`px-5 py-2.5 border-b text-xs font-semibold flex items-center justify-between ${
          isNight
            ? 'bg-indigo-950/80 text-indigo-200 border-indigo-900/50'
            : 'bg-amber-950/40 text-amber-200 border-amber-900/40'
        }`}>
          <div className="flex items-center gap-2">
            {isNight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>
              {gameState.phase === 'night_werewolf' && '🐺 Fase de Hombres Lobo: elijan a su víctima.'}
              {gameState.phase === 'night_seer' && '🔮 Fase de Vidente: escanea la identidad de un tripulante.'}
              {gameState.phase === 'night_witch' && '🧙 Fase de Bruja: decide si salvar o envenenar.'}
              {gameState.phase === 'day_announcement' && '🚨 ¡Alarma matutina en la nave!'}
              {gameState.phase === 'day_discussion' && '🗣️ Asamblea general: debate libre por voz y chat.'}
              {gameState.phase === 'day_voting' && '🗳️ Votación de expulsión a la esclusa espacial.'}
              {gameState.phase === 'verdict' && '🚀 Veredicto de la tripulación ejecutado.'}
              {gameState.phase === 'game_over' && '🏁 Partida terminada.'}
            </span>
          </div>
        </div>

        {/* Role Guide for Current User */}
        {me && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-700/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {me.role === 'werewolf' && '🐺'}
                {me.role === 'seer' && '🔮'}
                {me.role === 'witch' && '🧙'}
                {me.role === 'villager' && '👨‍🚀'}
              </span>
              <div>
                <span className="font-bold text-white uppercase">{me.role}</span>
                <span className="text-purple-300 ml-1.5">
                  {me.role === 'werewolf' && '(Elimina a los tripulantes sin ser descubierto)'}
                  {me.role === 'seer' && '(Descubre quién es el lobo en la noche)'}
                  {me.role === 'witch' && '(Usa tus pociones de vida o veneno)'}
                  {me.role === 'villager' && '(Encuentra a los impostores y expúlsalos)'}
                </span>
              </div>
            </div>

            {/* Witch Quick Action */}
            {me.role === 'witch' && gameState.phase === 'night_witch' && gameState.nightVictimUid && (
              <button
                onClick={handleWitchHeal}
                disabled={!gameState.witchHasHealPotion || gameState.witchHealed}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-[11px] shadow-md flex items-center gap-1"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Salvar Víctima 💖</span>
              </button>
            )}
          </div>
        )}

        {/* Seer Result Notice */}
        {seerInspectionResult && gameState.phase === 'night_seer' && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-bold text-center">
            Resultado del Escáner Cósmico: {seerInspectionResult}
          </div>
        )}

        {/* Player Roster Grid (6 players) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {gameState.players.map((p) => {
            const isMe = p.uid === currentUser.uid;
            const canWolfTarget = me?.role === 'werewolf' && gameState.phase === 'night_werewolf' && p.isAlive && p.role !== 'werewolf';
            const canSeerTarget = me?.role === 'seer' && gameState.phase === 'night_seer' && p.isAlive && !isMe;
            const canVoteDay = gameState.phase === 'day_voting' && p.isAlive && !isMe;

            return (
              <div
                key={p.uid}
                className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                  !p.isAlive
                    ? 'opacity-40 bg-gray-950/60 border-gray-800'
                    : p.uid === gameState.nightVictimUid
                    ? 'bg-rose-950/50 border-rose-600 ring-1 ring-rose-500'
                    : 'bg-purple-950/30 border-purple-800/40 hover:border-purple-600/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {p.avatarUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400">
                        <img src={p.avatarUrl} alt={p.nickname} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <ChibiAvatar
                        config={p.avatarConfig}
                        size={40}
                        frameId={isMe ? currentUser.frameId : 'vip_gold'}
                      />
                    )}

                    {!p.isAlive && (
                      <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center text-sm">
                        💀
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-black text-xs text-white">
                        {p.nickname}
                      </span>
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                          Tú
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-purple-300 font-mono mt-0.5">
                      {p.isAlive ? (
                        <span className="text-emerald-400 font-bold">● En la Nave</span>
                      ) : (
                        <span className="text-rose-400 font-bold">● Fuera de Combate</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Interactive Action Button */}
                <div>
                  {canWolfTarget && (
                    <button
                      onClick={() => handleWerewolfAttack(p.uid)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md flex items-center gap-1"
                    >
                      <span>🐺 Atacar</span>
                    </button>
                  )}

                  {canSeerTarget && (
                    <button
                      onClick={() => handleSeerInspect(p.uid)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-md flex items-center gap-1"
                    >
                      <span>🔮 Escanear</span>
                    </button>
                  )}

                  {canVoteDay && (
                    <button
                      onClick={() => handleCastDayVote(p.uid)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-black transition flex items-center gap-1"
                    >
                      <span>Votar</span>
                      {p.votesReceived > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-black/50 text-[10px]">
                          {p.votesReceived}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Ship Event Log */}
        <div className="px-4 py-2.5 bg-black/60 border-t border-purple-900/60 max-h-24 overflow-y-auto font-mono text-[10px] space-y-1 text-purple-300">
          {gameState.log.slice(-3).map((line, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span>{line}</span>
            </div>
          ))}
        </div>

        {/* Game Over Screen */}
        {gameState.phase === 'game_over' && (
          <div className="p-5 bg-gradient-to-b from-purple-950 to-[#0B061A] border-t border-purple-700 text-center space-y-3">
            <div className="text-3xl">
              {gameState.winner === 'villagers' ? '🎉' : '🐺'}
            </div>
            <h3 className="font-heading font-black text-lg text-white">
              {gameState.winner === 'villagers'
                ? '¡Los Tripulantes Expulsaron a los Lobos! 🎉'
                : '¡Los Hombres Lobo Dominaron la Nave! 🐺'}
            </h3>
            <p className="text-xs text-purple-300">
              Todos los roles han sido revelados. ¡Gran partida espacial!
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  if (onRewardCoins) onRewardCoins(300);
                  handleRestart();
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:opacity-90 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jugar Otra Ronda (+300 🪙)</span>
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
