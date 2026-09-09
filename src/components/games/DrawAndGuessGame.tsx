import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Palette, 
  RotateCcw, 
  Trash2, 
  Send, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Lightbulb, 
  X,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, RoomSeat } from '../../types';
import { playSound } from '../../utils/audio';

interface DrawAndGuessGameProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

interface ChatGuess {
  id: string;
  senderName: string;
  text: string;
  isCorrect?: boolean;
}

const SECRET_WORDS = [
  { word: 'TACOS', category: 'Comida Mexicana', hint: 'Comida en tortilla de maíz con salsa y cilantro' },
  { word: 'GUITARRA', category: 'Instrumento', hint: 'Tiene seis cuerdas y madera fina' },
  { word: 'PIRAMIDE', category: 'Lugar Histórico', hint: 'Monumento prehispánico escalonado' },
  { word: 'SOMBRERO', category: 'Accesorio', hint: 'Se usa en la cabeza para tapar el sol' },
  { word: 'AVION', category: 'Transporte', hint: 'Tiene alas y viaja por las nubes' },
  { word: 'PIZZA', category: 'Comida', hint: 'Masa con queso fundido y rebanadas triangulares' },
  { word: 'VOLCAN', category: 'Naturaleza', hint: 'Montaña que expulsa lava y humo' },
  { word: 'PERRO', category: 'Animales', hint: 'El mejor amigo del humano y ladra' },
  { word: 'CORONA', category: 'Objetos VIP', hint: 'De oro brillante para los reyes' },
  { word: 'ROSA', category: 'Flores', hint: 'Flor con pétalos rojos y espinas' },
];

export const DrawAndGuessGame: React.FC<DrawAndGuessGameProps> = ({
  currentUser,
  roomSeats,
  onClose,
  onRewardCoins,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  // Game state
  const [round, setRound] = useState(1);
  const maxRounds = 3;
  const [drawerIndex, setDrawerIndex] = useState(0); // 0 = Current User, 1+ = Room players
  const [wordData, setWordData] = useState(SECRET_WORDS[0]);
  const [revealedChars, setRevealedChars] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({
    [currentUser.nickname]: 0,
    'Valeria_CDMX': 40,
    'El_Compa_Bélico': 20,
    'Sofia_Gdl': 10,
  });

  const [chatGuesses, setChatGuesses] = useState<ChatGuess[]>([
    { id: '1', senderName: 'Sistema WePlay', text: '¡Comienza la partida de Draw & Guess! 🎨 Adivina en el chat.' },
  ]);
  const [myGuessInput, setMyGuessInput] = useState('');
  const [hasGuessedCorrectly, setHasGuessedCorrectly] = useState(false);

  const isMeDrawing = drawerIndex === 0;

  // Mask the word
  const maskedWord = wordData.word
    .split('')
    .map((char, index) => (revealedChars.includes(index) || isMeDrawing || isRoundOver ? char : '_'))
    .join(' ');

  // Setup / reset round
  const startNewRound = useCallback((roundNum: number, nextDrawer: number) => {
    const randomWord = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
    setWordData(randomWord);
    setRevealedChars([]);
    setTimeLeft(60);
    setIsRoundOver(false);
    setHasGuessedCorrectly(false);
    setRound(roundNum);
    setDrawerIndex(nextDrawer);

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1A0B2E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    setChatGuesses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderName: 'Sistema WePlay',
        text: `--- Ronda ${roundNum}/${maxRounds} --- Turno de dibujar: ${
          nextDrawer === 0 ? currentUser.nickname : 'Valeria_CDMX'
        }`,
      },
    ]);
  }, [currentUser.nickname]);

  // Round timer
  useEffect(() => {
    if (isRoundOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRoundTimeout();
          return 0;
        }

        // Automatic letter hint reveals
        if (prev === 40 && revealedChars.length === 0) {
          setRevealedChars([0]);
          playSound('pop');
        } else if (prev === 20 && revealedChars.length === 1 && wordData.word.length > 3) {
          setRevealedChars([0, Math.floor(wordData.word.length / 2)]);
          playSound('pop');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRoundOver, revealedChars.length, wordData.word.length]);

  // Bot sketch simulation when other player is drawing
  useEffect(() => {
    if (isMeDrawing || isRoundOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulate drawing simple shapes over time
    const interval = setInterval(() => {
      ctx.strokeStyle = '#FF2E9D';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const x = Math.random() * (canvas.width - 40) + 20;
      const y = Math.random() * (canvas.height - 40) + 20;

      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }, 1500);

    return () => clearInterval(interval);
  }, [isMeDrawing, isRoundOver]);

  // Bot chat guessing simulation
  useEffect(() => {
    if (isRoundOver) return;

    const botGuesses = ['un coche?', 'tacos?', 'guitarra?', 'un perro?', 'un taco', 'será una flor?'];
    const botTimeout = setTimeout(() => {
      const randomGuess = botGuesses[Math.floor(Math.random() * botGuesses.length)];
      setChatGuesses((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          senderName: 'El_Compa_Bélico',
          text: randomGuess,
        },
      ]);
      playSound('pop');
    }, 7000);

    return () => clearTimeout(botTimeout);
  }, [timeLeft, isRoundOver]);

  const handleRoundTimeout = () => {
    setIsRoundOver(true);
    playSound('buzz');
    setChatGuesses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderName: 'Sistema WePlay',
        text: `⏰ ¡Tiempo agotado! La palabra secreta era: "${wordData.word}".`,
      },
    ]);
  };

  const handleCorrectGuess = (guesserName: string) => {
    setIsRoundOver(true);
    playSound('correct');
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

    // Update scores
    setScores((prev) => ({
      ...prev,
      [guesserName]: (prev[guesserName] || 0) + 100,
      [isMeDrawing ? currentUser.nickname : 'Valeria_CDMX']: (prev[isMeDrawing ? currentUser.nickname : 'Valeria_CDMX'] || 0) + 50,
    }));

    if (guesserName === currentUser.nickname) {
      setHasGuessedCorrectly(true);
      onRewardCoins(50);
    }

    setChatGuesses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderName: 'Sistema WePlay',
        text: `🎉 ¡CORRECTO! ${guesserName} adivinó la palabra: "${wordData.word}" (+100 PTS).`,
        isCorrect: true,
      },
    ]);
  };

  const handleSendGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGuess = myGuessInput.trim().toUpperCase();
    if (!cleanGuess) return;

    playSound('click');
    setChatGuesses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderName: currentUser.nickname,
        text: myGuessInput,
      },
    ]);
    setMyGuessInput('');

    // Check if guess matches secret word
    if (cleanGuess === wordData.word && !hasGuessedCorrectly && !isMeDrawing) {
      handleCorrectGuess(currentUser.nickname);
    }
  };

  // Canvas drawing handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isMeDrawing || isRoundOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isMeDrawing || isRoundOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#1A0B2E' : color;
    ctx.lineWidth = isEraser ? lineWidth * 2.5 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1A0B2E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playSound('pop');
  };

  const paletteColors = ['#FFFFFF', '#FF2E9D', '#FBBF24', '#38BDF8', '#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1A0B2E] text-white select-none animate-in fade-in">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2D1B4E] border-b border-purple-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF2E9D] flex items-center justify-center font-black shadow-lg">
            🎨
          </div>
          <div>
            <div className="font-heading font-extrabold text-sm flex items-center gap-2">
              <span>Draw & Guess WePlay</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-[10px] text-pink-300 font-bold">
                Ronda {round}/{maxRounds}
              </span>
            </div>
            <div className="text-xs text-purple-300">
              Dibujando:{' '}
              <span className="font-bold text-yellow-300">
                {isMeDrawing ? '¡Tú estás dibujando!' : 'Valeria_CDMX'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer countdown badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-sm border ${
              timeLeft <= 10
                ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse'
                : 'bg-purple-900/50 text-white border-purple-500/30'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Secret Word Display or Guess Mask */}
      <div className="bg-gradient-to-r from-[#2D1B4E] via-[#3A2A60] to-[#2D1B4E] px-4 py-2.5 flex items-center justify-between border-b border-purple-700/30 shadow-md">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-semibold text-purple-300">
            Categoría: <strong className="text-white">{wordData.category}</strong>
          </span>
        </div>

        <div className="text-center">
          {isMeDrawing ? (
            <div className="flex items-center gap-2 bg-[#FF2E9D]/20 px-3 py-1 rounded-xl border border-[#FF2E9D]/50">
              <span className="text-xs text-pink-300 font-bold">DIBUJA:</span>
              <span className="text-base font-black tracking-widest text-yellow-300 uppercase">
                {wordData.word}
              </span>
            </div>
          ) : (
            <div className="text-lg font-black tracking-[0.3em] text-yellow-300 font-mono">
              {maskedWord}
            </div>
          )}
        </div>

        <div className="text-[11px] text-gray-400 font-semibold">
          {wordData.word.length} letras
        </div>
      </div>

      {/* Main Game Stage: Whiteboard Canvas + Side Chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Canvas Stage */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-3 bg-[#130722]">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            className="w-full max-w-2xl h-auto aspect-[3/2] bg-[#1A0B2E] rounded-3xl border-2 border-purple-500/30 shadow-2xl touch-none cursor-crosshair"
          />

          {/* Canvas Controls Toolbar (Shown if user is drawer) */}
          {isMeDrawing && !isRoundOver && (
            <div className="mt-3 flex items-center gap-2 bg-[#2D1B4E]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-purple-500/30 shadow-lg">
              {/* Color pickers */}
              <div className="flex items-center gap-1.5">
                {paletteColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setIsEraser(false);
                      playSound('click');
                    }}
                    className={`w-6 h-6 rounded-full border transition ${
                      color === c && !isEraser ? 'scale-125 border-white shadow-md' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="h-5 w-[1px] bg-white/20 mx-1" />

              {/* Stroke width */}
              <input
                type="range"
                min="2"
                max="24"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-20 accent-[#FF2E9D] cursor-pointer"
              />

              {/* Eraser */}
              <button
                onClick={() => {
                  setIsEraser(!isEraser);
                  playSound('click');
                }}
                className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                  isEraser ? 'bg-[#FF2E9D] text-white border-[#FF2E9D]' : 'bg-white/5 border-white/10 text-gray-300'
                }`}
              >
                Borrador
              </button>

              {/* Clear */}
              <button
                onClick={handleClearCanvas}
                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Round Over Modal Banner */}
          {isRoundOver && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20 animate-in zoom-in-95">
              <Trophy className="w-14 h-14 text-yellow-400 animate-bounce mb-2" />
              <h3 className="font-heading font-black text-2xl text-white">¡Fin de la Ronda!</h3>
              <p className="text-sm text-purple-300 mt-1">
                La palabra secreta era:{' '}
                <strong className="text-yellow-300 text-lg uppercase tracking-wider">{wordData.word}</strong>
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    playSound('click');
                    if (round < maxRounds) {
                      startNewRound(round + 1, drawerIndex === 0 ? 1 : 0);
                    } else {
                      onClose();
                    }
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white font-black text-sm shadow-xl neon-glow-pink hover:opacity-95 transition"
                >
                  {round < maxRounds ? 'Siguiente Ronda ➔' : 'Volver a la Sala 🏆'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel: Scores & Chat Guesses */}
        <div className="w-full md:w-80 h-72 md:h-auto bg-[#251541] border-t md:border-t-0 md:border-left border-purple-800/40 flex flex-col">
          {/* Mini Scoreboard Header */}
          <div className="p-3 bg-[#1A0B2E]/70 border-b border-purple-800/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Tabla de Puntuación</span>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">Gana monedas</span>
          </div>

          {/* Scores list */}
          <div className="px-3 py-2 flex gap-3 overflow-x-auto border-b border-purple-800/20">
            {Object.entries(scores).map(([name, score], idx) => (
              <div
                key={name}
                className="flex items-center gap-1.5 bg-purple-950/40 px-2.5 py-1 rounded-xl border border-white/5 text-xs whitespace-nowrap"
              >
                <span className="font-extrabold text-yellow-400">#{idx + 1}</span>
                <span className="text-gray-300">{name}</span>
                <span className="font-black text-[#FF2E9D]">{score} pts</span>
              </div>
            ))}
          </div>

          {/* Chat / Guesses stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
            {chatGuesses.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-xl transition ${
                  msg.isCorrect
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200'
                    : msg.senderName === 'Sistema WePlay'
                    ? 'bg-purple-900/30 text-purple-300 font-semibold text-center text-[11px]'
                    : 'bg-white/5 text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[10px] opacity-80 mb-0.5">
                  <span className={msg.isCorrect ? 'text-emerald-400' : 'text-pink-300'}>
                    {msg.senderName}
                  </span>
                </div>
                <div className="break-words">{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Guess Input Form */}
          {!isMeDrawing && !isRoundOver && (
            <form onSubmit={handleSendGuess} className="p-2.5 bg-[#1A0B2E] border-t border-purple-800/40 flex gap-2">
              <input
                type="text"
                placeholder={hasGuessedCorrectly ? '¡Ya adivinaste! Espera la ronda' : 'Escribe tu respuesta...'}
                disabled={hasGuessedCorrectly}
                value={myGuessInput}
                onChange={(e) => setMyGuessInput(e.target.value)}
                className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#FF2E9D] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={hasGuessedCorrectly || !myGuessInput.trim()}
                className="p-2 rounded-xl bg-[#FF2E9D] hover:bg-pink-600 disabled:opacity-40 text-white font-bold transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
