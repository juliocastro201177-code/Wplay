import React, { useState } from 'react';
import { X, Heart, Sparkles, Droplets, Gift, Award, Crown } from 'lucide-react';
import { User, CoupleRecord, WeddingCertificate } from '../../types';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface WeddingAltarModalProps {
  currentUser: User;
  activeCouple?: CoupleRecord | null;
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
}

const WEDDING_RINGS = [
  { id: 'ring_silver', name: 'Alianza de Plata Estelar', tier: 'silver' as const, price: 1000, icon: '💍', desc: '+10% Intimidad de Pareja' },
  { id: 'ring_ruby', name: 'Anillo de Rubí Pasión', tier: 'ruby' as const, price: 2500, icon: '💖', desc: '+25% Intimidad & Efecto de Pétalos' },
  { id: 'ring_diamond', name: 'Corona de Diamante Eterno', tier: 'eternal_diamond' as const, price: 5000, icon: '👑', desc: 'Boda con anuncio global en servidor' },
];

export const WeddingAltarModal: React.FC<WeddingAltarModalProps> = ({
  currentUser,
  activeCouple,
  onClose,
  onRewardCoins,
}) => {
  const [activeTab, setActiveTab] = useState<'altar' | 'tree' | 'certificate'>('altar');
  const [hasWateredToday, setHasWateredToday] = useState(false);
  const [treeExp, setTreeExp] = useState(340);
  const treeLevel = Math.floor(treeExp / 200) + 1;
  const [selectedRing, setSelectedRing] = useState(WEDDING_RINGS[1]);
  const [weddingCelebrated, setWeddingCelebrated] = useState(false);

  const spouseName = activeCouple ? activeCouple.user2Name : 'Valeria_CDMX';

  const handleWaterTree = () => {
    if (hasWateredToday) return;
    playSound('island');
    confetti({ particleCount: 60, spread: 70 });
    setHasWateredToday(true);
    setTreeExp(prev => prev + 80);
    onRewardCoins(200);
  };

  const handleCelebrateWedding = () => {
    if (currentUser.coins < selectedRing.price) {
      playSound('buzz');
      return;
    }
    playSound('romance');
    playSound('win');
    confetti({ particleCount: 150, spread: 100 });
    setWeddingCelebrated(true);
    setActiveTab('certificate');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#19041A] border-2 border-rose-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-900/60 via-pink-900/60 to-purple-900/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-xl shadow-lg border border-pink-300">
              💒
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Altar de Bodas & Árbol del Amor WePlay</h2>
              <p className="text-[10px] text-pink-200">Consagra tu relación CP, riega el árbol y obtén anillos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-[#250727] p-1 gap-1">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('altar');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'altar' ? 'bg-rose-600 text-white shadow' : 'text-pink-300 hover:text-white'
            }`}
          >
            <span>💍</span>
            <span>Boda y Anillos</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('tree');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'tree' ? 'bg-rose-600 text-white shadow' : 'text-pink-300 hover:text-white'
            }`}
          >
            <span>🌳</span>
            <span>Árbol del Amor</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('certificate');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'certificate' ? 'bg-rose-600 text-white shadow' : 'text-pink-300 hover:text-white'
            }`}
          >
            <span>📜</span>
            <span>Certificado CP</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ALTAR Y ANILLOS */}
          {activeTab === 'altar' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-rose-400/40 text-center relative overflow-hidden">
                <div className="text-4xl animate-pulse">👰🤵</div>
                <h3 className="text-sm font-black text-white mt-1">
                  {currentUser.nickname} & {spouseName}
                </h3>
                <p className="text-[11px] text-pink-200">
                  Selecciona la alianza sagrada para oficializar los votos nupciales en WePlay
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block mb-2">
                  Seleccionar Anillo de Boda:
                </label>
                <div className="space-y-2">
                  {WEDDING_RINGS.map(ring => (
                    <div
                      key={ring.id}
                      onClick={() => {
                        playSound('click');
                        setSelectedRing(ring);
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        selectedRing.id === ring.id
                          ? 'bg-rose-900/40 border-rose-400 shadow-md scale-101'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{ring.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-white">{ring.name}</h4>
                          <span className="text-[10px] text-pink-200">{ring.desc}</span>
                        </div>
                      </div>
                      <span className="font-black text-xs text-amber-300">🪙 {ring.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCelebrateWedding}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>🔔</span>
                <span>¡Celebrar Boda WePlay con {spouseName}!</span>
              </button>
            </div>
          )}

          {/* TAB 2: LOVE TREE */}
          {activeTab === 'tree' && (
            <div className="space-y-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-b from-rose-950/40 to-black/50 border border-rose-500/30 flex flex-col items-center justify-center shadow-inner">
                <div className="text-6xl animate-bounce">🌸</div>
                <h4 className="text-xs font-black text-white mt-2">Cerezo de Cristal</h4>
                <span className="text-[10px] text-rose-300">Nivel de Florecimiento: {treeLevel}</span>
              </div>

              <div className="w-full space-y-1 text-left">
                <div className="flex justify-between text-[10px] font-bold text-pink-200">
                  <span>Nutrientes del Amor</span>
                  <span>{treeExp % 200} / 200 EXP para el siguiente fruto</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all"
                    style={{ width: `${((treeExp % 200) / 200) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 w-full text-left">
                <h5 className="text-[11px] font-bold text-pink-300">Riego Diario en Pareja</h5>
                <p className="text-[10px] text-pink-100">
                  Rieguen el árbol juntos cada día para cosechar frutos de monedas y bendiciones de intimidad.
                </p>
              </div>

              <button
                disabled={hasWateredToday}
                onClick={handleWaterTree}
                className={`w-full py-3 rounded-2xl font-black text-xs uppercase transition flex items-center justify-center gap-2 ${
                  !hasWateredToday
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white hover:scale-102 active:scale-95 shadow-lg cursor-pointer'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Droplets size={16} />
                <span>{hasWateredToday ? '✓ Árbol Regado Hoy (+200 🪙)' : 'Regar Árbol del Amor (+200 🪙)'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#2B0A26] to-[#160416] border-2 border-amber-400/60 shadow-2xl relative text-center space-y-3">
              <div className="absolute top-3 right-3 text-2xl">📜</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 mx-auto flex items-center justify-center text-xl shadow-lg">
                💍
              </div>
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">
                Certificado Oficial de Amor WePlay
              </h3>
              <p className="text-[10px] text-pink-200 italic">
                "Bajo el cielo estrellado de las salas de voz y ante la comunidad de WePlay LATAM"
              </p>

              <div className="py-3 border-y border-amber-400/20 flex items-center justify-center gap-6">
                <div>
                  <span className="text-[9px] text-pink-300 block">Amante</span>
                  <span className="text-xs font-black text-white">{currentUser.nickname}</span>
                </div>
                <div className="text-lg text-rose-400">❤️</div>
                <div>
                  <span className="text-[9px] text-pink-300 block">Compañero(a)</span>
                  <span className="text-xs font-black text-white">{spouseName}</span>
                </div>
              </div>

              <div className="text-[10px] text-amber-200">
                Alianza consagrada: <span className="font-bold">{selectedRing.name} {selectedRing.icon}</span>
              </div>

              <div className="pt-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-[9px] uppercase tracking-wider">
                  Sello Dorado Oficial WePlay #CP-8842
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
