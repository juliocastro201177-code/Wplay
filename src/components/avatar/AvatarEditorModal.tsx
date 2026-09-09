import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { ChibiAvatarConfig } from '../../types';
import { ChibiAvatar } from './ChibiAvatar';
import { playSound } from '../../utils/audio';

interface AvatarEditorModalProps {
  currentConfig: ChibiAvatarConfig;
  currentFrameId: string;
  currentBubbleId: string;
  currentEnterEffectId: string;
  onSave: (data: {
    avatarConfig: ChibiAvatarConfig;
    frameId: string;
    bubbleId: string;
    enterEffectId: string;
  }) => void;
  onClose: () => void;
}

export const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({
  currentConfig,
  currentFrameId,
  currentBubbleId,
  currentEnterEffectId,
  onSave,
  onClose,
}) => {
  const [config, setConfig] = useState<ChibiAvatarConfig>({ ...currentConfig });
  const [frameId, setFrameId] = useState(currentFrameId);
  const [bubbleId, setBubbleId] = useState(currentBubbleId);
  const [enterEffectId, setEnterEffectId] = useState(currentEnterEffectId);
  const [activeTab, setActiveTab] = useState<'cara' | 'ropa' | 'marcos' | 'burbujas' | 'entradas'>('cara');

  const skinColors = [
    { name: 'Latino Cálido', color: '#FBD1A2' },
    { name: 'Canela Dorada', color: '#E0AC69' },
    { name: 'Moreno Choco', color: '#8D5524' },
    { name: 'Porcelana', color: '#FFDFBA' },
  ];

  const hairStyles = [
    { id: 'urban_fade', label: 'Fade Urbano' },
    { id: 'curly_buchon', label: 'Rizado Buchón' },
    { id: 'long_straight', label: 'Lacio Chic' },
    { id: 'anime_spiky', label: 'Picos Anime' },
  ];

  const hairColors = [
    { name: 'Negro Azabache', color: '#18181B' },
    { name: 'Castaño Miel', color: '#78350F' },
    { name: 'Rosa Neón WePlay', color: '#FF2E9D' },
    { name: 'Violeta Galaxy', color: '#8B5CF6' },
    { name: 'Platino', color: '#E2E8F0' },
  ];

  const expressions = [
    { id: 'happy', label: 'Kawaii Alegre' },
    { id: 'wink', label: 'Guiño Coqueto' },
    { id: 'cool', label: 'Malandro Sonrisa' },
    { id: 'star', label: 'Ojos Estrella' },
  ];

  const outfits = [
    { id: 'neon_hoodie', label: 'Hoodie Neón', color: '#FF2E9D' },
    { id: 'belicon_jacket', label: 'Chamarra Bélica', color: '#10B981' },
    { id: 'suit_vip', label: 'Traje de Gala VIP', color: '#1E1B4B' },
  ];

  const headwears = [
    { id: 'none', label: 'Sin Gorro' },
    { id: 'jgl_cap', label: 'Gorra 701 Bélica' },
    { id: 'golden_crown', label: 'Corona de Rey' },
    { id: 'vaquero_hat', label: 'Sombrero Vaquero' },
  ];

  const glassesOptions = [
    { id: 'none', label: 'Sin Lentes' },
    { id: 'sunglasses_vip', label: 'Lentes Oscuros VIP' },
  ];

  const vipFrames = [
    { id: 'default', label: 'Básico', color: '#3A2A60' },
    { id: 'vip_gold', label: 'Corona de Oro VIP', color: '#F59E0B' },
    { id: 'vip_neon_pink', label: 'Neón Rosa Cyber', color: '#FF2E9D' },
    { id: 'vip_dragon_fire', label: 'Fuego de Dragón', color: '#EA580C' },
    { id: 'vip_angel_wings', label: 'Alas de Querubín', color: '#38BDF8' },
  ];

  const chatBubbles = [
    { id: 'bubble_default', label: 'Morado Noche WePlay' },
    { id: 'bubble_pink_neon', label: 'Rosa Neón Glamour' },
    { id: 'bubble_gold_luxury', label: 'Bling Bling Oro' },
    { id: 'bubble_cyber_cyan', label: 'Cyberpunk Azul' },
  ];

  const enterEffects = [
    { id: 'effect_hearts', label: 'Lluvia de Corazones Flotantes' },
    { id: 'effect_fireworks', label: 'Fuegos Artificiales y Rayos' },
    { id: 'effect_money', label: 'Fajos de Dólares al Entrar' },
    { id: 'effect_flames', label: 'Aura de Llamas Infernales' },
  ];

  const handleSave = () => {
    playSound('coin');
    onSave({
      avatarConfig: config,
      frameId,
      bubbleId,
      enterEffectId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-800/40 bg-[#1A0B2E]/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF2E9D]" />
            <h2 className="font-heading font-extrabold text-lg text-white">Armario & Editor Chibi 3D</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Chibi 3D Avatar Preview Stage */}
        <div className="relative py-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#3A2A60]/40 to-transparent border-b border-purple-800/30">
          <div className="relative">
            <div className="absolute -inset-4 bg-[#FF2E9D]/20 rounded-full blur-xl" />
            <ChibiAvatar config={config} size={110} frameId={frameId} isSpeaking={false} />
          </div>
          <span className="mt-3 text-xs font-semibold tracking-wider text-pink-300 uppercase">
            Vista Previa en Vivo WePlay
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-4 pt-3 border-b border-purple-800/30 gap-1 overflow-x-auto">
          {[
            { id: 'cara', label: 'Rostro & Pelo' },
            { id: 'ropa', label: 'Ropa & Acc' },
            { id: 'marcos', label: 'Marcos VIP' },
            { id: 'burbujas', label: 'Burbujas' },
            { id: 'entradas', label: 'Efecto Entrada' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-t-xl transition ${
                activeTab === tab.id
                  ? 'bg-[#FF2E9D] text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {activeTab === 'cara' && (
            <>
              {/* Skin Tone */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Tono de Piel Chibi</label>
                <div className="grid grid-cols-4 gap-2">
                  {skinColors.map((s) => (
                    <button
                      key={s.color}
                      onClick={() => setConfig({ ...config, skinColor: s.color })}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition ${
                        config.skinColor === s.color
                          ? 'border-[#FF2E9D] bg-pink-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full shadow-md" style={{ backgroundColor: s.color }} />
                      <span className="text-[10px] text-gray-300 text-center">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Estilo de Cabello</label>
                <div className="grid grid-cols-2 gap-2">
                  {hairStyles.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setConfig({ ...config, hairStyle: h.id })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                        config.hairStyle === h.id
                          ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-pink-200'
                          : 'border-white/10 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Tinte de Cabello</label>
                <div className="flex flex-wrap gap-2">
                  {hairColors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setConfig({ ...config, hairColor: c.color })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition ${
                        config.hairColor === c.color
                          ? 'border-[#FF2E9D] bg-pink-500/20 text-white'
                          : 'border-white/10 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expressions */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Expresión Facial</label>
                <div className="grid grid-cols-2 gap-2">
                  {expressions.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setConfig({ ...config, expression: e.id })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                        config.expression === e.id
                          ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-pink-200'
                          : 'border-white/10 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'ropa' && (
            <>
              {/* Outfits */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Vestuario 3D</label>
                <div className="space-y-2">
                  {outfits.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setConfig({ ...config, outfit: o.id, outfitColor: o.color })}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                        config.outfit === o.id
                          ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-white'
                          : 'border-white/10 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md" style={{ backgroundColor: o.color }} />
                        <span>{o.label}</span>
                      </div>
                      {config.outfit === o.id && <Check className="w-4 h-4 text-[#FF2E9D]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headwear */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Gorros & Sombreros</label>
                <div className="grid grid-cols-2 gap-2">
                  {headwears.map((hw) => (
                    <button
                      key={hw.id}
                      onClick={() => setConfig({ ...config, headwear: hw.id })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                        config.headwear === hw.id
                          ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-pink-200'
                          : 'border-white/10 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {hw.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glasses */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">Gafas & Accesorios</label>
                <div className="grid grid-cols-2 gap-2">
                  {glassesOptions.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setConfig({ ...config, glasses: g.id })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                        config.glasses === g.id
                          ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-pink-200'
                          : 'border-white/10 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'marcos' && (
            <div className="space-y-3">
              <p className="text-xs text-purple-300">
                Los marcos VIP animan tu avatar en las salas de voz y perfil público.
              </p>
              {vipFrames.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrameId(f.id)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between transition ${
                    frameId === f.id
                      ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-white'
                      : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: f.color }} />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">{f.label}</div>
                      <div className="text-[10px] text-gray-400">Efecto animado permanente</div>
                    </div>
                  </div>
                  {frameId === f.id && <Check className="w-5 h-5 text-[#FF2E9D]" />}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'burbujas' && (
            <div className="space-y-3">
              <p className="text-xs text-purple-300">
                Personaliza cómo se ven tus mensajes en el chat de la sala.
              </p>
              {chatBubbles.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBubbleId(b.id)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    bubbleId === b.id
                      ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-white'
                      : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{b.label}</div>
                    <div className="text-[11px] text-pink-300 mt-0.5">"¡Hola a todos en la sala! 👋"</div>
                  </div>
                  {bubbleId === b.id && <Check className="w-5 h-5 text-[#FF2E9D]" />}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'entradas' && (
            <div className="space-y-3">
              <p className="text-xs text-purple-300">
                Efecto especial cuando entras a cualquier sala de voz.
              </p>
              {enterEffects.map((eff) => (
                <button
                  key={eff.id}
                  onClick={() => setEnterEffectId(eff.id)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    enterEffectId === eff.id
                      ? 'border-[#FF2E9D] bg-[#FF2E9D]/15 text-white'
                      : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{eff.label}</div>
                    <div className="text-[10px] text-gray-400">Aviso full-screen a todos en sala</div>
                  </div>
                  {enterEffectId === eff.id && <Check className="w-5 h-5 text-[#FF2E9D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-800/40 bg-[#1A0B2E] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/20 text-xs font-bold text-gray-300 hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white text-xs font-extrabold shadow-lg neon-glow-pink hover:opacity-95 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
