import React, { useState } from 'react';
import { X, Coins, Crown, Sparkles, Check, Flame, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../../types';
import { playSound } from '../../utils/audio';

interface ShopModalProps {
  currentUser: User;
  onAddCoins: (amount: number) => void;
  onActivateVIP: () => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  currentUser,
  onAddCoins,
  onActivateVIP,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'monedas' | 'vip' | 'cosmeticos'>('monedas');

  const coinPackages = [
    { coins: 100, price: '$0.99 USD', bonus: '' },
    { coins: 500, price: '$4.99 USD', bonus: '+50 Extra' },
    { coins: 1200, price: '$9.99 USD', bonus: 'POPULAR 🔥', isPopular: true },
    { coins: 6500, price: '$49.99 USD', bonus: '+1,000 Monedas VIP' },
    { coins: 14000, price: '$99.99 USD', bonus: 'MEJOR VALOR 👑', isBest: true },
  ];

  const cosmeticItems = [
    { id: 'frame_gold', name: 'Marco Corona de Oro VIP', type: 'Marco', cost: 1200, duration: 'Permanente', icon: '👑' },
    { id: 'bubble_cyber', name: 'Burbuja Cyberpunk Neón', type: 'Burbuja Chat', cost: 600, duration: '30 días', icon: '💬' },
    { id: 'enter_heli', name: 'Entrada con Helicóptero Privado', type: 'Efecto Entrada', cost: 2500, duration: 'Permanente', icon: '🚁' },
    { id: 'tag_belico', name: 'Título: El Patrón del Server', type: 'Título', cost: 900, duration: 'Permanente', icon: '🔥' },
  ];

  const handleBuyCoins = (coins: number) => {
    playSound('coin');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    onAddCoins(coins);
  };

  const handleBuyVIP = () => {
    playSound('gift_huge');
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    onActivateVIP();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-800/40 bg-[#1A0B2E]/80">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <div>
              <h2 className="font-heading font-extrabold text-base text-white">Tienda & Recargas WePlay</h2>
              <p className="text-[10px] text-purple-300">Monedas, VIP Platino & Cosméticos Exclusivos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Current Balance Bar */}
        <div className="px-6 py-3 bg-purple-950/40 border-b border-purple-800/30 flex items-center justify-between">
          <span className="text-xs text-purple-300 font-semibold">Tu Saldo Actual:</span>
          <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full border border-yellow-500/40">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-black text-yellow-300">{currentUser.coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-800/40 px-4 bg-[#1A0B2E]/60">
          {[
            { id: 'monedas', label: 'Paquetes Monedas' },
            { id: 'vip', label: 'Pase VIP 2026' },
            { id: 'cosmeticos', label: 'Cosméticos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex-1 py-3 text-xs font-black transition relative ${
                activeTab === tab.id ? 'text-[#FF2E9D]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2E9D] shadow-[0_0_8px_#FF2E9D]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'monedas' && (
            <div className="space-y-2.5">
              {coinPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    pkg.isPopular
                      ? 'border-[#FF2E9D] bg-pink-500/10 shadow-lg'
                      : pkg.isBest
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg'
                      : 'border-white/10 bg-purple-950/20 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 font-black">
                      🪙
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-white text-sm">
                          {pkg.coins.toLocaleString()} Monedas
                        </span>
                        {pkg.bonus && (
                          <span className="text-[9px] font-black bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white px-2 py-0.5 rounded-full">
                            {pkg.bonus}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">Entrega inmediata en tu cuenta</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyCoins(pkg.coins)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white text-xs font-black shadow-md neon-glow-pink hover:opacity-95 transition"
                  >
                    {pkg.price}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'vip' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-600/30 via-yellow-600/20 to-purple-900/40 border-2 border-yellow-400/50 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-2.5 text-yellow-300 font-black text-lg">
                  <Crown className="w-6 h-6 text-yellow-400 animate-bounce" />
                  <span>Membresía VIP Mensual WePlay</span>
                </div>
                <p className="text-xs text-amber-200 mt-1">
                  El estatus más prestigioso de América Latina. Destaca en todas las salas de voz.
                </p>

                {/* VIP Perks List */}
                <div className="mt-4 space-y-2 text-xs text-white">
                  {[
                    'Marco de avatar dorado animado exclusivo',
                    'Efecto de entrada a sala con Helicóptero VIP 🚁',
                    'Nombre dorado brillante en chats y salas',
                    '20% de descuento en todos los 30 regalos virtuales',
                    '500 monedas gratis acreditadas cada día',
                    'Insignia VIP Platino permanente en tu perfil',
                  ].map((perk, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between pt-3 border-t border-yellow-400/30">
                  <div>
                    <span className="text-2xl font-black text-yellow-300">$9.99</span>
                    <span className="text-xs text-gray-300 ml-1">/ mes</span>
                  </div>

                  <button
                    onClick={handleBuyVIP}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs shadow-xl transition"
                  >
                    {currentUser.vip ? '¡VIP ACTIVO! Renovar' : 'Activar Membresía VIP 👑'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cosmeticos' && (
            <div className="space-y-3">
              {cosmeticItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-black text-white">{item.name}</div>
                      <div className="text-[10px] text-purple-300">
                        {item.type} • {item.duration}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (currentUser.coins >= item.cost) {
                        playSound('coin');
                        onAddCoins(-item.cost);
                      } else {
                        playSound('buzz');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-[#FF2E9D] text-white text-xs font-black flex items-center gap-1.5 transition border border-purple-500/30"
                  >
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span>{item.cost}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
