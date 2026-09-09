import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Volume2, Music, Sparkles, Trophy, Flame, Award, Heart, ThumbsUp } from 'lucide-react';
import { User, RoomSeat } from '../../types';
import { playSound } from '../../utils/audio';

interface KaraokeGameProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  difficulty: string;
  lyrics: { time: number; text: string }[];
}

const SONGS: Song[] = [
  {
    id: 's1',
    title: 'Ella Baila Sola',
    artist: 'Peso Pluma & Eslabón Armado',
    genre: 'Corridos Tumbados',
    difficulty: 'Medio 🔥',
    lyrics: [
      { time: 0, text: 'Compa, ¿qué le parece esa morra?' },
      { time: 3, text: 'La que anda bailando sola me gusta pa\' mí' },
      { time: 7, text: 'Bella, ella sabe que está buena' },
      { time: 10, text: 'Que todos andan mirándola cómo baila' },
      { time: 14, text: 'Me acerco y le tiro todo un verbo' },
      { time: 18, text: 'Tomamos tragos sin peros, sólo tentación...' },
    ],
  },
  {
    id: 's2',
    title: 'Dákiti',
    artist: 'Bad Bunny & Jhayco',
    genre: 'Reggaetón',
    difficulty: 'Fácil 🌴',
    lyrics: [
      { time: 0, text: 'Baby, ya yo me enteré, se nota cuando me ve\'' },
      { time: 3, text: 'Ahí donde no has llega\'o sabes que yo te llevaré' },
      { time: 7, text: 'Y dime qué tú quiere\' beber, es que tú ere\' mi bebé' },
      { time: 11, text: '¿De ti quién se va a olvidar? Dime si me va\' a llamar' },
      { time: 15, text: 'Tú me tiene\' en un vaivén, dándome vuelta\' en el Merce' },
    ],
  },
  {
    id: 's3',
    title: 'Tusa',
    artist: 'Karol G & Nicki Minaj',
    genre: 'Pop Urbano',
    difficulty: 'Divertido 💅',
    lyrics: [
      { time: 0, text: 'Ya no tiene excusa, hoy se va pa\' la discoteca' },
      { time: 4, text: 'A olvidar a ese hombre que le hizo daño' },
      { time: 8, text: 'Pero si le ponen la canción, le da una depresión tonta' },
      { time: 12, text: 'Llora llamándolo al celular, pero él ya no contesta' },
      { time: 16, text: 'Y ahora sale con las amigas a vacilar...' },
    ],
  },
  {
    id: 's4',
    title: 'Pepas',
    artist: 'Farruko',
    genre: 'Guaracha Electrónica',
    difficulty: 'Energía ⚡',
    lyrics: [
      { time: 0, text: 'No me importa lo que de mí se diga' },
      { time: 3, text: 'Viva usted su vida, que yo vivo la mía' },
      { time: 6, text: 'Que sólo es una, disfruta el momento' },
      { time: 10, text: 'Pastillas, pepas y agua, pa\' la seca' },
      { time: 13, text: 'To\' el mundo en pastilla\' en la discoteca...' },
    ],
  },
];

export const KaraokeGame: React.FC<KaraokeGameProps> = ({
  currentUser,
  roomSeats,
  onClose,
  onRewardCoins,
}) => {
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS[0]);
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'grab' | 'singing' | 'score'>('lobby');
  const [countdown, setCountdown] = useState(3);
  const [micHolder, setMicHolder] = useState<{ uid: string; name: string; avatar: string } | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [pitchScore, setPitchScore] = useState(88);
  const [audienceReactions, setAudienceReactions] = useState<{ id: string; emoji: string; text?: string; from: string }[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [applauseCount, setApplauseCount] = useState(14);
  const [roseCount, setRoseCount] = useState(8);

  const activePlayers = [
    { uid: currentUser.id, name: currentUser.nickname, avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    ...roomSeats.filter(s => s.user && s.user.id !== currentUser.id).map(s => ({
      uid: s.user!.id,
      name: s.user!.nickname,
      avatar: s.user!.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    })),
  ];

  // If fewer than 4 players, fill with simulated friendly party participants
  if (activePlayers.length < 4) {
    const bots = [
      { uid: 'bot_k1', name: 'Sofi_Pop 🌸', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { uid: 'bot_k2', name: 'DJ_Gael 🎧', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { uid: 'bot_k3', name: 'Karla_Vip 💎', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    ];
    activePlayers.push(...bots.slice(0, 4 - activePlayers.length));
  }

  // Handle countdown to grab mic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(c => c - 1);
          playSound('click');
        }, 1000);
      } else {
        setGameState('grab');
        playSound('horn');
      }
    }
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  // Handle auto grab by bot if player doesn't grab within 3.5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'grab' && !micHolder) {
      timer = setTimeout(() => {
        // Random bot grabs mic if user didn't
        const winner = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        setMicHolder(winner);
        setGameState('singing');
        playSound('bell');
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [gameState, micHolder, activePlayers]);

  // Handle Singing lyrics scrolling
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'singing') {
      if (currentLineIndex < selectedSong.lyrics.length - 1) {
        timer = setTimeout(() => {
          setCurrentLineIndex(idx => idx + 1);
          setPitchScore(prev => Math.min(100, Math.max(70, prev + Math.floor(Math.random() * 7) - 2)));
        }, 3200);
      } else {
        // Song ended, show score
        timer = setTimeout(() => {
          setGameState('score');
          playSound('win');
          if (micHolder?.uid === currentUser.id) {
            onRewardCoins(350);
          }
        }, 3500);
      }
    }
    return () => clearTimeout(timer);
  }, [gameState, currentLineIndex, selectedSong, micHolder, currentUser.id, onRewardCoins]);

  const handleGrabMic = () => {
    if (gameState !== 'grab') return;
    playSound('horn');
    setMicHolder({
      uid: currentUser.id,
      name: currentUser.nickname,
      avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    setGameState('singing');
  };

  const sendAudienceReaction = (emoji: string, sound: 'applause' | 'laughter' | 'splat' | 'pop' | 'romance' | 'horn') => {
    playSound(sound);
    if (emoji === '👏') setApplauseCount(c => c + 1);
    if (emoji === '🌹') setRoseCount(c => c + 1);

    const newReaction = {
      id: Math.random().toString(),
      emoji,
      from: currentUser.nickname,
    };
    setAudienceReactions(prev => [...prev.slice(-6), newReaction]);
    setTimeout(() => {
      setAudienceReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#18092B] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-600/30 via-purple-900/40 to-pink-600/30 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-lg shadow-md">
              🎤
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                Mic Grab • Karaoke WePlay
                <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                  EN VIVO
                </span>
              </h2>
              <p className="text-[10px] text-purple-300">¡Roba el micrófono y canta los éxitos del momento!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic Canvas / Stage */}
        <div className="relative p-4 flex-1 flex flex-col items-center justify-between overflow-y-auto">
          {/* Floating audience reactions overlay */}
          <div className="absolute inset-x-4 top-16 pointer-events-none flex flex-col items-center gap-2 z-30">
            {audienceReactions.map(r => (
              <div
                key={r.id}
                className="animate-bounce text-2xl bg-black/60 px-3 py-1 rounded-full border border-white/20 text-white font-bold flex items-center gap-1.5 shadow-lg"
              >
                <span>{r.emoji}</span>
                <span className="text-[10px] text-amber-300">{r.from}</span>
              </div>
            ))}
          </div>

          {/* LOBBY: Song selection */}
          {gameState === 'lobby' && (
            <div className="w-full space-y-3">
              <div className="text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-400/30">
                  SELECCIONA LA CANCIÓN
                </span>
                <h3 className="text-base font-black text-white mt-1">Playlist de Fiesta Latina 🎶</h3>
              </div>

              <div className="space-y-2">
                {SONGS.map(song => (
                  <div
                    key={song.id}
                    onClick={() => {
                      setSelectedSong(song);
                      playSound('click');
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selectedSong.id === song.id
                        ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-amber-400 shadow-md'
                        : 'bg-[#220B38]/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-sm shadow">
                        🎵
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{song.title}</h4>
                        <p className="text-[10px] text-purple-300">{song.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-purple-200">
                            {song.genre}
                          </span>
                          <span className="text-[9px] text-amber-300 font-semibold">{song.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    {selectedSong.id === song.id && (
                      <span className="text-xs text-amber-400 font-black">LISTA ✓</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Ready button */}
              <button
                onClick={() => {
                  playSound('pop');
                  setGameState('countdown');
                  setCountdown(3);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Mic size={16} />
                ¡INICIAR ROBO DE MICRÓFONO!
              </button>
            </div>
          )}

          {/* COUNTDOWN */}
          {gameState === 'countdown' && (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <span className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-2">
                ¡Prepárense para robar el micrófono!
              </span>
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-pulse">
                {countdown > 0 ? countdown : '¡YA!'}
              </div>
              <p className="text-[11px] text-purple-300 mt-4">Canción: {selectedSong.title}</p>
            </div>
          )}

          {/* GRAB MIC BUTTON */}
          {gameState === 'grab' && (
            <div className="flex-1 flex flex-col items-center justify-center py-8 w-full">
              <div className="text-center mb-6">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-500/40 animate-pulse">
                  ¡TOCA RÁPIDO PARA ROBAR!
                </span>
                <h3 className="text-lg font-black text-white mt-2">¿Quién se apodera del escenario?</h3>
              </div>

              <button
                onClick={handleGrabMic}
                className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white font-black text-base shadow-2xl flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all border-4 border-yellow-300 animate-bounce"
              >
                <Mic size={40} className="text-yellow-200" />
                <span className="text-sm font-black tracking-wider uppercase">¡ROBAR!</span>
              </button>

              <div className="flex items-center gap-3 mt-8">
                {activePlayers.map(p => (
                  <div key={p.uid} className="flex flex-col items-center gap-1">
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-purple-400/40" />
                    <span className="text-[9px] text-purple-200 truncate w-12 text-center">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SINGING MODE */}
          {gameState === 'singing' && micHolder && (
            <div className="w-full flex-1 flex flex-col justify-between py-2">
              {/* Singer Card */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#230C3B] border border-amber-400/40 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img src={micHolder.avatar} alt={micHolder.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400" />
                    <span className="absolute -bottom-1 -right-1 text-sm bg-amber-500 rounded-full p-0.5">🎤</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">En el Micrófono</span>
                    <h3 className="text-xs font-black text-white flex items-center gap-1">
                      {micHolder.name}
                      {micHolder.uid === currentUser.id && (
                        <span className="px-1.5 py-0.2 bg-purple-500 text-white rounded text-[8px]">TÚ</span>
                      )}
                    </h3>
                    <p className="text-[10px] text-purple-300">{selectedSong.title}</p>
                  </div>
                </div>

                {/* Pitch Score Gauge */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                    <Flame size={14} className="text-amber-400 animate-pulse" />
                    <span>{pitchScore}%</span>
                  </div>
                  <span className="text-[9px] text-purple-300">Precisión Vocal</span>
                </div>
              </div>

              {/* Dynamic Soundwave Visualizer */}
              <div className="flex items-center justify-center gap-1.5 my-3 h-10">
                {[40, 70, 90, 60, 100, 80, 50, 95, 75, 85, 65, 45].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${(h * pitchScore) / 100}%` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 via-pink-500 to-purple-400 transition-all duration-300"
                  />
                ))}
              </div>

              {/* Rolling Lyrics Teleprompter */}
              <div className="p-4 rounded-2xl bg-[#140524] border border-white/10 text-center space-y-2 min-h-[110px] flex flex-col justify-center">
                {currentLineIndex > 0 && (
                  <p className="text-xs text-purple-400/60 transition">{selectedSong.lyrics[currentLineIndex - 1].text}</p>
                )}
                <p className="text-sm font-black text-amber-300 bg-amber-500/10 py-1.5 px-3 rounded-xl border border-amber-400/30 animate-pulse">
                  {selectedSong.lyrics[currentLineIndex].text}
                </p>
                {currentLineIndex < selectedSong.lyrics.length - 1 && (
                  <p className="text-xs text-purple-300/60 transition">{selectedSong.lyrics[currentLineIndex + 1].text}</p>
                )}
              </div>

              {/* Audience Interactive Reaction Bar */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-300">Reaccionar al cantante:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sendAudienceReaction('👏', 'applause')}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition active:scale-95"
                  >
                    <span>👏</span>
                    <span className="text-[9px] text-amber-300">{applauseCount}</span>
                  </button>
                  <button
                    onClick={() => sendAudienceReaction('🌹', 'romance')}
                    className="px-2.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-1 transition active:scale-95 border border-pink-500/30"
                  >
                    <span>🌹</span>
                    <span className="text-[9px] text-pink-200">{roseCount}</span>
                  </button>
                  <button
                    onClick={() => sendAudienceReaction('🍅', 'splat')}
                    className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition active:scale-95 border border-red-500/30"
                  >
                    🍅
                  </button>
                  <button
                    onClick={() => sendAudienceReaction('🔥', 'horn')}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition active:scale-95 border border-amber-500/30"
                  >
                    🔥
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCORE RESULT */}
          {gameState === 'score' && micHolder && (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl">
                  🏆
                </div>
                <span className="mt-2 px-3 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-black border border-amber-400">
                  CALIFICACIÓN VOCAL SSS
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-base font-black text-white">{micHolder.name} la rompió</h3>
                <p className="text-xs text-purple-300">Puntaje final: {pitchScore} / 100 puntos</p>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs text-purple-200">
                  <span>👏 {applauseCount} Aplausos</span>
                  <span>🌹 {roseCount} Rosas</span>
                </div>
              </div>

              {micHolder.uid === currentUser.id ? (
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-center w-full">
                  <span className="text-xs font-black text-amber-300">¡PREMIO DE CANTANTE ESTRELLA!</span>
                  <p className="text-lg font-black text-white">+350 🪙 Monedas Añadidas</p>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/5 text-center w-full text-xs text-purple-300">
                  ¡Gran actuación! Prepárate para robar en la siguiente ronda.
                </div>
              )}

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => {
                    setGameState('lobby');
                    setCurrentLineIndex(0);
                    setMicHolder(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                >
                  Cambiar Canción
                </button>
                <button
                  onClick={() => {
                    setGameState('countdown');
                    setCountdown(3);
                    setCurrentLineIndex(0);
                    setMicHolder(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs transition hover:brightness-110"
                >
                  Cantar Otra Vez 🎤
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
