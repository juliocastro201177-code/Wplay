import React from 'react';

interface GiftSvgIconProps {
  iconType: string;
  className?: string;
  size?: number;
}

export const GiftSvgIcon: React.FC<GiftSvgIconProps> = ({ iconType, className = '', size = 48 }) => {
  switch (iconType) {
    case 'crystal_rose':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="rosePetal" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9ED2" />
              <stop offset="0.5" stopColor="#FF2E9D" />
              <stop offset="1" stopColor="#B0005D" />
            </linearGradient>
            <linearGradient id="roseStem" x1="32" y1="40" x2="32" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#065F46" />
            </linearGradient>
          </defs>
          <path d="M32 38 Q30 52 32 60" stroke="url(#roseStem)" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 46 Q42 42 46 48 Q38 52 32 48" fill="#10B981" />
          <circle cx="32" cy="24" r="14" fill="url(#rosePetal)" />
          <path d="M26 18 C22 24 24 32 32 34 C40 32 42 24 38 18 C34 22 30 22 26 18 Z" fill="#FFA5D8" opacity="0.8" />
          <path d="M30 16 Q32 10 36 14 Q32 18 30 16" fill="#FFFFFF" opacity="0.9" />
          <circle cx="24" cy="16" r="1.5" fill="#FFFFFF" />
          <circle cx="42" cy="28" r="2" fill="#FFFFFF" />
        </svg>
      );

    case 'barrios_crown':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="goldCrown" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <path d="M8 44 L14 18 L24 30 L32 14 L40 30 L50 18 L56 44 Z" fill="url(#goldCrown)" stroke="#78350F" strokeWidth="1.5" />
          <rect x="8" y="44" width="48" height="8" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="14" cy="18" r="3.5" fill="#EF4444" stroke="#FFF" strokeWidth="1" />
          <circle cx="32" cy="14" r="4" fill="#3B82F6" stroke="#FFF" strokeWidth="1" />
          <circle cx="50" cy="18" r="3.5" fill="#10B981" stroke="#FFF" strokeWidth="1" />
          <circle cx="20" cy="48" r="2" fill="#FFFFFF" />
          <circle cx="32" cy="48" r="2.5" fill="#EC4899" />
          <circle cx="44" cy="48" r="2" fill="#FFFFFF" />
        </svg>
      );

    case 'italika_moto':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="motoRed" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#EF4444" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          {/* Wheels */}
          <circle cx="15" cy="44" r="10" fill="#1F2937" stroke="#9CA3AF" strokeWidth="2.5" />
          <circle cx="49" cy="44" r="10" fill="#1F2937" stroke="#9CA3AF" strokeWidth="2.5" />
          <circle cx="15" cy="44" r="4" fill="#E5E7EB" />
          <circle cx="49" cy="44" r="4" fill="#E5E7EB" />
          {/* Body frame */}
          <path d="M15 44 L26 34 L40 34 L49 44" stroke="#4B5563" strokeWidth="3" />
          <path d="M22 34 L30 22 L44 24 L48 34 Z" fill="url(#motoRed)" />
          {/* Handlebar & light */}
          <path d="M38 22 L44 14" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="46" cy="23" rx="3" ry="2" fill="#FDE047" />
          {/* Exhaust smoke */}
          <circle cx="8" cy="40" r="3" fill="#A855F7" opacity="0.6" />
          <circle cx="4" cy="36" r="2" fill="#EC4899" opacity="0.4" />
        </svg>
      );

    case 'buchona_truck':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="truckMetal" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#047857" />
              <stop offset="1" stopColor="#064E3B" />
            </linearGradient>
          </defs>
          {/* Truck Body */}
          <rect x="8" y="24" width="22" height="18" fill="#1E293B" rx="2" />
          <path d="M26 24 L36 14 L50 14 L56 26 L56 42 L8 42 Z" fill="url(#truckMetal)" />
          {/* Tinted glass */}
          <polygon points="36,16 48,16 52,25 36,25" fill="#0F172A" />
          {/* Big Offroad Wheels */}
          <circle cx="16" cy="44" r="9" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="46" cy="44" r="9" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="16" cy="44" r="3" fill="#E2E8F0" />
          <circle cx="46" cy="44" r="3" fill="#E2E8F0" />
          {/* Grill & Headlight */}
          <rect x="54" y="28" width="4" height="10" fill="#CBD5E1" rx="1" />
          <circle cx="54" cy="30" r="2" fill="#FEF08A" />
        </svg>
      );

    case 'castillo_culiacan':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="mansionWall" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect x="14" y="24" width="36" height="30" fill="url(#mansionWall)" rx="2" />
          {/* Towers */}
          <rect x="8" y="16" width="10" height="38" fill="#FBBF24" />
          <polygon points="8,16 13,8 18,16" fill="#DC2626" />
          <rect x="46" y="16" width="10" height="38" fill="#FBBF24" />
          <polygon points="46,16 51,8 56,16" fill="#DC2626" />
          {/* Center dome */}
          <path d="M22 24 C22 14 42 14 42 24 Z" fill="#DC2626" />
          {/* Arch door & gold gates */}
          <path d="M26 54 L26 40 C26 36 38 36 38 40 L38 54 Z" fill="#78350F" />
          <circle cx="32" cy="12" r="2" fill="#FDE047" />
        </svg>
      );

    case 'dollar_rain':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="10" y="16" width="28" height="16" rx="2" fill="#10B981" stroke="#047857" strokeWidth="1.5" transform="rotate(-12 10 16)" />
          <circle cx="22" cy="22" r="4" fill="#047857" opacity="0.3" />
          <rect x="26" y="32" width="30" height="17" rx="2" fill="#34D399" stroke="#059669" strokeWidth="1.5" transform="rotate(15 26 32)" />
          <text x="36" y="44" fill="#064E3B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">$</text>
          <circle cx="16" cy="48" r="3" fill="#FDE047" />
          <circle cx="48" cy="16" r="2.5" fill="#FDE047" />
        </svg>
      );

    case 'flying_kiss':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="lipsGrad" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#FF2E9D" />
              <stop offset="1" stopColor="#E11D48" />
            </linearGradient>
          </defs>
          <path d="M12 32 C18 20 28 26 32 30 C36 26 46 20 52 32 C42 36 36 34 32 33 C28 34 22 36 12 32 Z" fill="url(#lipsGrad)" />
          <path d="M16 32 C22 46 42 46 48 32 C40 37 24 37 16 32 Z" fill="#BE123C" />
          {/* Wings */}
          <path d="M14 26 Q4 18 6 10 Q14 14 16 22" fill="#FBCFE8" opacity="0.8" />
          <path d="M50 26 Q60 18 58 10 Q50 14 48 22" fill="#FBCFE8" opacity="0.8" />
          <circle cx="38" cy="26" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'armored_heart':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="heartRed" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#881337" />
            </linearGradient>
          </defs>
          <path d="M32 54 C16 42 8 30 8 20 C8 12 16 8 22 8 C27 8 30 11 32 14 C34 11 37 8 42 8 C48 8 56 12 56 20 C56 30 48 42 32 54 Z" fill="url(#heartRed)" />
          {/* Gold Chains */}
          <path d="M12 22 L52 38" stroke="#FBBF24" strokeWidth="4" strokeDasharray="3 3" />
          <path d="M14 38 L50 20" stroke="#FBBF24" strokeWidth="4" strokeDasharray="3 3" />
          <rect x="28" y="26" width="8" height="10" rx="1.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          <circle cx="32" cy="30" r="1.5" fill="#1E293B" />
        </svg>
      );

    case 'champagne_pop':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M36 18 L46 28 L30 50 C26 54 20 54 16 50 C12 46 12 40 16 36 Z" fill="#047857" stroke="#064E3B" strokeWidth="1.5" />
          <rect x="34" y="14" width="6" height="8" rx="1" fill="#FBBF24" transform="rotate(45 34 14)" />
          {/* Champagne Bubbles */}
          <circle cx="48" cy="14" r="3" fill="#FDE047" />
          <circle cx="56" cy="10" r="4" fill="#FEF08A" />
          <circle cx="52" cy="22" r="2.5" fill="#FDE047" />
          <circle cx="42" cy="8" r="2" fill="#FFFFFF" />
          <path d="M22 40 L28 46" stroke="#FEF08A" strokeWidth="2" />
        </svg>
      );

    case 'avatar_fire':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="fireGrad" x1="0" y1="64" x2="0" y2="0">
              <stop stopColor="#EA580C" />
              <stop offset="0.6" stopColor="#FBBF24" />
              <stop offset="1" stopColor="#FEF08A" />
            </linearGradient>
          </defs>
          <path d="M32 6 C38 18 52 24 52 40 C52 52 42 58 32 58 C22 58 12 52 12 40 C12 28 22 22 28 14 C28 22 34 26 32 6 Z" fill="url(#fireGrad)" />
          <path d="M32 26 C36 32 42 36 42 44 C42 50 38 54 32 54 C26 54 22 50 22 44 C22 38 28 34 30 30 Z" fill="#EF4444" opacity="0.8" />
          <circle cx="32" cy="46" r="4" fill="#FFFFFF" />
        </svg>
      );

    case 'golden_ak':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="goldAk" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#FEF08A" />
              <stop offset="0.4" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#78350F" />
            </linearGradient>
          </defs>
          {/* Barrel & Body */}
          <rect x="8" y="28" width="42" height="6" rx="1" fill="url(#goldAk)" />
          <rect x="44" y="26" width="12" height="3" fill="#D97706" />
          {/* Magazine curved */}
          <path d="M30 34 Q34 46 40 48 L36 50 Q30 46 26 34 Z" fill="url(#goldAk)" />
          {/* Stock */}
          <polygon points="8,28 8,42 16,34 16,28" fill="#B45309" />
          {/* Grip */}
          <rect x="22" y="34" width="5" height="10" rx="1" fill="#92400E" transform="rotate(-15 22 34)" />
          {/* Sparkles */}
          <polygon points="56,22 58,26 62,28 58,30 56,34 54,30 50,28 54,26" fill="#FDE047" />
        </svg>
      );

    case 'jgl_cap':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Cap dome */}
          <path d="M12 36 C12 20 22 14 34 14 C44 14 50 20 52 36 Z" fill="#18181B" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Curved Visor */}
          <path d="M38 34 Q56 34 60 42 Q40 44 26 38 Z" fill="#27272A" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Golden Badge / JGL Embroidery */}
          <rect x="24" y="20" width="14" height="10" rx="2" fill="#F59E0B" />
          <text x="26" y="28" fill="#000000" fontSize="7" fontWeight="bold" fontFamily="sans-serif">701</text>
        </svg>
      );

    case 'shiny_rolex':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="rolexPlat" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#E0F2FE" />
              <stop offset="0.5" stopColor="#38BDF8" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          {/* Metal Band */}
          <rect x="25" y="8" width="14" height="48" rx="3" fill="#64748B" />
          {/* Dial bezel with diamonds */}
          <circle cx="32" cy="32" r="16" fill="url(#rolexPlat)" stroke="#FDE047" strokeWidth="3" />
          <circle cx="32" cy="32" r="11" fill="#0F172A" />
          {/* Watch hands & crown */}
          <path d="M32 32 L32 24" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 32 L38 34" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="2" fill="#EF4444" />
          <circle cx="48" cy="32" r="2" fill="#F59E0B" />
        </svg>
      );

    case 'cash_bundles':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Bundle 1 */}
          <rect x="10" y="34" width="36" height="16" rx="2" fill="#059669" stroke="#064E3B" strokeWidth="1.5" />
          <rect x="24" y="34" width="8" height="16" fill="#FDE047" opacity="0.8" />
          {/* Bundle 2 */}
          <rect x="16" y="24" width="36" height="16" rx="2" fill="#10B981" stroke="#064E3B" strokeWidth="1.5" />
          <rect x="30" y="24" width="8" height="16" fill="#FDE047" opacity="0.8" />
          {/* Bundle 3 top */}
          <rect x="22" y="14" width="36" height="16" rx="2" fill="#34D399" stroke="#064E3B" strokeWidth="1.5" />
          <rect x="36" y="14" width="8" height="16" fill="#FDE047" opacity="0.8" />
          <text x="26" y="25" fill="#064E3B" fontSize="8" fontWeight="bold">100</text>
        </svg>
      );

    case 'military_heli':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Rotor blade */}
          <line x1="6" y1="14" x2="58" y2="14" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <rect x="30" y="14" width="4" height="6" fill="#334155" />
          {/* Body */}
          <ellipse cx="28" cy="28" rx="18" ry="12" fill="#334155" />
          <path d="M12 28 Q44 28 56 22 L56 16 Z" fill="#1E293B" />
          {/* Tail rotor */}
          <circle cx="56" cy="19" r="4" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          {/* Cockpit glass */}
          <path d="M14 24 Q18 20 26 20 L26 30 Q16 30 14 24 Z" fill="#38BDF8" opacity="0.85" />
          {/* Landing skid */}
          <line x1="16" y1="44" x2="40" y2="44" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="38" x2="20" y2="44" stroke="#64748B" strokeWidth="2" />
          <line x1="34" y1="38" x2="34" y2="44" stroke="#64748B" strokeWidth="2" />
        </svg>
      );

    case 'buchon_roses':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Wrapping paper */}
          <polygon points="12,30 32,58 52,30" fill="#18181B" stroke="#F59E0B" strokeWidth="2" />
          {/* Ribbon */}
          <ellipse cx="32" cy="44" rx="6" ry="3" fill="#DC2626" />
          {/* Roses bouquet dome */}
          <circle cx="22" cy="24" r="8" fill="#E11D48" />
          <circle cx="32" cy="18" r="9" fill="#BE123C" />
          <circle cx="42" cy="24" r="8" fill="#E11D48" />
          <circle cx="28" cy="28" r="7" fill="#9F1239" />
          <circle cx="36" cy="28" r="7" fill="#9F1239" />
          {/* Crown on top */}
          <polygon points="26,14 29,8 32,12 35,8 38,14" fill="#FBBF24" />
        </svg>
      );

    case 'engagement_ring':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Ring band */}
          <ellipse cx="32" cy="38" rx="16" ry="12" stroke="#FBBF24" strokeWidth="4" fill="none" />
          {/* Diamond setting */}
          <polygon points="24,18 40,18 46,26 32,40 18,26" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="28,18 36,18 38,24 32,34 26,24" fill="#BAE6FD" />
          <circle cx="32" cy="24" r="2" fill="#FFFFFF" />
          {/* Sparkles */}
          <circle cx="16" cy="16" r="2" fill="#38BDF8" />
          <circle cx="48" cy="14" r="2.5" fill="#38BDF8" />
        </svg>
      );

    case 'knife_teddy':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Ears */}
          <circle cx="20" cy="18" r="6" fill="#F472B6" />
          <circle cx="44" cy="18" r="6" fill="#F472B6" />
          {/* Head & Body */}
          <circle cx="32" cy="42" r="14" fill="#F472B6" />
          <circle cx="32" cy="26" r="13" fill="#F9A8D4" />
          {/* Eyes & nose */}
          <circle cx="28" cy="24" r="2" fill="#1F2937" />
          <circle cx="36" cy="24" r="2" fill="#1F2937" />
          <ellipse cx="32" cy="28" rx="2" ry="1.5" fill="#BE185D" />
          {/* Toy Knife in hand */}
          <rect x="44" y="34" width="4" height="8" rx="1" fill="#92400E" />
          <polygon points="44,34 48,34 46,20" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          {/* Cool backward cap */}
          <path d="M22 18 Q32 12 42 18" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'love_letter':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="10" y="20" width="44" height="30" rx="3" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="2" />
          <polygon points="10,20 32,38 54,20" fill="#FFE4E6" stroke="#FDA4AF" strokeWidth="1.5" />
          <circle cx="32" cy="38" r="6" fill="#F43F5E" />
          <path d="M30 37 C30 35 34 35 34 37 C34 40 32 41 32 41 C32 41 30 40 30 37 Z" fill="#FFFFFF" />
        </svg>
      );

    case 'kisses_shower':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M16 22 C18 16 24 18 26 20 C28 18 34 16 36 22 C30 26 26 24 26 24 C26 24 22 26 16 22 Z" fill="#FF2E9D" />
          <path d="M34 38 C36 32 42 34 44 36 C46 34 52 32 54 38 C48 42 44 40 44 40 C44 40 40 42 34 38 Z" fill="#F43F5E" />
          <path d="M12 42 C14 36 20 38 22 40 C24 38 30 36 32 42 C26 46 22 44 22 44 C22 44 18 46 12 42 Z" fill="#FB7185" />
          <circle cx="44" cy="18" r="2" fill="#FF2E9D" />
        </svg>
      );

    case 'bucanas_bottle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="whiskeyGlass" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#047857" />
              <stop offset="0.6" stopColor="#065F46" />
              <stop offset="1" stopColor="#064E3B" />
            </linearGradient>
          </defs>
          <rect x="26" y="10" width="12" height="12" fill="#F59E0B" />
          <rect x="20" y="20" width="24" height="34" rx="4" fill="url(#whiskeyGlass)" stroke="#064E3B" strokeWidth="2" />
          {/* Label */}
          <rect x="23" y="28" width="18" height="16" fill="#FEF3C7" rx="1" />
          <text x="25" y="38" fill="#78350F" fontSize="6" fontWeight="bold">BUCA</text>
          {/* Seal */}
          <circle cx="32" cy="46" r="3" fill="#DC2626" />
        </svg>
      );

    case 'bass_speaker':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="14" y="10" width="36" height="44" rx="4" fill="#18181B" stroke="#8B5CF6" strokeWidth="2" />
          <circle cx="32" cy="22" r="5" fill="#3B82F6" />
          {/* Big Subwoofer */}
          <circle cx="32" cy="38" r="11" fill="#4C1D95" stroke="#A78BFA" strokeWidth="2.5" />
          <circle cx="32" cy="38" r="4" fill="#C4B5FD" />
          {/* Sound waves */}
          <path d="M52 24 Q58 32 52 40" stroke="#C084FC" strokeWidth="2" fill="none" />
          <path d="M12 24 Q6 32 12 40" stroke="#C084FC" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'caguama_cold':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="28" y="10" width="8" height="12" fill="#78350F" />
          <rect x="22" y="20" width="20" height="34" rx="4" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          {/* White label */}
          <rect x="24" y="30" width="16" height="14" fill="#FEF08A" rx="1" />
          {/* Cold frost / water drops */}
          <circle cx="26" cy="24" r="1.5" fill="#E0F2FE" />
          <circle cx="38" cy="26" r="1.5" fill="#E0F2FE" />
          <circle cx="38" cy="48" r="1.5" fill="#E0F2FE" />
          {/* Crown cap */}
          <rect x="27" y="8" width="10" height="3" fill="#D97706" rx="1" />
        </svg>
      );

    case 'sombrero_botas':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Sombrero */}
          <ellipse cx="32" cy="22" rx="24" ry="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
          <path d="M22 20 Q32 8 42 20 Z" fill="#D97706" />
          {/* Boots */}
          <path d="M20 32 L20 48 L28 48 Q28 42 24 40 L24 32 Z" fill="#78350F" />
          <path d="M34 32 L34 48 L42 48 Q42 42 38 40 L38 32 Z" fill="#78350F" />
        </svg>
      );

    case 'golden_mic':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="20" rx="9" ry="12" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
          <line x1="24" y1="20" x2="40" y2="20" stroke="#78350F" strokeWidth="1" />
          <line x1="32" y1="8" x2="32" y2="32" stroke="#78350F" strokeWidth="1" />
          <rect x="29" y="32" width="6" height="20" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
          {/* Notes */}
          <circle cx="16" cy="16" r="2.5" fill="#FDE047" />
          <path d="M18 16 L18 8 L24 6" stroke="#FDE047" strokeWidth="1.5" />
        </svg>
      );

    case 'beach_mansion':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="poolGrad" x1="0" y1="0" x2="64" y2="0">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* Modern Villa */}
          <rect x="12" y="16" width="34" height="26" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="18" y="22" width="12" height="12" fill="#0284C7" opacity="0.8" />
          <rect x="32" y="22" width="10" height="20" fill="#0F172A" />
          {/* Infinity Pool */}
          <ellipse cx="32" cy="48" rx="22" ry="8" fill="url(#poolGrad)" />
          {/* Palm tree */}
          <path d="M50 46 Q48 28 52 20" stroke="#78350F" strokeWidth="2.5" />
          <path d="M52 20 Q44 14 42 22" stroke="#10B981" strokeWidth="2.5" />
          <path d="M52 20 Q58 14 62 20" stroke="#10B981" strokeWidth="2.5" />
        </svg>
      );

    case 'private_jet':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Fuselage */}
          <path d="M10 32 L46 22 Q58 20 60 26 Q56 34 46 36 L10 36 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Swept Wings */}
          <polygon points="26,30 36,10 44,26" fill="#818CF8" />
          <polygon points="26,36 36,54 44,36" fill="#6366F1" />
          {/* Tail fin */}
          <polygon points="12,32 6,18 16,32" fill="#4F46E5" />
          {/* Cockpit windows */}
          <ellipse cx="52" cy="25" rx="3" ry="2" fill="#0284C7" />
        </svg>
      );

    case 'cartel_lion':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Mane */}
          <circle cx="32" cy="34" r="18" fill="#F59E0B" />
          {/* Face */}
          <circle cx="32" cy="34" r="12" fill="#FEF3C7" />
          <circle cx="27" cy="30" r="2" fill="#1F2937" />
          <circle cx="37" cy="30" r="2" fill="#1F2937" />
          <polygon points="30,36 34,36 32,39" fill="#DC2626" />
          {/* Crown */}
          <polygon points="22,18 26,10 32,15 38,10 42,18" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="32" cy="14" r="2" fill="#DC2626" />
        </svg>
      );

    case 'buchon_universe':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="galaxyGrad" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#9333EA" />
              <stop offset="0.5" stopColor="#C084FC" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="15" fill="url(#galaxyGrad)" />
          {/* Planetary rings */}
          <ellipse cx="32" cy="32" rx="26" ry="7" stroke="#FDE047" strokeWidth="3" fill="none" transform="rotate(-25 32 32)" />
          <circle cx="16" cy="18" r="2" fill="#FFFFFF" />
          <circle cx="48" cy="46" r="2" fill="#FFFFFF" />
          <circle cx="44" cy="16" r="1.5" fill="#F43F5E" />
        </svg>
      );

    case 'server_god':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="throneGrad" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#FDE047" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Throne backrest */}
          <path d="M16 10 L32 4 L48 10 L44 42 L20 42 Z" fill="url(#throneGrad)" stroke="#78350F" strokeWidth="2" />
          {/* Ruby center */}
          <polygon points="32,16 36,22 32,28 28,22" fill="#DC2626" />
          {/* Throne arms & base */}
          <rect x="12" y="38" width="40" height="18" rx="3" fill="#B45309" />
          <rect x="18" y="34" width="28" height="8" rx="2" fill="#F59E0B" />
          {/* Aura rays */}
          <line x1="32" y1="2" x2="32" y2="0" stroke="#FDE047" strokeWidth="2" />
          <line x1="12" y1="6" x2="8" y2="4" stroke="#FDE047" strokeWidth="2" />
          <line x1="52" y1="6" x2="56" y2="4" stroke="#FDE047" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="24" fill="#FF2E9D" />
          <polygon points="32,16 36,26 46,26 38,34 42,44 32,38 22,44 26,34 18,26 28,26" fill="#FDE047" />
        </svg>
      );
  }
};
