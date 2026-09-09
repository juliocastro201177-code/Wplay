import React, { useState } from 'react';
import { X, Coins, Sparkles, Send, Plus } from 'lucide-react';
import { Gift, RoomSeat, User } from '../../types';
import { ALL_GIFTS } from '../../data/giftsData';
import { GiftSvgIcon } from './GiftSvgIcon';
import { playSound } from '../../utils/audio';

interface GiftSelectorModalProps {
  currentUser: User;
  roomSeats: RoomSeat[];
  onSendGift: (gift: Gift, targetName: string, count: number) => void;
  onOpenShop: () => void;
  onClose: () => void;
}

export const GiftSelectorModal: React.FC<GiftSelectorModalProps> = ({
  currentUser,
  roomSeats,
  onSendGift,
  onOpenShop,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedGift, setSelectedGift] = useState<Gift>(ALL_GIFTS[0]);
  const [selectedTargetUid, setSelectedTargetUid] = useState<string>(
    roomSeats.find((s) => s.user && s.user.uid !== currentUser.uid)?.user?.uid || 'toda_la_sala'
  );
  const [selectedCount, setSelectedCount] = useState<number>(1);

  const categories = [
    { id: 'todos', label: 'Todos (30)' },
    { id: 'belicos', label: 'Bélicos / Trocas 🚗' },
    { id: 'romanticos', label: 'Románticos 🌹' },
    { id: 'fiesta', label: 'Fiesta & Desmadre 🍾' },
    { id: 'ultra', label: 'Ultra Caros 👑' },
    { id: 'clasicos', label: 'Clásicos ✨' },
  ];

  const filteredGifts = ALL_GIFTS.filter((g) => {
    if (selectedCategory === 'todos') return true;
    return g.category === selectedCategory;
  });

  const multipliers = [1, 10, 66, 99, 520];

  const totalCost = selectedGift.price * selectedCount;
  const canAfford = currentUser.coins >= totalCost;

  const handleSend = () => {
    if (!canAfford) {
      playSound('buzz');
      onOpenShop();
      return;
    }

    const targetUser = roomSeats.find((s) => s.user && s.user.uid === selectedTargetUid)?.user;
    const targetName = targetUser ? targetUser.nickname : 'Toda la Sala WePlay';

    onSendGift(selectedGift, targetName, selectedCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border-t border-purple-500/40 rounded-t-3xl shadow-2xl p-4 flex flex-col max-h-[85vh]">
        {/* Top bar: Recipient selector & Coin balance */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
          {/* Target receiver picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 font-semibold">Para:</span>
            <select
              value={selectedTargetUid}
              onChange={(e) => setSelectedTargetUid(e.target.value)}
              className="bg-[#1A0B2E] border border-purple-600/40 text-xs font-bold text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#FF2E9D]"
            >
              <option value="toda_la_sala">🌟 Toda la Sala (A todos)</option>
              {roomSeats
                .filter((s) => s.user)
                .map((s) => (
                  <option key={s.user!.uid} value={s.user!.uid}>
                    {s.user!.nickname} {s.user!.uid === currentUser.uid ? '(Tú)' : ''}
                  </option>
                ))}
            </select>
          </div>

          {/* Coins & Top-up */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-yellow-500/30">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-black text-yellow-400">
                {currentUser.coins.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                onOpenShop();
              }}
              className="p-1 rounded-full bg-[#FF2E9D] hover:bg-pink-600 text-white transition shadow-sm"
              title="Recargar monedas"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Tab bar */}
        <div className="flex gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playSound('click');
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white shadow-md neon-glow-pink'
                  : 'bg-purple-950/40 text-purple-300 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gifts Grid (30 custom SVG assets) */}
        <div className="flex-1 overflow-y-auto py-2 grid grid-cols-4 gap-2.5">
          {filteredGifts.map((gift) => {
            const isSelected = selectedGift.id === gift.id;
            return (
              <button
                key={gift.id}
                onClick={() => {
                  playSound('click');
                  setSelectedGift(gift);
                }}
                className={`relative flex flex-col items-center p-2 rounded-2xl border transition group ${
                  isSelected
                    ? 'border-[#FF2E9D] bg-pink-500/20 shadow-lg scale-[1.02]'
                    : 'border-white/5 bg-purple-950/20 hover:border-white/20'
                }`}
              >
                {/* Full screen badge if applicable */}
                {gift.isFullScreen && (
                  <span className="absolute top-1 right-1 text-[8px] font-black bg-amber-500 text-black px-1 rounded-sm">
                    3D
                  </span>
                )}

                <div className="h-12 flex items-center justify-center group-hover:scale-110 transition">
                  <GiftSvgIcon iconType={gift.iconType} size={42} />
                </div>

                <div className="text-[11px] font-bold text-white text-center truncate w-full mt-1">
                  {gift.name}
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <Coins className="w-2.5 h-2.5 text-yellow-400" />
                  <span className="text-[10px] font-extrabold text-yellow-300">
                    {gift.price >= 1000 ? `${(gift.price / 1000).toFixed(0)}k` : gift.price}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions: Multipliers + Send Button */}
        <div className="pt-3 border-t border-purple-800/40 flex items-center justify-between gap-3">
          {/* Multiplier buttons */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
            {multipliers.map((m) => (
              <button
                key={m}
                onClick={() => {
                  playSound('click');
                  setSelectedCount(m);
                }}
                className={`px-2 py-1 rounded-xl text-xs font-black transition ${
                  selectedCount === m
                    ? 'bg-[#FF2E9D] text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                x{m}
              </button>
            ))}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className={`flex-1 py-3 px-4 rounded-2xl font-heading font-black text-xs flex items-center justify-center gap-2 shadow-xl transition ${
              canAfford
                ? 'bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-[#8B5CF6] text-white neon-glow-pink hover:opacity-95'
                : 'bg-yellow-600/80 hover:bg-yellow-500 text-white'
            }`}
          >
            {canAfford ? (
              <>
                <Send className="w-4 h-4" />
                <span>
                  Enviar {selectedGift.name} ({totalCost.toLocaleString()} 🪙)
                </span>
              </>
            ) : (
              <>
                <Coins className="w-4 h-4 text-yellow-300" />
                <span>Monedas insuficientes (Recargar)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
