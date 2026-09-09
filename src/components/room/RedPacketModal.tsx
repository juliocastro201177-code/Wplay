import React, { useState } from 'react';
import { X, Sparkles, Gift, Flame } from 'lucide-react';
import { User } from '../../types';
import { playSound } from '../../utils/audio';

interface RedPacketModalProps {
  currentUser: User;
  onClose: () => void;
  onSendRedPacket: (totalCoins: number, packetsCount: number) => void;
}

const AMOUNTS = [500, 1000, 2500, 5000];

export const RedPacketModal: React.FC<RedPacketModalProps> = ({
  currentUser,
  onClose,
  onSendRedPacket,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [packetCount, setPacketCount] = useState<number>(5);

  const handleSend = () => {
    if (currentUser.coins < selectedAmount) {
      playSound('buzz');
      return;
    }
    playSound('gift_huge');
    onSendRedPacket(selectedAmount, packetCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#1A051D] border-2 border-red-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 mx-auto flex items-center justify-center text-3xl shadow-lg border-2 border-yellow-100">
            🧧
          </div>
          <h3 className="text-base font-black text-white mt-2">Lluvia de Monedas WePlay</h3>
          <p className="text-[11px] text-amber-200">Envía un Sobre Rojo de la Suerte a toda la sala</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-red-300 uppercase tracking-wider block mb-2">
              Monto total de monedas 🪙
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    playSound('click');
                  }}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs transition border flex items-center justify-center gap-1.5 ${
                    selectedAmount === amount
                      ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white border-amber-300 shadow-md scale-102'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <span>🪙</span>
                  <span>{amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-red-300 uppercase tracking-wider block mb-2">
              Número de sobres a repartir
            </label>
            <div className="flex gap-2">
              {[3, 5, 8, 10].map(count => (
                <button
                  key={count}
                  onClick={() => {
                    setPacketCount(count);
                    playSound('click');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    packetCount === count
                      ? 'bg-red-600 text-white border-red-400'
                      : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  {count} Sobres
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-purple-300">Tus monedas disponibles:</span>
            <span className="font-black text-amber-300 flex items-center gap-1">
              🪙 {currentUser.coins.toLocaleString()}
            </span>
          </div>

          <button
            disabled={currentUser.coins < selectedAmount}
            onClick={handleSend}
            className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
              currentUser.coins >= selectedAmount
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white hover:brightness-110 active:scale-98 cursor-pointer'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>🧧</span>
            <span>¡Lanzar Sobre Rojo ({selectedAmount} 🪙)!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
