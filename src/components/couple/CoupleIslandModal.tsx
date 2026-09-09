import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  Camera, 
  Calendar, 
  Music, 
  Gift as GiftIcon, 
  Database, 
  Smile, 
  Flame, 
  Volume2, 
  Edit3, 
  Check, 
  MessageCircle, 
  Image as ImageIcon,
  ThumbsUp,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, CoupleRecord, IslandMoment, IslandChatMessage, ConversationLog } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { db } from '../../services/databaseService';
import { playSound } from '../../utils/audio';

interface CoupleIslandModalProps {
  currentUser: User;
  couple: CoupleRecord;
  onClose: () => void;
  onSendGift?: (receiverName: string) => void;
}

export const CoupleIslandModal: React.FC<CoupleIslandModalProps> = ({
  currentUser,
  couple: initialCouple,
  onClose,
  onSendGift,
}) => {
  const [couple, setCouple] = useState<CoupleRecord>(initialCouple);
  const [activeTab, setActiveTab] = useState<'island' | 'chat' | 'moments' | 'database'>('island');

  // Island Theme and Name Customization
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState(couple.islandName);

  // Moments State
  const [moments, setMoments] = useState<IslandMoment[]>([]);
  const [isCreatingMoment, setIsCreatingMoment] = useState(false);
  const [momentTitle, setMomentTitle] = useState('');
  const [momentText, setMomentText] = useState('');
  const [momentEmoji, setMomentEmoji] = useState('💖');
  const [momentPresetPhoto, setMomentPresetPhoto] = useState('sunset_yacht');

  // Chat State
  const [chatMessages, setChatMessages] = useState<IslandChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Database Logs State
  const [dbLogs, setDbLogs] = useState<ConversationLog[]>([]);

  // Sound / Ambience State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Fetch initial data
  useEffect(() => {
    refreshData();
  }, [couple.id]);

  const refreshData = () => {
    const updatedCouple = db.getCoupleById(couple.id) || couple;
    setCouple(updatedCouple);
    setMoments(db.getIslandMoments(couple.id));
    setChatMessages(db.getIslandChats(couple.id));
    setDbLogs(db.getConversationLogs(couple.id));
  };

  // Partner determination
  const isUser1 = currentUser.uid === couple.user1Uid;
  const partnerName = isUser1 ? couple.user2Name : couple.user1Name;
  const partnerAvatar = isUser1 ? couple.user2AvatarConfig : couple.user1AvatarConfig;
  const myAvatar = isUser1 ? couple.user1AvatarConfig : couple.user2AvatarConfig;

  // Handle Island Name Save
  const handleSaveIslandName = () => {
    if (!customName.trim()) return;
    playSound('click');
    const updated = db.updateIslandSettings(couple.id, { islandName: customName.trim() });
    setCouple(updated);
    setIsEditingName(false);
  };

  // Change Theme
  const handleChangeTheme = (theme: CoupleRecord['islandTheme']) => {
    playSound('pop');
    const updated = db.updateIslandSettings(couple.id, { islandTheme: theme });
    setCouple(updated);
  };

  // Water Love Tree (+XP)
  const handleWaterTree = () => {
    playSound('romance');
    confetti({ particleCount: 35, spread: 60 });
    const updated = db.updateIslandSettings(couple.id, {
      lovePoints: couple.lovePoints + 25,
      loveLevel: Math.floor((couple.lovePoints + 25) / 300) + 1,
    });
    setCouple(updated);
  };

  // Romantic Toast
  const handleToastCheers = () => {
    playSound('bell');
    confetti({ particleCount: 50, spread: 80 });
    db.sendIslandChat(
      couple.id,
      currentUser.uid,
      currentUser.nickname,
      `🥂 ¡Brindó con una copa de champaña en la orilla del mar!`,
      'special_event'
    );
    refreshData();
  };

  // Play romantic chime
  const handleToggleMusic = () => {
    playSound('romance');
    setIsPlayingMusic(true);
    setTimeout(() => setIsPlayingMusic(false), 3500);
  };

  // Send Island Chat Message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playSound('click');
    db.sendIslandChat(
      couple.id,
      currentUser.uid,
      currentUser.nickname,
      chatInput.trim(),
      'text'
    );
    setChatInput('');
    refreshData();

    // Simulated sweet reply after 2 seconds
    setTimeout(() => {
      playSound('pop');
      db.sendIslandChat(
        couple.id,
        isUser1 ? couple.user2Uid : couple.user1Uid,
        partnerName,
        '¡Qué lindo estar aquí contigo en nuestra isla privada! 🥰🏝️',
        'text'
      );
      refreshData();
    }, 2000);
  };

  // Create Moment
  const handleCreateMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentTitle.trim() || !momentText.trim()) return;

    playSound('gift_small');
    confetti({ particleCount: 60, spread: 70 });

    const photoUrls: Record<string, string> = {
      sunset_yacht: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60',
      candle_beach: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&auto=format&fit=crop&q=60',
      night_stars: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=60',
      cabin_lagoon: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60',
    };

    db.addIslandMoment(
      couple.id,
      currentUser.uid,
      currentUser.nickname,
      momentTitle.trim(),
      momentText.trim(),
      momentEmoji,
      photoUrls[momentPresetPhoto]
    );

    setMomentTitle('');
    setMomentText('');
    setIsCreatingMoment(false);
    refreshData();
  };

  // Like Moment
  const handleLikeMoment = (momentId: string) => {
    playSound('pop');
    confetti({ particleCount: 20, spread: 40 });
    db.likeIslandMoment(momentId, couple.id);
    refreshData();
  };

  // Calculate talk duration display
  const totalMinutes = Math.floor(couple.continuousTalkSeconds / 60);
  const totalSecondsRemainder = couple.continuousTalkSeconds % 60;

  // Theme gradient lookup
  const themeBackgrounds: Record<string, string> = {
    sunset_tropical: 'from-[#431238] via-[#2A0E3C] to-[#140620]',
    starlight_neon: 'from-[#170B3B] via-[#0E174D] to-[#0A0726]',
    cherry_blossom: 'from-[#4D1338] via-[#350A26] to-[#180414]',
    moonlit_lagoon: 'from-[#082D3D] via-[#081B2B] to-[#040E17]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in">
      <div className={`relative w-full max-w-md h-[92vh] max-h-[760px] bg-gradient-to-b ${themeBackgrounds[couple.islandTheme] || themeBackgrounds.sunset_tropical} border border-pink-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col`}>
        
        {/* Top Navbar */}
        <div className="px-4 py-3 bg-black/40 border-b border-pink-500/30 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-amber-400 flex items-center justify-center text-lg shadow-md animate-pulse">
              🏝️
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="bg-black/60 border border-pink-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                    maxLength={30}
                  />
                  <button onClick={handleSaveIslandName} className="p-1 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setIsEditingName(true)}>
                  <h2 className="font-heading font-black text-xs sm:text-sm text-white truncate max-w-[180px]">
                    {couple.islandName}
                  </h2>
                  <Edit3 className="w-3 h-3 text-purple-300 opacity-60 group-hover:opacity-100" />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[10px] text-pink-300">
                <span>Nivel de Amor {couple.loveLevel}</span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Privado & Cifrado
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Ambient Sound Trigger */}
            <button
              onClick={handleToggleMusic}
              className={`p-2 rounded-xl transition ${isPlayingMusic ? 'bg-pink-500 text-white animate-bounce' : 'bg-white/10 text-pink-300 hover:bg-white/20'}`}
              title="Melodía Romántica"
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-3 pt-2 bg-black/25 border-b border-pink-500/20 flex items-center justify-around z-20">
          {[
            { id: 'island', label: 'La Isla', icon: '🏝️' },
            { id: 'chat', label: 'Chat Íntimo', icon: '💬' },
            { id: 'moments', label: 'Momentos', icon: '📸' },
            { id: 'database', label: 'Base de Datos', icon: '🗄️' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-1.5 py-2 px-2.5 text-xs font-heading font-black border-b-2 transition ${
                  isActive
                    ? 'border-[#FF2E9D] text-pink-300'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative">

          {/* TAB 1: THE VISUAL ISLAND SCENERY */}
          {activeTab === 'island' && (
            <div className="p-4 flex flex-col space-y-4">
              
              {/* Couple Stats Banner */}
              <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500 flex items-center justify-center text-pink-400 font-black text-xs">
                    💖
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                      Conexión en Sala
                    </span>
                    <span className="text-xs font-black text-white">
                      {totalMinutes}m {totalSecondsRemainder}s continuos
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                    Puntos de Amor
                  </span>
                  <span className="text-xs font-mono font-black text-amber-300">
                    {couple.lovePoints} pts
                  </span>
                </div>
              </div>

              {/* Unique Island 3D/Vector Scenic Stage */}
              <div className="relative h-56 rounded-3xl overflow-hidden border-2 border-pink-500/30 shadow-2xl flex flex-col justify-between p-4 bg-gradient-to-b from-[#1C0933]/80 via-[#2E0F45]/60 to-[#0C1E30]/90">
                {/* Floating lanterns / stars background */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                  <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-pink-300 animate-pulse" />
                  <div className="absolute top-20 left-1/3 w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-100" />
                  <div className="absolute top-6 right-1/4 w-3 h-3 rounded-full bg-amber-400 blur-sm animate-bounce" />
                </div>

                {/* Heart Moon or Sun in Sky */}
                <div className="absolute top-3 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-amber-300 opacity-80 blur-xs shadow-[0_0_30px_#FF2E9D] flex items-center justify-center text-2xl">
                  🌙
                </div>

                {/* Tropical Palm silhouettes SVG */}
                <div className="absolute bottom-6 -left-4 pointer-events-none opacity-50 text-emerald-400 text-6xl">
                  🌴
                </div>
                <div className="absolute bottom-6 -right-3 pointer-events-none opacity-50 text-emerald-400 text-6xl scale-x-[-1]">
                  🌴
                </div>

                {/* Island Dock / Beach Pergola Canvas */}
                <div className="relative z-10 w-full flex items-center justify-center my-auto">
                  <div className="flex items-center gap-6 px-6 py-3 rounded-3xl bg-black/50 border border-pink-500/40 backdrop-blur-md shadow-[0_0_30px_rgba(255,46,157,0.3)]">
                    {/* User 1 Avatar */}
                    <div className="flex flex-col items-center">
                      <ChibiAvatar config={myAvatar} size={64} frameId="vip_gold" />
                      <span className="font-heading font-black text-[11px] text-white mt-1">
                        {currentUser.nickname}
                      </span>
                    </div>

                    {/* Central Glowing Heart */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-purple-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                        <Heart className="w-5 h-5 fill-white" />
                      </div>
                      <span className="text-[9px] text-pink-300 font-bold mt-1">
                        Juntos en la Isla
                      </span>
                    </div>

                    {/* Partner Avatar */}
                    <div className="flex flex-col items-center">
                      <ChibiAvatar config={partnerAvatar} size={64} frameId="vip_gold" />
                      <span className="font-heading font-black text-[11px] text-white mt-1">
                        {partnerName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Island Animated Water Ripple Footing */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-purple-200">
                  <span className="font-bold flex items-center gap-1">
                    <span>🌊</span> Olas bioluminiscentes
                  </span>
                  <span className="text-amber-300 font-bold">
                    {couple.relationshipStatus}
                  </span>
                </div>
              </div>

              {/* Island Interactive Actions Bar */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleWaterTree}
                  className="py-2.5 px-2 rounded-2xl bg-purple-900/50 hover:bg-purple-800 border border-pink-500/30 text-white text-xs font-bold flex flex-col items-center gap-1 transition"
                >
                  <span className="text-xl">🌳</span>
                  <span>Regar Árbol (+25)</span>
                </button>

                <button
                  onClick={handleToastCheers}
                  className="py-2.5 px-2 rounded-2xl bg-purple-900/50 hover:bg-purple-800 border border-pink-500/30 text-white text-xs font-bold flex flex-col items-center gap-1 transition"
                >
                  <span className="text-xl">🥂</span>
                  <span>Brindar Copa</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className="py-2.5 px-2 rounded-2xl bg-gradient-to-tr from-[#FF2E9D] to-purple-600 text-white text-xs font-bold flex flex-col items-center gap-1 shadow-md hover:opacity-95 transition"
                >
                  <span className="text-xl">💌</span>
                  <span>Mensaje Secreto</span>
                </button>
              </div>

              {/* Island Atmosphere / Theme Picker */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-800/40">
                <span className="text-xs font-heading font-black text-white block mb-2">
                  Atmósfera de la Isla
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sunset_tropical', name: 'Atardecer Tropical', emoji: '🌅' },
                    { id: 'starlight_neon', name: 'Neón Estelar', emoji: '🌌' },
                    { id: 'cherry_blossom', name: 'Cerezo Rosa', emoji: '🌸' },
                    { id: 'moonlit_lagoon', name: 'Laguna Lunar', emoji: '🌙' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleChangeTheme(t.id as CoupleRecord['islandTheme'])}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between border transition ${
                        couple.islandTheme === t.id
                          ? 'border-[#FF2E9D] bg-pink-500/20 text-white'
                          : 'border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span>{t.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INTIMATE COUPLE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full justify-between p-3">
              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[460px]">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12 text-purple-300 text-xs">
                    <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2 animate-bounce" />
                    ¡Comiencen a enviarse mensajes privados en su Isla de Parejas!
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.senderUid === currentUser.uid;
                    const isSystem = msg.type === 'special_event';

                    if (isSystem) {
                      return (
                        <div
                          key={msg.id}
                          className="py-1.5 px-3 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-200 text-xs text-center my-1"
                        >
                          {msg.text}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`px-3.5 py-2 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white rounded-br-none shadow-md'
                              : 'bg-purple-950/80 border border-purple-700/40 text-gray-200 rounded-bl-none'
                          }`}
                        >
                          <div className="font-bold text-[10px] opacity-75 mb-0.5">
                            {msg.senderName}
                          </div>
                          <div>{msg.text}</div>
                        </div>
                        <span className="text-[9px] text-gray-400 px-1 mt-0.5">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="pt-2 border-t border-purple-800/40 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Mensaje secreto para ${partnerName}...`}
                  className="flex-1 bg-white/5 border border-pink-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300 focus:outline-none focus:border-[#FF2E9D]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#FF2E9D] hover:bg-pink-600 text-white shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PRIVATE MOMENTS (DIARIO DE LA ISLA) */}
          {activeTab === 'moments' && (
            <div className="p-4 flex flex-col space-y-4">
              {/* Header trigger to add moment */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-sm text-white flex items-center gap-1.5">
                    <span>Diario Secreto de Pareja</span>
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                  </h3>
                  <span className="text-[10px] text-purple-300">
                    Solo visible para {currentUser.nickname} y {partnerName}
                  </span>
                </div>

                <button
                  onClick={() => setIsCreatingMoment(!isCreatingMoment)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white font-black text-xs shadow-md"
                >
                  {isCreatingMoment ? 'Cancelar' : '+ Publicar Recuerdo'}
                </button>
              </div>

              {/* New Moment Creation Form */}
              {isCreatingMoment && (
                <form
                  onSubmit={handleCreateMoment}
                  className="p-4 rounded-2xl bg-black/60 border border-pink-500/40 space-y-3 animate-in fade-in"
                >
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Título del Recuerdo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Nuestra plática favorita de 30 min..."
                      value={momentTitle}
                      onChange={(e) => setMomentTitle(e.target.value)}
                      className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Mensaje o Nota Romántica
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Escribe lo que sentiste en ese momento..."
                      value={momentText}
                      onChange={(e) => setMomentText(e.target.value)}
                      className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
                    />
                  </div>

                  {/* Scenery Photo Selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Postal de la Isla
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'sunset_yacht', label: 'Paseo al Atardecer' },
                        { id: 'candle_beach', label: 'Cena con Velas' },
                        { id: 'night_stars', label: 'Noche de Estrellas' },
                        { id: 'cabin_lagoon', label: 'Cabaña en Laguna' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setMomentPresetPhoto(preset.id)}
                          className={`p-2 rounded-xl text-[11px] font-bold border text-left transition ${
                            momentPresetPhoto === preset.id
                              ? 'border-pink-500 bg-pink-500/20 text-white'
                              : 'border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white font-black text-xs shadow-md"
                  >
                    Guardar en el Diario Privado 💖
                  </button>
                </form>
              )}

              {/* Moments Stream */}
              <div className="space-y-3">
                {moments.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl bg-black/40 border border-purple-800/40 overflow-hidden shadow-lg p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{m.moodEmoji || '💖'}</span>
                        <div>
                          <h4 className="font-heading font-black text-xs text-white">
                            {m.title}
                          </h4>
                          <span className="text-[10px] text-purple-300">
                            Por {m.authorName} • {m.date}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLikeMoment(m.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold transition"
                      >
                        <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                        <span>{m.likes}</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-200 leading-relaxed">{m.text}</p>

                    {m.imageUrl && (
                      <div className="rounded-xl overflow-hidden max-h-48 border border-white/10">
                        <img
                          src={m.imageUrl}
                          alt={m.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE INSPECTION & TELEMETRY */}
          {activeTab === 'database' && (
            <div className="p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Registro en Base de Datos</span>
                  </h3>
                  <p className="text-[11px] text-purple-300">
                    Verificación del registro continuo y estado de desbloqueo
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  ● DB PERSISTENTE
                </span>
              </div>

              {/* Couple Record Details Table */}
              <div className="rounded-2xl bg-black/50 border border-emerald-500/30 p-3.5 space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-gray-400">ID de Pareja:</span>
                  <span className="text-white truncate max-w-[180px]">{couple.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-gray-400">Estado de Isla:</span>
                  <span className="text-emerald-400 font-bold">
                    {couple.isUnlocked ? '✅ DESBLOQUEADA (30m completados)' : '🔒 Bloqueada'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-gray-400">Tiempo de Conversación:</span>
                  <span className="text-amber-300 font-bold">
                    {couple.continuousTalkSeconds}s ({totalMinutes}m {totalSecondsRemainder}s)
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-gray-400">Meta Requerida:</span>
                  <span className="text-white">1,800 segundos (30.0 minutos)</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-gray-400">Desbloqueado el:</span>
                  <span className="text-purple-300">
                    {couple.unlockedAt ? new Date(couple.unlockedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Participantes:</span>
                  <span className="text-white">
                    {couple.user1Name} & {couple.user2Name}
                  </span>
                </div>
              </div>

              {/* Conversation Logs Stream */}
              <div>
                <span className="text-xs font-heading font-black text-white block mb-2">
                  Historial de Logs de Conversación ({dbLogs.length} sesiones registradas)
                </span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {dbLogs.length === 0 ? (
                    <div className="p-3 text-center text-xs text-purple-300 bg-purple-950/40 rounded-xl">
                      No hay registros adicionales en el historial.
                    </div>
                  ) : (
                    dbLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] font-mono flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white font-bold">
                            Sala: {log.roomName}
                          </div>
                          <div className="text-gray-400 text-[10px]">
                            {new Date(log.timestamp).toLocaleTimeString()} • +{log.durationSeconds}s grabados
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-pink-300 font-bold">
                            {Math.floor(log.totalAccumulatedSeconds / 60)}m {log.totalAccumulatedSeconds % 60}s acum.
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
