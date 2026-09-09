import React from 'react';
import { ChibiAvatarConfig } from '../../types';

interface ChibiAvatarProps {
  config: ChibiAvatarConfig;
  size?: number;
  frameId?: string;
  isSpeaking?: boolean;
  className?: string;
  showAura?: boolean;
}

export const ChibiAvatar: React.FC<ChibiAvatarProps> = ({
  config,
  size = 80,
  frameId = 'default',
  isSpeaking = false,
  className = '',
  showAura = true,
}) => {
  const {
    skinColor = '#FBD1A2',
    hairStyle = 'urban_fade',
    hairColor = '#1F2937',
    expression = 'happy',
    outfit = 'neon_hoodie',
    outfitColor = '#FF2E9D',
    headwear = 'none',
    glasses = 'none',
    accessory = 'gold_chain',
  } = config || {};

  // VIP Animated Frames
  const renderFrame = () => {
    switch (frameId) {
      case 'vip_gold':
        return (
          <div className="absolute -inset-2 rounded-full border-2 border-amber-400 animate-spin-slow pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_8px_#F59E0B]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_8px_#F59E0B]" />
          </div>
        );
      case 'vip_neon_pink':
        return (
          <div className="absolute -inset-2 rounded-full border-2 border-[#FF2E9D] neon-glow-pink pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-1 py-0.2 bg-[#FF2E9D] text-[8px] font-black text-white rounded-full">
              VIP
            </div>
          </div>
        );
      case 'vip_dragon_fire':
        return (
          <div className="absolute -inset-2.5 rounded-full border-2 border-orange-500 animate-pulse shadow-[0_0_12px_#EA580C] pointer-events-none">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">🔥</div>
          </div>
        );
      case 'vip_angel_wings':
        return (
          <div className="absolute -inset-2 rounded-full border-2 border-sky-300 shadow-[0_0_10px_#38BDF8] pointer-events-none">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-xs">🪽</div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-xs scale-x-[-1]">🪽</div>
          </div>
        );
      default:
        return (
          <div className="absolute -inset-0.5 rounded-full border border-purple-400/40 pointer-events-none" />
        );
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${
        isSpeaking ? 'animate-speaking' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Speaking Ripple Glow */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-[#FF2E9D]/30 animate-ping" />
      )}

      {/* Frame */}
      {renderFrame()}

      {/* Chibi Character SVG Container */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E]"
      >
        <defs>
          <radialGradient id={`chibiShine_${skinColor}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor={skinColor} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Aura backdrop */}
        {showAura && (
          <circle cx="50" cy="50" r="46" fill="#8B5CF6" opacity="0.15" />
        )}

        {/* --- BODY / OUTFIT --- */}
        <g id="body">
          {/* Shoulders / Torso */}
          <path d="M22 84 Q50 68 78 84 L80 100 L20 100 Z" fill={outfitColor} />

          {/* Outfit details */}
          {outfit === 'belicon_jacket' && (
            <>
              <path d="M36 78 L50 94 L64 78" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="50" y1="80" x2="50" y2="100" stroke="#111827" strokeWidth="3" />
            </>
          )}

          {outfit === 'suit_vip' && (
            <>
              <polygon points="50,76 42,90 58,90" fill="#FFFFFF" />
              <polygon points="50,82 46,96 54,96" fill="#EF4444" />
            </>
          )}

          {outfit === 'neon_hoodie' && (
            <path d="M30 76 Q50 86 70 76" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
          )}

          {/* Gold Chain Accessory */}
          {accessory === 'gold_chain' && (
            <path d="M36 72 Q50 84 64 72" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          )}
        </g>

        {/* --- CHIBI BIG HEAD --- */}
        <g id="head">
          {/* Neck */}
          <rect x="44" y="64" width="12" height="12" fill={skinColor} rx="2" />

          {/* Big Chibi Head Shape */}
          <ellipse cx="50" cy="46" rx="32" ry="27" fill={skinColor} />
          <ellipse cx="50" cy="46" rx="32" ry="27" fill={`url(#chibiShine_${skinColor})`} />

          {/* Blush / Cheek Glow */}
          <ellipse cx="28" cy="54" rx="5" ry="3" fill="#F43F5E" opacity="0.35" />
          <ellipse cx="72" cy="54" rx="5" ry="3" fill="#F43F5E" opacity="0.35" />

          {/* Ears */}
          <circle cx="18" cy="46" r="4.5" fill={skinColor} />
          <circle cx="82" cy="46" r="4.5" fill={skinColor} />
          {accessory === 'diamond_earring' && (
            <circle cx="18" cy="49" r="1.5" fill="#38BDF8" />
          )}

          {/* --- FACE EXPRESSION --- */}
          {expression === 'wink' ? (
            <>
              {/* Left Wink */}
              <path d="M30 46 Q37 40 44 46" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Right Big Chibi Anime Eye */}
              <ellipse cx="64" cy="46" rx="6.5" ry="7.5" fill="#111827" />
              <circle cx="62" cy="43" r="2.5" fill="#FFFFFF" />
              <circle cx="66" cy="48" r="1.2" fill="#FFFFFF" />
            </>
          ) : expression === 'star' ? (
            <>
              <polygon points="36,40 38,44 43,45 39,48 40,53 36,50 32,53 33,48 29,45 34,44" fill="#FBBF24" />
              <polygon points="64,40 66,44 71,45 67,48 68,53 64,50 60,53 61,48 57,45 62,44" fill="#FBBF24" />
            </>
          ) : expression === 'cool' ? (
            <>
              <ellipse cx="36" cy="46" rx="6" ry="6" fill="#111827" />
              <ellipse cx="64" cy="46" rx="6" ry="6" fill="#111827" />
              <circle cx="34" cy="44" r="2" fill="#FFFFFF" />
              <circle cx="62" cy="44" r="2" fill="#FFFFFF" />
            </>
          ) : (
            /* Default Happy Kawaii */
            <>
              <ellipse cx="36" cy="46" rx="6.5" ry="7.5" fill="#111827" />
              <circle cx="34" cy="43" r="2.5" fill="#FFFFFF" />
              <circle cx="38" cy="48" r="1.2" fill="#FFFFFF" />

              <ellipse cx="64" cy="46" rx="6.5" ry="7.5" fill="#111827" />
              <circle cx="62" cy="43" r="2.5" fill="#FFFFFF" />
              <circle cx="66" cy="48" r="1.2" fill="#FFFFFF" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M30 36 Q37 34 44 37" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M56 37 Q63 34 70 36" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Nose */}
          <circle cx="50" cy="51" r="1.2" fill="#BE123C" opacity="0.6" />

          {/* Mouth */}
          {expression === 'cool' ? (
            <path d="M44 58 Q52 56 56 61" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M43 56 Q50 64 57 56" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" fill="#F43F5E" />
          )}

          {/* Glasses */}
          {glasses === 'sunglasses_vip' && (
            <g id="sunglasses">
              <rect x="26" y="40" width="20" height="13" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
              <rect x="54" y="40" width="20" height="13" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
              <line x1="46" y1="46" x2="54" y2="46" stroke="#F59E0B" strokeWidth="2" />
              <line x1="28" y1="43" x2="36" y2="51" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
              <line x1="56" y1="43" x2="64" y2="51" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
            </g>
          )}
        </g>

        {/* --- HAIR STYLE --- */}
        <g id="hair">
          {hairStyle === 'curly_buchon' ? (
            <>
              {/* Curly Buchón Hair */}
              <circle cx="28" cy="24" r="9" fill={hairColor} />
              <circle cx="40" cy="20" r="10" fill={hairColor} />
              <circle cx="52" cy="19" r="10" fill={hairColor} />
              <circle cx="64" cy="21" r="9.5" fill={hairColor} />
              <circle cx="74" cy="26" r="8.5" fill={hairColor} />
              <circle cx="20" cy="34" r="8" fill={hairColor} />
              <circle cx="80" cy="34" r="8" fill={hairColor} />
              <path d="M22 34 C26 28 38 28 44 32 C50 28 62 28 78 34 Z" fill={hairColor} />
            </>
          ) : hairStyle === 'long_straight' ? (
            <>
              {/* Long Straight Hair */}
              <path d="M18 42 L16 80 Q18 86 24 84 L26 44 Z" fill={hairColor} />
              <path d="M82 42 L84 80 Q82 86 76 84 L74 44 Z" fill={hairColor} />
              <path d="M18 42 C20 18 80 18 82 42 C72 26 28 26 18 42 Z" fill={hairColor} />
              <path d="M30 32 Q50 22 70 32" fill={hairColor} />
            </>
          ) : hairStyle === 'anime_spiky' ? (
            <>
              <polygon points="20,38 14,20 28,26" fill={hairColor} />
              <polygon points="28,26 34,14 44,22" fill={hairColor} />
              <polygon points="44,22 52,10 60,22" fill={hairColor} />
              <polygon points="60,22 70,14 74,28" fill={hairColor} />
              <polygon points="74,28 86,22 80,40" fill={hairColor} />
              <path d="M22 38 Q50 26 78 38" fill={hairColor} />
            </>
          ) : (
            /* Default Urban Fade */
            <>
              <path d="M18 42 C18 20 30 14 50 14 C70 14 82 20 82 42 C76 28 64 24 50 24 C36 24 24 28 18 42 Z" fill={hairColor} />
              <path d="M20 40 Q50 28 80 40" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* --- HEADWEAR --- */}
        {headwear === 'jgl_cap' && (
          <g id="cap">
            <path d="M18 34 C20 18 34 14 50 14 C66 14 80 18 82 34 Z" fill="#18181B" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M44 32 Q78 30 88 38 Q60 42 38 36 Z" fill="#27272A" stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="42" y="18" width="16" height="10" rx="2" fill="#F59E0B" />
            <text x="44" y="26" fill="#000" fontSize="7" fontWeight="bold">701</text>
          </g>
        )}

        {headwear === 'golden_crown' && (
          <g id="crown">
            <polygon points="26,24 32,8 42,18 50,4 58,18 68,8 74,24" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="50" cy="4" r="2.5" fill="#EF4444" />
            <circle cx="32" cy="8" r="2" fill="#3B82F6" />
            <circle cx="68" cy="8" r="2" fill="#10B981" />
          </g>
        )}

        {headwear === 'vaquero_hat' && (
          <g id="vaquero">
            <ellipse cx="50" cy="24" rx="38" ry="8" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <path d="M34 22 Q50 6 66 22 Z" fill="#D97706" />
          </g>
        )}
      </svg>
    </div>
  );
};
