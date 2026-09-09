import React, { useState } from 'react';
import { X, Sparkles, Lock, Users, Gamepad2, Heart, Flame, Music } from 'lucide-react';
import { Room, RoomCategory, User } from '../../types';
import { playSound } from '../../utils/audio';

interface CreateRoomModalProps {
  currentUser: User;
  onCreateRoom: (newRoom: Room) => void;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  currentUser,
  onCreateRoom,
  onClose,
}) => {
  const [name, setName] = useState('Puro Desmadre LATAM 🔥');
  const [category, setCategory] = useState<RoomCategory>('friends');
  const [tag, setTag] = useState('#Bélico');
  const [seatCount, setSeatCount] = useState<number>(8);
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState('');

  const themes = [
    { id: 'friends' as RoomCategory, label: 'Amigos & Party', icon: '🎉' },
    { id: 'dating' as RoomCategory, label: 'Citas & Parejas', icon: '💘' },
    { id: 'gaming' as RoomCategory, label: 'Party Games', icon: '🎮' },
    { id: 'karaoke' as RoomCategory, label: 'Karaoke & Rola', icon: '🎤' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSound('coin');
    const newRoom: Room = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      name: name.trim(),
      category,
      tag: tag.startsWith('#') ? tag : `#${tag}`,
      hostUid: currentUser.uid,
      hostName: currentUser.nickname,
      hostAvatar: currentUser.avatarUrl,
      membersCount: 1,
      maxSeats: seatCount,
      seats: [
        {
          index: 0,
          user: currentUser,
          isMuted: false,
          isSpeaking: false,
        },
      ],
      isLocked,
      password: isLocked ? password : undefined,
    };

    onCreateRoom(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF2E9D]" />
            <h2 className="font-heading font-black text-lg text-white">Crear Nueva Sala WePlay</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 mt-4">
          {/* Room Name */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Nombre de la Sala</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sala de Chisme & Tacos..."
              className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E9D]"
            />
          </div>

          {/* Theme Category */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Tema / Categoría</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    playSound('click');
                    setCategory(t.id);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                    category === t.id
                      ? 'border-[#FF2E9D] bg-pink-500/20 text-white'
                      : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag & Seats */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Etiqueta</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="#Bélico"
                className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2E9D]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Asientos de Voz</label>
              <div className="flex gap-2">
                {[4, 8].map((seats) => (
                  <button
                    type="button"
                    key={seats}
                    onClick={() => setSeatCount(seats)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${
                      seatCount === seats
                        ? 'border-[#FF2E9D] bg-pink-500/20 text-white'
                        : 'border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {seats} Asientos
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Password Protection */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Sala Privada con Contraseña
              </span>
              <input
                type="checkbox"
                checked={isLocked}
                onChange={(e) => setIsLocked(e.target.checked)}
                className="accent-[#FF2E9D] cursor-pointer"
              />
            </div>
            {isLocked && (
              <input
                type="password"
                placeholder="Ingresa clave de acceso..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2E9D]"
              />
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-[#8B5CF6] text-white font-heading font-black text-sm shadow-xl neon-glow-pink hover:opacity-95 transition"
            >
              🚀 Abrir Sala WePlay Ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
