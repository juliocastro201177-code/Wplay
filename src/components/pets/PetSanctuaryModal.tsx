import React, { useState } from 'react';
import { X, Sparkles, Heart, Utensils, Zap, Shield, Trophy } from 'lucide-react';
import { User, PetConfig } from '../../types';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface PetSanctuaryModalProps {
  currentUser: User;
  onClose: () => void;
  onEquipPet: (pet: PetConfig) => void;
  onRewardCoins: (amount: number) => void;
}

const AVAILABLE_PETS: PetConfig[] = [
  {
    id: 'pet_cat',
    name: 'Michi Cósmico',
    species: 'cat',
    level: 3,
    exp: 420,
    maxExp: 800,
    hunger: 85,
    happiness: 90,
    color: 'from-pink-500 to-purple-600',
    avatarIcon: '🐱',
    skillName: 'Ronroneo Dorado (+5% monedas)',
    bonusCoinRate: 0.05,
  },
  {
    id: 'pet_dragon',
    name: 'Dragoncito de Fuego',
    species: 'dragon',
    level: 5,
    exp: 750,
    maxExp: 1200,
    hunger: 70,
    happiness: 95,
    color: 'from-amber-500 to-red-600',
    avatarIcon: '🐉',
    skillName: 'Aliento Ígneo VIP (+10% monedas)',
    bonusCoinRate: 0.10,
  },
  {
    id: 'pet_fox',
    name: 'Zorro Astral de 9 Colas',
    species: 'fox',
    level: 4,
    exp: 610,
    maxExp: 1000,
    hunger: 90,
    happiness: 88,
    color: 'from-indigo-500 to-violet-700',
    avatarIcon: '🦊',
    skillName: 'Ilusión Mística (+8% monedas)',
    bonusCoinRate: 0.08,
  },
  {
    id: 'pet_panda',
    name: 'Panda Gamer',
    species: 'panda',
    level: 2,
    exp: 290,
    maxExp: 600,
    hunger: 60,
    happiness: 80,
    color: 'from-emerald-500 to-teal-700',
    avatarIcon: '🐼',
    skillName: 'Bambú de la Suerte (+6% monedas)',
    bonusCoinRate: 0.06,
  },
  {
    id: 'pet_bunny',
    name: 'Conejito Estelar',
    species: 'bunny',
    level: 1,
    exp: 110,
    maxExp: 400,
    hunger: 95,
    happiness: 92,
    color: 'from-cyan-500 to-blue-600',
    avatarIcon: '🐰',
    skillName: 'Salto Lunar (+4% monedas)',
    bonusCoinRate: 0.04,
  },
];

export const PetSanctuaryModal: React.FC<PetSanctuaryModalProps> = ({
  currentUser,
  onClose,
  onEquipPet,
  onRewardCoins,
}) => {
  const [pets, setPets] = useState<PetConfig[]>(AVAILABLE_PETS);
  const [selectedPet, setSelectedPet] = useState<PetConfig>(currentUser.equippedPet || AVAILABLE_PETS[0]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleFeed = () => {
    playSound('pop');
    setSelectedPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 15),
      happiness: Math.min(100, prev.happiness + 5),
      exp: prev.exp + 40,
    }));
    setActionFeedback('🍓 ¡Comió bayas de maná! Hambre +15%, EXP +40');
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handlePet = () => {
    playSound('romance');
    confetti({ particleCount: 40, spread: 50 });
    setSelectedPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      exp: prev.exp + 25,
    }));
    setActionFeedback('💖 ¡Ronroneo cariñoso! Felicidad +10%');
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handlePlayTrick = () => {
    playSound('horn');
    setSelectedPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      hunger: Math.max(0, prev.hunger - 8),
      exp: prev.exp + 60,
    }));
    setActionFeedback('⚽ ¡Hizo una voltereta cósmica! EXP +60');
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleEquip = () => {
    playSound('win');
    confetti({ particleCount: 80, spread: 70 });
    onEquipPet(selectedPet);
    setActionFeedback(`🐾 ¡${selectedPet.name} te acompañará en tu asiento de voz!`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#160627] border-2 border-pink-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-900/50 via-purple-900/50 to-indigo-900/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
              🐾
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Santuario de Mascotas WePlay</h2>
              <p className="text-[10px] text-pink-200">Adopta, cuida y llévalas a tu asiento en salas de voz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Pet Stage */}
        <div className="p-4 flex flex-col items-center">
          {/* Pet Showcase */}
          <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-b from-purple-800/20 to-black/40 border border-white/10 flex flex-col items-center justify-center shadow-inner overflow-hidden">
            {/* Background Halo */}
            <div className="absolute w-32 h-32 rounded-full bg-pink-500/10 blur-xl animate-pulse" />

            <div className="text-7xl filter drop-shadow-2xl animate-bounce hover:scale-110 transition cursor-pointer" onClick={handlePet}>
              {selectedPet.avatarIcon}
            </div>

            <div className="mt-2 text-center z-10">
              <span className="text-xs font-black text-white">{selectedPet.name}</span>
              <span className="text-[9px] text-pink-300 block">Nivel {selectedPet.level} • {selectedPet.species.toUpperCase()}</span>
            </div>

            {actionFeedback && (
              <div className="absolute inset-x-2 bottom-2 bg-black/80 backdrop-blur border border-pink-400 text-pink-200 text-[10px] font-bold p-1 rounded-xl text-center z-20 animate-fade-in">
                {actionFeedback}
              </div>
            )}
          </div>

          {/* Stats Bars */}
          <div className="w-full mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-pink-200 mb-0.5">
                <span>Hambre / Energía</span>
                <span>{selectedPet.hunger}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all"
                  style={{ width: `${selectedPet.hunger}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-pink-200 mb-0.5">
                <span>Felicidad / Amor</span>
                <span>{selectedPet.happiness}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all"
                  style={{ width: `${selectedPet.happiness}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-400/20 flex items-center justify-between text-[10px]">
              <span className="text-purple-300 font-bold">Habilidad Pasiva:</span>
              <span className="text-amber-300 font-black">{selectedPet.skillName}</span>
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="grid grid-cols-3 gap-2 w-full mt-3">
            <button
              onClick={handleFeed}
              className="py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-black text-xs flex flex-col items-center gap-0.5 shadow hover:scale-102 active:scale-95 transition"
            >
              <Utensils size={14} />
              <span>Alimentar</span>
            </button>
            <button
              onClick={handlePet}
              className="py-2 px-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs flex flex-col items-center gap-0.5 shadow hover:scale-102 active:scale-95 transition"
            >
              <Heart size={14} />
              <span>Acariciar</span>
            </button>
            <button
              onClick={handlePlayTrick}
              className="py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs flex flex-col items-center gap-0.5 shadow hover:scale-102 active:scale-95 transition"
            >
              <Zap size={14} />
              <span>Entrenar</span>
            </button>
          </div>

          {/* Equip Button */}
          <button
            onClick={handleEquip}
            className="w-full mt-3 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <span>🐾</span>
            <span>Equipar {selectedPet.name} para Sala de Voz</span>
          </button>
        </div>

        {/* Pet Carousel Selector */}
        <div className="p-3 border-t border-white/10 bg-black/30">
          <span className="text-[10px] font-bold text-purple-300 block mb-2">Tus Mascotas Adoptadas:</span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {pets.map(pet => (
              <button
                key={pet.id}
                onClick={() => {
                  playSound('click');
                  setSelectedPet(pet);
                }}
                className={`p-2 rounded-2xl border flex flex-col items-center gap-1 min-w-[75px] transition ${
                  selectedPet.id === pet.id
                    ? 'bg-purple-600/40 border-pink-400 scale-105'
                    : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-2xl">{pet.avatarIcon}</span>
                <span className="text-[9px] font-black text-white truncate w-full text-center">{pet.name}</span>
                <span className="text-[8px] text-pink-300">Nv. {pet.level}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
