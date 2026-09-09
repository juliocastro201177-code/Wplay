import React, { useState, useEffect } from 'react';
import { X, Flame, Sparkles, HelpCircle, ShieldAlert, Trophy, RotateCcw, Volume2, Coins } from 'lucide-react';
import { User, RoomSeat } from '../../types';
import { playSound } from '../../utils/audio';

interface TruthOrDareGameProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

const TRUTHS = [
  '¿Quién de los que está en esta sala te parece más atractivo/a y por qué? 😏',
  '¿Cuál es la mentira más grande que le has dicho a tu ex para terminar? 💔',
  '¿Alguna vez revisaste el celular de tu pareja a escondidas? ¿Qué encontraste? 📱',
  '¿Qué es lo más vergonzoso que hiciste estando borracho/a en una fiesta? 🍻',
  '¿Te has enamorado de la pareja de un amigo/a cercano? Sé sincero/a 🤐',
  '¿Cuál es tu fantasía o fetiche más inconfesable que nadie sabe? 🔥',
  'Si tuvieras que pasar 24 horas encerrado en una habitación con alguien de la sala, ¿a quién eliges? 👀',
];

const DARES = [
  'Habla por el micrófono con acento español o argentino durante los próximos 2 minutos 🎙️',
  'Envía un emoji de corazón 💖 a la última persona con la que hablaste por WhatsApp y muéstralo 😈',
  'Canta el coro de tu canción favorita a todo pulmón en el micrófono 🎶',
  'Di 3 piropos bien románticos o atrevidos a la persona que está a tu lado en los asientos 💋',
  'Haz un sonido gracioso de animal (gallo, vaca o delfín) con el micrófono abierto durante 5 segundos 🐔',
  'Confiésale un secreto a toda la sala que jamás le hayas contado a tus padres 🙈',
];

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({
  currentUser,
  roomSeats,
  onClose,
  onRewardCoins,
}) => {
  const activePlayers = [
    { uid: currentUser.id, name: currentUser.nickname, avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    ...roomSeats.filter(s => s.user && s.user.id !== currentUser.id).map(s => ({
      uid: s.user!.id,
      name: s.user!.nickname,
      avatar: s.user!.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    })),
  ];

  if (activePlayers.length < 3) {
    activePlayers.push(
      { uid: 'b1', name: 'Valeria_CDMX 🇲🇽', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { uid: 'b2', name: 'Mateo_VIP 🔥', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
    );
  }

  const [selectedTarget, setSelectedTarget] = useState(activePlayers[0]);
  const [currentPrompt, setCurrentPrompt] = useState<{ type: 'truth' | 'dare'; text: string } | null>(null);
  const [timer, setTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSound('buzz');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handlePickTruth = () => {
    const text = TRUTHS[Math.floor(Math.random() * TRUTHS.length)];
    setCurrentPrompt({ type: 'truth', text });
    setTimer(30);
    setIsTimerRunning(true);
    setHasCompleted(false);
    playSound('romance');
  };

  const handlePickDare = () => {
    const text = DARES[Math.floor(Math.random() * DARES.length)];
    setCurrentPrompt({ type: 'dare', text });
    setTimer(30);
    setIsTimerRunning(true);
    setHasCompleted(false);
    playSound('horn');
  };

  const spinRandomPlayer = () => {
    playSound('pop');
    const random = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    setSelectedTarget(random);
    setCurrentPrompt(null);
    setIsTimerRunning(false);
    setTimer(30);
    setHasCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#1B082C] border border-pink-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-600/30 via-purple-900/40 to-pink-600/30 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 to-pink-500 flex items-center justify-center text-lg shadow-md">
              😈
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                Verdad o Reto • 18+ WePlay
                <span className="px-1.5 py-0.2 rounded bg-red-500/30 text-red-300 text-[9px] font-bold border border-red-400/30">
                  PICANTE
                </span>
              </h2>
              <p className="text-[10px] text-purple-300">Secretos inconfesables y retos calientes en vivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
          {/* Target victim selection */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#280D42] border border-white/10">
            <div className="flex items-center gap-2.5">
              <img
                src={selectedTarget.avatar}
                alt={selectedTarget.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-pink-400 shadow-md"
              />
              <div>
                <span className="text-[9px] text-pink-300 font-bold uppercase tracking-wider">Víctima en turno</span>
                <h3 className="text-xs font-black text-white flex items-center gap-1">
                  {selectedTarget.name}
                  {selectedTarget.uid === currentUser.id && (
                    <span className="px-1.5 py-0.2 bg-purple-500 text-white rounded text-[8px]">¡ERES TÚ!</span>
                  )}
                </h3>
              </div>
            </div>
            <button
              onClick={spinRandomPlayer}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[11px] hover:brightness-110 active:scale-95 transition flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Girar
            </button>
          </div>

          {/* Truth or Dare Choice */}
          {!currentPrompt ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-4">
              <span className="text-xs font-bold text-purple-300 text-center">
                ¿Qué elige {selectedTarget.name}?
              </span>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={handlePickTruth}
                  className="p-5 rounded-3xl bg-gradient-to-tr from-purple-700 to-indigo-700 hover:brightness-110 active:scale-95 transition flex flex-col items-center gap-2 border border-purple-400/40 shadow-xl group"
                >
                  <span className="text-4xl group-hover:scale-110 transition">📜</span>
                  <span className="font-black text-sm text-white tracking-wide">VERDAD</span>
                  <span className="text-[10px] text-purple-200 text-center">Responde una pregunta picante</span>
                </button>

                <button
                  onClick={handlePickDare}
                  className="p-5 rounded-3xl bg-gradient-to-tr from-red-600 to-pink-600 hover:brightness-110 active:scale-95 transition flex flex-col items-center gap-2 border border-red-400/40 shadow-xl group"
                >
                  <span className="text-4xl group-hover:scale-110 transition">⚡</span>
                  <span className="font-black text-sm text-white tracking-wide">RETO</span>
                  <span className="text-[10px] text-pink-200 text-center">Cumple el reto en el micrófono</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between py-2 space-y-3">
              {/* Prompt Card */}
              <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#2B0E44] to-[#170626] border border-pink-400/50 shadow-2xl text-center space-y-3">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    currentPrompt.type === 'truth'
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                      : 'bg-red-500/30 text-red-300 border border-red-400'
                  }`}
                >
                  {currentPrompt.type === 'truth' ? '📜 PREGUNTA DE VERDAD' : '⚡ DESAFÍO DE RETO'}
                </span>

                <p className="text-sm font-black text-white leading-relaxed pt-2">
                  "{currentPrompt.text}"
                </p>

                {/* Countdown timer */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                      timer <= 5
                        ? 'border-red-500 text-red-400 animate-ping'
                        : 'border-amber-400 text-amber-300'
                    }`}
                  >
                    {timer}s
                  </div>
                  <span className="text-[11px] text-purple-300">para hablar al micrófono</span>
                </div>
              </div>

              {/* Completion or Penalty */}
              {!hasCompleted ? (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setHasCompleted(true);
                      setIsTimerRunning(false);
                      playSound('win');
                      if (selectedTarget.uid === currentUser.id) {
                        onRewardCoins(150);
                      }
                    }}
                    className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs hover:brightness-110 active:scale-95 transition shadow-lg"
                  >
                    ¡Cumplido! (+150 🪙)
                  </button>
                  <button
                    onClick={() => {
                      setHasCompleted(true);
                      setIsTimerRunning(false);
                      playSound('splat');
                    }}
                    className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-red-400 font-bold text-xs transition active:scale-95 border border-red-500/30"
                  >
                    Castigo / No quiso 🍅
                  </button>
                </div>
              ) : (
                <button
                  onClick={spinRandomPlayer}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:brightness-110 transition"
                >
                  Siguiente Jugador ➔
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
