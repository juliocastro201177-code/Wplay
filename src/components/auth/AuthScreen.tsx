import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Gender, ChibiAvatarConfig } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { playSound } from '../../utils/audio';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  // Splash phase (2 seconds)
  const [showSplash, setShowSplash] = useState(true);
  const [authStep, setAuthStep] = useState<'options' | 'phone_otp' | 'profile_setup'>('options');

  // Phone OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Profile setup
  const [nickname, setNickname] = useState('Chibi_Gamer_2026');
  const [gender, setGender] = useState<Gender>('female');
  const [birthDate, setBirthDate] = useState('2004-05-18');
  const [avatarConfig, setAvatarConfig] = useState<ChibiAvatarConfig>({
    skinColor: '#FBD1A2',
    hairStyle: 'urban_fade',
    hairColor: '#FF2E9D',
    expression: 'happy',
    outfit: 'neon_hoodie',
    outfitColor: '#FF2E9D',
    headwear: 'none',
    glasses: 'none',
    accessory: 'gold_chain',
  });

  useEffect(() => {
    // 2s splash
    const timer = setTimeout(() => {
      setShowSplash(false);
      playSound('pop');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGuestLogin = () => {
    playSound('coin');
    const guestUser: User = {
      uid: 'guest_' + Math.floor(Math.random() * 1000000),
      idNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      nickname: 'WePlayer_' + Math.floor(Math.random() * 9000),
      avatarUrl: '',
      avatarConfig: {
        skinColor: '#FBD1A2',
        hairStyle: 'urban_fade',
        hairColor: '#18181B',
        expression: 'happy',
        outfit: 'neon_hoodie',
        outfitColor: '#FF2E9D',
        headwear: 'none',
        glasses: 'none',
        accessory: 'gold_chain',
      },
      gender: 'male',
      coins: 5000,
      diamonds: 200,
      level: 1,
      vip: false,
      frameId: 'default',
      bubbleId: 'bubble_default',
      enterEffectId: 'effect_hearts',
      bio: '¡Hola! Acabo de llegar a WePlay LATAM 2026 🎮',
      city: 'CDMX, México',
      zodiacSign: 'Tauro ♉',
      birthDate: '2003-08-20',
      friendsCount: 12,
      followingCount: 30,
      followersCount: 45,
      wealthLevel: 1,
    };

    confetti({ particleCount: 50, spread: 60 });
    onLoginSuccess(guestUser);
  };

  const handleGoogleLogin = () => {
    playSound('coin');
    setAuthStep('profile_setup');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    playSound('click');
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    playSound('coin');
    setAuthStep('profile_setup');
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    playSound('gift_huge');
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });

    const newUser: User = {
      uid: 'user_' + Date.now(),
      idNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      nickname: nickname.trim(),
      avatarUrl: '',
      avatarConfig,
      gender,
      birthDate,
      coins: 10000, // Welcome bonus
      diamonds: 350,
      level: 5,
      vip: true, // Free starter VIP
      frameId: 'vip_gold',
      bubbleId: 'bubble_pink_neon',
      enterEffectId: 'effect_hearts',
      bio: '¡Listo para el desmadre y los party games! 🖤',
      city: 'Guadalajara, México',
      zodiacSign: 'Géminis ♊',
      friendsCount: 24,
      followingCount: 52,
      followersCount: 110,
      wealthLevel: 3,
    };

    onLoginSuccess(newUser);
  };

  // Splash Screen Animation
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1A0B2E] via-[#2A0845] to-[#120422] text-white">
        <div className="relative flex flex-col items-center animate-bounce">
          {/* Neon Logo Badge */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#FF2E9D] to-[#8B5CF6] flex items-center justify-center text-5xl shadow-[0_0_50px_#FF2E9D] border-2 border-white/40">
            🎙️
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-yellow-300 mt-6 drop-shadow-lg">
            WePlay LATAM
          </h1>
          <p className="text-xs font-bold text-pink-300 tracking-[0.25em] uppercase mt-1">
            Party Game & Voice Chat 2026
          </p>
        </div>

        <div className="absolute bottom-10 flex flex-col items-center">
          <div className="w-6 h-6 border-2 border-[#FF2E9D] border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] text-purple-300 mt-3 font-mono">Conectando con servidores LATAM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-[#1A0B2E] via-[#2D1B4E] to-[#120422] p-4 select-none">
      <div className="w-full max-w-md bg-[#25133E]/90 border border-purple-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF2E9D] to-[#8B5CF6] flex items-center justify-center text-2xl shadow-lg neon-glow-pink">
            🎙️
          </div>
          <h2 className="font-heading font-black text-2xl text-white mt-3">WePlay LATAM 2026</h2>
          <p className="text-xs text-purple-300 mt-0.5">Voz en Vivo, Regalos 3D y Party Games</p>
        </div>

        {/* Step 1: Login Options */}
        {authStep === 'options' && (
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-2xl bg-white text-gray-900 font-heading font-black text-xs flex items-center justify-center gap-3 shadow-lg hover:bg-gray-100 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar con Google</span>
            </button>

            {/* Phone */}
            <button
              onClick={() => {
                playSound('click');
                setAuthStep('phone_otp');
              }}
              className="w-full py-3.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-white font-heading font-black text-xs flex items-center justify-center gap-3 border border-purple-500/30 transition"
            >
              <Phone className="w-4 h-4 text-pink-400" />
              <span>Continuar con Número de Teléfono</span>
            </button>

            {/* Guest Mode */}
            <div className="pt-2">
              <button
                onClick={handleGuestLogin}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white font-heading font-black text-xs flex items-center justify-center gap-2 shadow-xl neon-glow-pink hover:opacity-95 transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Entrar en Modo Invitado (Rápido)</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center pt-3 leading-relaxed">
              Al ingresar aceptas los Términos de Servicio y Normas Comunitarias WePlay LATAM 2026.
            </p>
          </div>
        )}

        {/* Step 2: Phone OTP */}
        {authStep === 'phone_otp' && (
          <div className="space-y-4">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Número de Celular (con código de país)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+52 55 1234 5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2E9D]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF2E9D] text-white font-black text-xs shadow-md neon-glow-pink"
                >
                  Enviar Código SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="text-xs text-purple-300">
                  Código de verificación enviado a <strong>{phoneNumber}</strong>:
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Código de 6 dígitos (ej: 123456)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3.5 py-2.5 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#FF2E9D]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF2E9D] text-white font-black text-xs shadow-md neon-glow-pink"
                >
                  Verificar y Continuar
                </button>
              </form>
            )}

            <button
              onClick={() => setAuthStep('options')}
              className="text-[11px] text-purple-300 hover:underline block text-center w-full"
            >
              ← Volver
            </button>
          </div>
        )}

        {/* Step 3: First-time Profile Setup */}
        {authStep === 'profile_setup' && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div className="flex flex-col items-center">
              <ChibiAvatar config={avatarConfig} size={84} frameId="vip_gold" />
              <span className="text-[10px] text-pink-300 font-bold mt-2">
                Tu Avatar Chibi 3D Inicial
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Tu Nickname</label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2E9D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Género</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGender('female');
                      setAvatarConfig({ ...avatarConfig, hairStyle: 'long_straight' });
                    }}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${
                      gender === 'female'
                        ? 'border-[#FF2E9D] bg-pink-500/20 text-white'
                        : 'border-white/10 text-gray-400'
                    }`}
                  >
                    Mujer ♀
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGender('male');
                      setAvatarConfig({ ...avatarConfig, hairStyle: 'curly_buchon' });
                    }}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${
                      gender === 'male'
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-white/10 text-gray-400'
                    }`}
                  >
                    Hombre ♂
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Fecha Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#1A0B2E] border border-purple-600/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF2E9D]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E9D] to-[#8B5CF6] text-white font-heading font-black text-xs shadow-xl neon-glow-pink hover:opacity-95 transition"
            >
              ¡Comenzar Fiesta en WePlay! 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
