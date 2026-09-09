import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Crown, 
  Users, 
  Trophy, 
  Sparkles, 
  Coins, 
  Plus, 
  Flame, 
  ChevronRight, 
  CheckCircle2,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, WePlayClan, ClanMember } from '../../types';
import { playSound } from '../../utils/audio';

interface WePlayClanModalProps {
  currentUser: User;
  onClose: () => void;
  onOpenClanRoom?: (clan: WePlayClan) => void;
}

const INITIAL_CLANS: WePlayClan[] = [
  {
    id: 'clan_fenix',
    name: 'Imperio Fénix',
    tag: 'FENIX',
    badgeIcon: '🔥',
    badgeColor: 'from-orange-500 to-red-600',
    level: 12,
    leaderUid: 'user_valeria',
    leaderName: 'Valeria_CDMX',
    description: 'La familia #1 de México y LATAM. Activos 24/7 en salas de voz y batallas PK.',
    memberCount: 48,
    maxMembers: 50,
    totalPowerCP: 854000,
    ranking: 1,
    announcement: 'Hoy a las 9 PM Gran Torneo de Draw & Guess y Fiesta de Regalos 🎁',
    members: [
      { uid: 'user_valeria', nickname: 'Valeria_CDMX', role: 'leader', contributionCoins: 125000, joinedDate: '2025-11-10', level: 32 },
      { uid: 'user_mateo', nickname: 'Mateo_Regio', role: 'elder', contributionCoins: 89000, joinedDate: '2025-12-01', level: 28 },
      { uid: 'user_sofia', nickname: 'Sofia_Gamer', role: 'member', contributionCoins: 45000, joinedDate: '2026-01-15', level: 24 },
    ],
  },
  {
    id: 'clan_nebula',
    name: 'Nébula VIP Starlight',
    tag: 'NEBULA',
    badgeIcon: '✨',
    badgeColor: 'from-purple-500 to-pink-600',
    level: 10,
    leaderUid: 'user_carlos',
    leaderName: 'Carlos_VIP',
    description: 'Comunidad exclusiva de cantantes y amantes de la buena música en salas.',
    memberCount: 39,
    maxMembers: 45,
    totalPowerCP: 620000,
    ranking: 2,
    announcement: 'Buscamos voces para el concurso de Karaoke de este fin de semana 🎤',
    members: [
      { uid: 'user_carlos', nickname: 'Carlos_VIP', role: 'leader', contributionCoins: 98000, joinedDate: '2025-10-20', level: 30 },
      { uid: 'user_camila', nickname: 'Camila_Love', role: 'elder', contributionCoins: 71000, joinedDate: '2026-01-02', level: 25 },
    ],
  },
  {
    id: 'clan_azteca',
    name: 'Dinastía Real',
    tag: 'REAL',
    badgeIcon: '👑',
    badgeColor: 'from-amber-400 to-yellow-600',
    level: 9,
    leaderUid: 'user_alex',
    leaderName: 'Alex_Master',
    description: 'Reyes de las partidas de ¿Quién es el Espía? y Space Werewolf.',
    memberCount: 32,
    maxMembers: 40,
    totalPowerCP: 480000,
    ranking: 3,
    announcement: 'Salas de juegos todos los días desde las 6 PM hora CDMX.',
    members: [
      { uid: 'user_alex', nickname: 'Alex_Master', role: 'leader', contributionCoins: 65000, joinedDate: '2026-01-20', level: 22 },
    ],
  },
];

export const WePlayClanModal: React.FC<WePlayClanModalProps> = ({
  currentUser,
  onClose,
  onOpenClanRoom,
}) => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'my_clan' | 'create'>('ranking');
  const [clans, setClans] = useState<WePlayClan[]>(INITIAL_CLANS);
  const [selectedClan, setSelectedClan] = useState<WePlayClan | null>(INITIAL_CLANS[0]);
  const [myClanId, setMyClanId] = useState<string | null>('clan_fenix'); // User member of Clan Fénix

  // Create clan form states
  const [newClanName, setNewClanName] = useState('');
  const [newClanTag, setNewClanTag] = useState('');
  const [newClanBadge, setNewClanBadge] = useState('🔥');
  const [newClanDesc, setNewClanDesc] = useState('');

  const BADGE_ICONS = ['🔥', '👑', '✨', '🐺', '🐉', '💎', '🚀', '⚡', '🌸', '⚔️'];

  const handleJoinClan = (clan: WePlayClan) => {
    playSound('coin');
    confetti({ particleCount: 80, spread: 60 });
    setMyClanId(clan.id);
    setSelectedClan(clan);
    setActiveTab('my_clan');
  };

  const handleDonateCoins = (amount: number) => {
    playSound('gift_small');
    confetti({ particleCount: 50, spread: 50 });
    if (selectedClan) {
      const updated = {
        ...selectedClan,
        totalPowerCP: selectedClan.totalPowerCP + amount * 10,
      };
      setSelectedClan(updated);
      setClans(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  };

  const handleCreateClan = () => {
    if (!newClanName.trim() || !newClanTag.trim()) return;
    playSound('gift_huge');
    confetti({ particleCount: 150, spread: 90 });

    const createdClan: WePlayClan = {
      id: `clan_${Date.now()}`,
      name: newClanName.trim(),
      tag: newClanTag.trim().toUpperCase(),
      badgeIcon: newClanBadge,
      badgeColor: 'from-pink-500 to-purple-600',
      level: 1,
      leaderUid: currentUser.uid,
      leaderName: currentUser.nickname,
      description: newClanDesc.trim() || 'Familia unida y activa en WePlay.',
      memberCount: 1,
      maxMembers: 30,
      totalPowerCP: 1000,
      ranking: clans.length + 1,
      announcement: '¡Bienvenidos a nuestra nueva familia! Inviten a sus amigos.',
      members: [
        {
          uid: currentUser.uid,
          nickname: currentUser.nickname,
          role: 'leader',
          contributionCoins: 1000,
          joinedDate: 'Hoy',
          level: currentUser.level || 32,
        },
      ],
    };

    setClans([createdClan, ...clans]);
    setMyClanId(createdClan.id);
    setSelectedClan(createdClan);
    setActiveTab('my_clan');
  };

  const userClan = clans.find(c => c.id === myClanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1C0F38] via-[#2A154D] to-[#120726] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-800/40 bg-[#120726]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-xl shadow-lg">
              🛡️
            </div>
            <div>
              <h2 className="font-heading font-black text-white text-base">Familias WePlay</h2>
              <p className="text-[10px] text-purple-300">Clanes, salas privadas y ranking de honor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-800/40 px-4 bg-[#120726]/60">
          {[
            { id: 'ranking', label: '🏆 Ranking Top' },
            { id: 'my_clan', label: userClan ? `🛡️ ${userClan.name}` : 'Mi Familia' },
            { id: 'create', label: '➕ Crear Familia' },
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
          {activeTab === 'ranking' && (
            <div className="space-y-3">
              {clans.map((clan, idx) => (
                <div
                  key={clan.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedClan(clan);
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedClan?.id === clan.id
                      ? 'border-[#FF2E9D] bg-pink-500/10 shadow-lg'
                      : 'border-purple-800/30 bg-purple-950/20 hover:border-purple-600/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Number */}
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-amber-400 text-black shadow-md' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-purple-900/60 text-purple-300'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Clan Crest Icon */}
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${clan.badgeColor} flex items-center justify-center text-2xl shadow-md`}>
                      {clan.badgeIcon}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-black text-white text-sm">{clan.name}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-purple-900/60 text-pink-300 border border-purple-700/40">
                          Nv.{clan.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-purple-300 mt-0.5 flex items-center gap-2">
                        <span>Líder: <strong>{clan.leaderName}</strong></span>
                        <span>•</span>
                        <span>{clan.memberCount}/{clan.maxMembers} Miembros</span>
                      </div>
                      <div className="text-[10px] text-yellow-400 font-mono mt-0.5">
                        {clan.totalPowerCP.toLocaleString()} CP
                      </div>
                    </div>
                  </div>

                  <div>
                    {myClanId === clan.id ? (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Miembro
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinClan(clan);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-800/60 hover:bg-[#FF2E9D] text-white text-xs font-bold transition shadow-sm"
                      >
                        Unirme
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'my_clan' && (
            <div className="space-y-3.5">
              {userClan ? (
                <>
                  {/* Clan Card Banner */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${userClan.badgeColor} text-white shadow-xl relative overflow-hidden`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl shadow-lg">
                          {userClan.badgeIcon}
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-lg text-white">{userClan.name}</h3>
                          <span className="text-xs text-white/80 font-mono">[{userClan.tag}] • Nivel {userClan.level}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black uppercase text-yellow-200">Top #{userClan.ranking}</div>
                        <div className="text-sm font-mono font-bold">{userClan.totalPowerCP.toLocaleString()} CP</div>
                      </div>
                    </div>

                    <p className="text-xs text-white/90 mt-3 italic">
                      "{userClan.description}"
                    </p>

                    {/* Announcement box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/15 text-[11px] text-yellow-200">
                      📢 <strong>Anuncio:</strong> {userClan.announcement}
                    </div>
                  </div>

                  {/* Actions: Clan Voice Room & Donate */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        playSound('pop');
                        if (onOpenClanRoom) onOpenClanRoom(userClan);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/40 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>🎙️ Sala de Voz Clan</span>
                    </button>

                    <button
                      onClick={() => handleDonateCoins(500)}
                      className="p-3 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 hover:opacity-90 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Donar (+5,000 CP)</span>
                    </button>
                  </div>

                  {/* Member Roster */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Miembros del Clan ({userClan.members.length})</span>
                      <Users className="w-3.5 h-3.5" />
                    </div>

                    {userClan.members.map((m) => (
                      <div
                        key={m.uid}
                        className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-xs font-bold text-white">
                            {m.nickname.charAt(0)}
                          </div>
                          <div>
                            <span className="font-heading font-black text-xs text-white">{m.nickname}</span>
                            <div className="text-[10px] text-purple-300">
                              Aporte: <strong className="text-yellow-400">{m.contributionCoins.toLocaleString()} 🪙</strong>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          m.role === 'leader' ? 'bg-amber-400/20 text-yellow-300 border border-yellow-400/40' : 'bg-purple-800/40 text-purple-300'
                        }`}>
                          {m.role === 'leader' ? '👑 Líder' : m.role === 'elder' ? '⭐ Anciano' : 'Miembro'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="text-4xl">🛡️</div>
                  <p className="text-xs text-purple-300">Aún no perteneces a ninguna familia WePlay.</p>
                  <button
                    onClick={() => setActiveTab('ranking')}
                    className="px-4 py-2 rounded-xl bg-[#FF2E9D] text-white text-xs font-bold"
                  >
                    Ver Ranking de Familias
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-purple-200">Nombre de la Familia</label>
                <input
                  type="text"
                  value={newClanName}
                  onChange={(e) => setNewClanName(e.target.value)}
                  placeholder="Ej: Dinastía Suprema"
                  maxLength={20}
                  className="w-full mt-1 bg-purple-950/60 border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E9D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-200">Etiqueta / Tag (3-5 letras)</label>
                <input
                  type="text"
                  value={newClanTag}
                  onChange={(e) => setNewClanTag(e.target.value)}
                  placeholder="Ej: REAL"
                  maxLength={5}
                  className="w-full mt-1 bg-purple-950/60 border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E9D] uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-200">Escudo / Ícono de la Familia</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {BADGE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setNewClanBadge(icon);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition ${
                        newClanBadge === icon
                          ? 'bg-[#FF2E9D] ring-2 ring-white scale-110 shadow-lg'
                          : 'bg-purple-900/50 hover:bg-purple-800/60'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-200">Lema o Descripción</label>
                <textarea
                  value={newClanDesc}
                  onChange={(e) => setNewClanDesc(e.target.value)}
                  placeholder="Escribe el lema de tu clan..."
                  maxLength={80}
                  rows={2}
                  className="w-full mt-1 bg-purple-950/60 border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E9D]"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCreateClan}
                  disabled={!newClanName.trim() || !newClanTag.trim()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Fundar Familia (5,000 🪙)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
