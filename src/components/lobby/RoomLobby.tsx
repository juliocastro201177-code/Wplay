import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Search, 
  Plus, 
  Volume2, 
  Gamepad2, 
  Heart, 
  Music, 
  Sparkles, 
  Crown,
  Trophy
} from 'lucide-react';
import { Room, RoomCategory, User } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { playSound } from '../../utils/audio';

interface RoomLobbyProps {
  currentUser: User;
  rooms: Room[];
  onJoinRoom: (room: Room) => void;
  onCreateRoomClick: () => void;
  onOpenShop: () => void;
  onOpenMyProfile: () => void;
  onOpenDrawAndGuessQuick: () => void;
  onOpenCoupleIsland?: () => void;
  onOpenClanModal?: () => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  currentUser,
  rooms,
  onJoinRoom,
  onCreateRoomClick,
  onOpenShop,
  onOpenMyProfile,
  onOpenDrawAndGuessQuick,
  onOpenCoupleIsland,
  onOpenClanModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: '🔥 Destacadas', icon: Flame },
    { id: 'friends', label: '🎉 Amigos & Desmadre', icon: Users },
    { id: 'dating', label: '💘 Citas & Parejas', icon: Heart },
    { id: 'gaming', label: '🎮 Party Games', icon: Gamepad2 },
    { id: 'karaoke', label: '🎤 Música / Karaoke', icon: Music },
  ];

  const filteredRooms = rooms.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden select-none bg-[#1A0B2E]">
      {/* Top Banner Event Carousel */}
      <div className="p-4 pb-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 p-4 text-white shadow-2xl border border-white/20">
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="flex items-center gap-1.5 text-xs font-black text-yellow-300">
                <Trophy className="w-4 h-4" />
                <span>TORNEO OFICIAL DRAW & GUESS 2026</span>
              </div>
              <h2 className="font-heading font-black text-lg sm:text-xl mt-1 leading-tight">
                ¡Gana 100,000 Monedas y Troca Buchona!
              </h2>
              <p className="text-[11px] text-pink-200 mt-1">
                Participa hoy gratis en salas oficiales con chat de voz en tiempo real.
              </p>
              <button
                onClick={() => {
                  playSound('pop');
                  onOpenDrawAndGuessQuick();
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-yellow-400 text-black font-heading font-black text-xs shadow-lg hover:bg-yellow-300 transition"
              >
                Jugar Ahora ➔
              </button>
            </div>

            <div className="text-4xl sm:text-5xl animate-bounce">
              🎨
            </div>
          </div>
        </div>

        {/* Quick Features Row: Isla de Parejas & Familias Clanes */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          {/* Isla de Parejas Feature Card */}
          <div
            onClick={() => {
              playSound('romance');
              if (onOpenCoupleIsland) onOpenCoupleIsland();
            }}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#3B0E42] via-[#240A36] to-[#120422] border border-pink-500/40 shadow-lg cursor-pointer hover:border-pink-400 transition flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF2E9D] to-amber-400 flex items-center justify-center text-base shadow-md group-hover:scale-105 transition shrink-0">
              🏝️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-heading font-black text-[11px] text-white truncate">Isla Parejas</span>
              </div>
              <p className="text-[9px] text-purple-200 truncate">30 min de voz</p>
            </div>
          </div>

          {/* Familias WePlay Card */}
          <div
            onClick={() => {
              playSound('click');
              if (onOpenClanModal) onOpenClanModal();
            }}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#2B1038] via-[#1D0B2E] to-[#120422] border border-amber-500/40 shadow-lg cursor-pointer hover:border-amber-400 transition flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-base shadow-md group-hover:scale-105 transition shrink-0">
              🛡️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-heading font-black text-[11px] text-white truncate">Familias</span>
                <span className="px-1 py-0.2 rounded-full bg-amber-500/20 text-yellow-300 text-[8px] font-black">TOP</span>
              </div>
              <p className="text-[9px] text-purple-200 truncate">Clanes & Salas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Quick Categories */}
      <div className="px-4 py-2 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Buscar sala, ID o amigo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#25133E] border border-purple-600/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-[#FF2E9D] transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white shadow-lg neon-glow-pink'
                    : 'bg-[#25133E] text-purple-300 hover:bg-purple-900/40 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-sm text-white">Salas en Vivo WePlay</h3>
            <span className="text-[10px] text-pink-400 font-bold bg-pink-500/15 px-2 py-0.5 rounded-full">
              {filteredRooms.length} activas
            </span>
          </div>
          <span className="text-[11px] text-purple-300 font-semibold">Voz HD Agora</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
          {filteredRooms.map((r) => (
            <div
              key={r.id}
              onClick={() => {
                playSound('click');
                onJoinRoom(r);
              }}
              className="cursor-pointer group relative rounded-3xl bg-gradient-to-b from-[#281546] to-[#1E0D35] border border-purple-600/30 hover:border-[#FF2E9D] p-3.5 shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              {/* Top Room Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {r.category === 'dating' ? '💘' : r.category === 'gaming' ? '🎨' : '🔥'}
                  </span>
                  <div>
                    <h4 className="font-heading font-black text-sm text-white group-hover:text-[#FF2E9D] transition truncate max-w-[160px]">
                      {r.name}
                    </h4>
                    <span className="text-[10px] text-purple-300">Anfitrión: {r.hostName}</span>
                  </div>
                </div>

                {/* Online listeners counter */}
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 text-emerald-400 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{r.membersCount}</span>
                </div>
              </div>

              {/* Tags & Active Game badge */}
              <div className="flex items-center gap-2 my-2">
                <span className="text-[10px] font-black bg-purple-900/50 text-pink-300 px-2 py-0.5 rounded-md border border-purple-500/30">
                  {r.tag}
                </span>

                {r.currentGame && (
                  <span className="text-[10px] font-black bg-amber-500/20 text-yellow-300 px-2 py-0.5 rounded-md border border-yellow-500/30 flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" />
                    Jugando Draw & Guess
                  </span>
                )}
              </div>

              {/* Seats preview bottom */}
              <div className="flex items-center justify-between pt-2 border-t border-purple-800/30 text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>8 asientos de voz libres</span>
                </div>

                <span className="text-[#FF2E9D] font-extrabold group-hover:underline">
                  Unirse ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Create Room Button */}
      <div className="fixed bottom-18 right-5 z-20">
        <button
          onClick={() => {
            playSound('pop');
            onCreateRoomClick();
          }}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-[#8B5CF6] text-white font-heading font-black text-sm shadow-2xl neon-glow-pink hover:scale-105 active:scale-95 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Crear Sala</span>
        </button>
      </div>
    </div>
  );
};
