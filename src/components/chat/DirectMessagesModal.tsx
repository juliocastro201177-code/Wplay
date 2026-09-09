import React, { useState } from 'react';
import { X, Send, Phone, Gift as GiftIcon, Mic, Smile } from 'lucide-react';
import { User } from '../../types';
import { ChibiAvatar } from '../avatar/ChibiAvatar';
import { playSound } from '../../utils/audio';

interface DirectMessagesModalProps {
  currentUser: User;
  targetUser: { uid: string; nickname: string; level?: number };
  onClose: () => void;
  onSendGiftToUser: (targetName: string) => void;
  onOpenCoupleIsland?: () => void;
}

export const DirectMessagesModal: React.FC<DirectMessagesModalProps> = ({
  currentUser,
  targetUser,
  onClose,
  onSendGiftToUser,
  onOpenCoupleIsland,
}) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: targetUser.nickname, text: '¡Hola! Nos tocó juntos en la sala de voz 😊' },
    { id: '2', sender: currentUser.nickname, text: '¡Qué onda! Súper divertido el juego 🎨' },
  ]);
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    playSound('click');
    const myMsg = { id: Date.now().toString(), sender: currentUser.nickname, text: text.trim() };
    setMessages((prev) => [...prev, myMsg]);
    setText('');

    // Simulated reply
    setTimeout(() => {
      playSound('pop');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: targetUser.nickname,
          text: '¡Oye vamos a jugar otra ronda de Draw & Guess o Tumba la Botella! 🍾',
        },
      ]);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#2D1B4E] to-[#1A0B2E] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-4 py-3 bg-[#1A0B2E]/90 border-b border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF2E9D] to-[#8B5CF6] flex items-center justify-center text-sm font-black text-white">
              {targetUser.nickname.charAt(0)}
            </div>
            <div>
              <div className="font-heading font-black text-xs text-white flex items-center gap-1.5">
                <span>{targetUser.nickname}</span>
                <span className="text-[9px] text-emerald-400 font-bold">● En línea</span>
              </div>
              <span className="text-[10px] text-purple-300">Chat Privado Seguro</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenCoupleIsland && (
              <button
                onClick={() => {
                  playSound('romance');
                  onOpenCoupleIsland();
                }}
                className="p-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 border border-pink-500/40 transition flex items-center gap-1 text-[10px] font-bold px-2"
                title="Isla de Parejas"
              >
                <span>🏝️</span>
                <span>Isla</span>
              </button>
            )}
            <button
              onClick={() => {
                playSound('coin');
                alert(`Iniciando llamada de voz 1 a 1 con ${targetUser.nickname}...`);
              }}
              className="p-1.5 rounded-full bg-purple-900/60 hover:bg-purple-800 text-purple-200 transition"
              title="Llamada de voz 1 a 1"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {messages.map((m) => {
            const isMe = m.sender === currentUser.nickname;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-purple-950/70 border border-purple-800/40 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#1A0B2E] border-t border-purple-800/40 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              onSendGiftToUser(targetUser.nickname);
            }}
            className="p-2 rounded-xl bg-amber-500/20 text-yellow-400 hover:bg-amber-500/30 transition"
            title="Enviar Regalo Privado"
          >
            <GiftIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Mensaje privado..."
            className="flex-1 bg-white/5 border border-purple-600/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#FF2E9D]"
          />

          <button
            type="submit"
            className="p-2 rounded-xl bg-[#FF2E9D] hover:bg-pink-600 text-white shadow-md transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
