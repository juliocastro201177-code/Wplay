import React, { useState } from 'react';
import { X, Sparkles, Trophy, Award, Gift, Check, Flame, Star, Crown, Shield } from 'lucide-react';
import { User, DailyMission, BattlePassTier } from '../../types';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface BattlePassModalProps {
  currentUser: User;
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
  onEquipTitle?: (title: string) => void;
  onUnlockElitePass?: () => void;
}

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Voz Activa en Sala',
    description: 'Permanece en un asiento de voz al menos 3 minutos',
    progress: 3,
    target: 3,
    rewardCoins: 300,
    rewardPassExp: 150,
    isCompleted: true,
    isClaimed: false,
    icon: '🎙️',
    type: 'room_talk',
  },
  {
    id: 'm2',
    title: 'Generosidad WePlay',
    description: 'Envía 1 regalo animado a cualquier amigo en sala',
    progress: 1,
    target: 1,
    rewardCoins: 500,
    rewardPassExp: 200,
    isCompleted: true,
    isClaimed: false,
    icon: '🎁',
    type: 'send_gift',
  },
  {
    id: 'm3',
    title: 'Duelo de Juegos',
    description: 'Juega 1 partida de Ludo, Espía o Pasa la Bomba',
    progress: 1,
    target: 1,
    rewardCoins: 400,
    rewardPassExp: 180,
    isCompleted: true,
    isClaimed: false,
    icon: '🎲',
    type: 'play_game',
  },
  {
    id: 'm4',
    title: 'Bromista de Asiento',
    description: 'Lanza 1 tomatazo o chanclazo a alguien en la sala',
    progress: 2,
    target: 2,
    rewardCoins: 250,
    rewardPassExp: 120,
    isCompleted: true,
    isClaimed: false,
    icon: '🍅',
    type: 'throw_item',
  },
  {
    id: 'm5',
    title: 'Círculo Social',
    description: 'Escribe 5 mensajes en el chat de la fiesta',
    progress: 5,
    target: 5,
    rewardCoins: 200,
    rewardPassExp: 100,
    isCompleted: true,
    isClaimed: false,
    icon: '💬',
    type: 'chat_message',
  },
  {
    id: 'm6',
    title: 'Giro de la Suerte',
    description: 'Prueba tu suerte en la Ruleta Diaria WePlay',
    progress: 1,
    target: 1,
    rewardCoins: 350,
    rewardPassExp: 150,
    isCompleted: true,
    isClaimed: false,
    icon: '🎡',
    type: 'wheel_spin',
  },
];

const PASS_TIERS: BattlePassTier[] = [
  { tier: 1, requiredExp: 100, freeReward: { name: '250 Monedas', icon: '🪙', count: 250, type: 'coins' }, eliteReward: { name: 'Título: Novato VIP', icon: '🎖️', type: 'title' } },
  { tier: 2, requiredExp: 250, freeReward: { name: 'Marco Bronce', icon: '🥉', type: 'badge' }, eliteReward: { name: 'Burbuja Neón Rosa', icon: '💬', type: 'bubble' } },
  { tier: 3, requiredExp: 450, freeReward: { name: '500 Monedas', icon: '🪙', count: 500, type: 'coins' }, eliteReward: { name: 'Marco Alas Doradas', icon: '🪽', type: 'frame' } },
  { tier: 4, requiredExp: 700, freeReward: { name: '5 Diamantes', icon: '💎', count: 5, type: 'diamonds' }, eliteReward: { name: 'Título: Voz de Oro 🎵', icon: '🎤', type: 'title' } },
  { tier: 5, requiredExp: 1000, freeReward: { name: '1,000 Monedas', icon: '🪙', count: 1000, type: 'coins' }, eliteReward: { name: 'Montura: Pegaso VIP', icon: '🦄', type: 'mount' } },
  { tier: 6, requiredExp: 1350, freeReward: { name: 'Marco Estrella', icon: '⭐', type: 'frame' }, eliteReward: { name: 'Título: Rey de la Fiesta 👑', icon: '👑', type: 'title' } },
  { tier: 7, requiredExp: 1750, freeReward: { name: '1,500 Monedas', icon: '🪙', count: 1500, type: 'coins' }, eliteReward: { name: 'Montura: Dragón Cósmico 🐉', icon: '🐉', type: 'mount' } },
];

const HONOR_TITLES = [
  { id: 't_king', name: '👑 Rey de la Fiesta', desc: 'Desbloqueado por animar salas de voz', color: 'from-amber-400 to-yellow-500' },
  { id: 't_voice', name: '🎵 Voz de Oro', desc: 'Premio por talento en Karaoke', color: 'from-purple-400 to-pink-500' },
  { id: 't_spy', name: '🕵️ Espía Maestro', desc: '10 victorias sin ser descubierto', color: 'from-emerald-400 to-teal-500' },
  { id: 't_ludo', name: '🎲 Emperador del Ludo', desc: 'Racha de 5 victorias consecutivas', color: 'from-blue-400 to-indigo-500' },
  { id: 't_heart', name: '💘 Rompecorazones', desc: 'Más de 100 flores recibidas', color: 'from-rose-400 to-red-500' },
  { id: 't_tycoon', name: '💎 Magnate WePlay', desc: 'Lanza sobres rojos masivos', color: 'from-yellow-300 to-amber-600' },
];

export const BattlePassModal: React.FC<BattlePassModalProps> = ({
  currentUser,
  onClose,
  onRewardCoins,
  onEquipTitle,
  onUnlockElitePass,
}) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'pass' | 'titles'>('missions');
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [isElite, setIsElite] = useState(currentUser.battlePassElite || false);
  const [currentExp, setCurrentExp] = useState(currentUser.battlePassExp || 480);
  const currentTier = currentUser.battlePassTier || 3;
  const [equippedTitle, setEquippedTitle] = useState(currentUser.equippedTitle || '👑 Rey de la Fiesta');

  const handleClaimMission = (mission: DailyMission) => {
    if (!mission.isCompleted || mission.isClaimed) return;
    playSound('win');
    confetti({ particleCount: 50, spread: 60 });
    onRewardCoins(mission.rewardCoins);
    setCurrentExp(prev => prev + mission.rewardPassExp);

    setMissions(prev =>
      prev.map(m => (m.id === mission.id ? { ...m, isClaimed: true } : m))
    );
  };

  const handleClaimAll = () => {
    const claimable = missions.filter(m => m.isCompleted && !m.isClaimed);
    if (claimable.length === 0) return;
    playSound('gift_huge');
    confetti({ particleCount: 100, spread: 80 });
    const totalCoins = claimable.reduce((acc, curr) => acc + curr.rewardCoins, 0);
    const totalExp = claimable.reduce((acc, curr) => acc + curr.rewardPassExp, 0);

    onRewardCoins(totalCoins);
    setCurrentExp(prev => prev + totalExp);

    setMissions(prev =>
      prev.map(m => (m.isCompleted ? { ...m, isClaimed: true } : m))
    );
  };

  const handleActivateElite = () => {
    if (currentUser.coins < 1500 && currentUser.diamonds < 10) {
      playSound('buzz');
      return;
    }
    playSound('win');
    confetti({ particleCount: 150, spread: 90 });
    setIsElite(true);
    if (onUnlockElitePass) onUnlockElitePass();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#170828] border-2 border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="relative p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-lg border border-amber-300">
              🎖️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-white">Centro de Misiones & Pase WePlay</h2>
                {isElite && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                    ÉLITE VIP
                  </span>
                )}
              </div>
              <p className="text-[10px] text-purple-200">Completa desafíos, desbloquea títulos y gana oro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#210B3B] p-1 gap-1">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('missions');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'missions'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📜</span>
            <span>Misiones Diarias</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('pass');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pass'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏆</span>
            <span>Pase de Temporada</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('titles');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'titles'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👑</span>
            <span>Títulos de Honor</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* TAB 1: MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              {/* Header Action Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-400/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-300">Recompensas de Hoy</span>
                  <p className="text-xs font-black text-white">
                    {missions.filter(m => m.isClaimed).length} de {missions.length} reclamadas
                  </p>
                </div>
                <button
                  onClick={handleClaimAll}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
                >
                  Reclamar Todo 🪙
                </button>
              </div>

              {/* Missions List */}
              <div className="space-y-2">
                {missions.map(mission => (
                  <div
                    key={mission.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:bg-white/8 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-xl shrink-0">
                        {mission.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          {mission.title}
                          <span className="text-[10px] text-amber-300 font-bold">
                            +{mission.rewardCoins} 🪙 | +{mission.rewardPassExp} XP
                          </span>
                        </h4>
                        <p className="text-[10px] text-purple-200">{mission.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1.5 rounded-full bg-black/40 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                              style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-purple-300 font-bold">
                            {mission.progress}/{mission.target}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {mission.isClaimed ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                          <Check size={12} /> Listo
                        </span>
                      ) : mission.isCompleted ? (
                        <button
                          onClick={() => handleClaimMission(mission)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-[11px] shadow hover:scale-105 active:scale-95 transition"
                        >
                          Reclamar
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-purple-300 text-[10px] font-bold">
                          En progreso
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BATTLE PASS */}
          {activeTab === 'pass' && (
            <div className="space-y-4">
              {/* Season Pass Banner */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-r from-amber-600/30 via-purple-700/40 to-pink-600/40 border border-amber-400/50 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider">
                    Temporada 1: Noche de Fiesta Estelar
                  </span>
                  <h3 className="text-base font-black text-white">Nivel del Pase: Tier {currentTier}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-36 h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
                        style={{ width: `${Math.min(100, (currentExp / 1000) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-amber-200">{currentExp} / 1000 XP</span>
                  </div>
                </div>

                {!isElite ? (
                  <button
                    onClick={handleActivateElite}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition flex flex-col items-center leading-tight"
                  >
                    <span>👑 ACTIVAR ÉLITE</span>
                    <span className="text-[9px] font-bold">1,500 🪙 o 10 💎</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-xs flex items-center gap-1">
                    <Crown size={14} /> Élite Activo
                  </div>
                )}
              </div>

              {/* Tiers Road */}
              <div className="space-y-2">
                {PASS_TIERS.map(tier => (
                  <div
                    key={tier.tier}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-2 ${
                      tier.tier <= currentTier
                        ? 'bg-purple-900/30 border-purple-500/50'
                        : 'bg-white/5 border-white/5 opacity-85'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-700/60 border border-purple-400/40 flex items-center justify-center font-black text-xs text-white">
                        {tier.tier}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-purple-300">
                          Requiere {tier.requiredExp} XP
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-white font-bold flex items-center gap-1">
                            {tier.freeReward.icon} {tier.freeReward.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 px-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-right">
                        <span className="text-[8px] text-amber-300 uppercase font-black block">Premio Élite</span>
                        <span className="text-xs font-black text-amber-200 flex items-center gap-1">
                          {tier.eliteReward.icon} {tier.eliteReward.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HONOR TITLES */}
          {activeTab === 'titles' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-300 block">Título actualmente equipado:</span>
                  <span className="text-sm font-black text-amber-300">{equippedTitle}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600/40 text-purple-200 border border-purple-400/30 font-bold">
                  Visible en sala
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HONOR_TITLES.map(title => (
                  <div
                    key={title.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-black text-white">{title.name}</h4>
                      <p className="text-[10px] text-purple-300 mt-0.5">{title.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        playSound('click');
                        setEquippedTitle(title.name);
                        if (onEquipTitle) onEquipTitle(title.name);
                      }}
                      className={`mt-2 py-1.5 rounded-xl font-bold text-xs transition ${
                        equippedTitle === title.name
                          ? 'bg-amber-400 text-black font-black'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {equippedTitle === title.name ? '✓ Equipado' : 'Equipar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
