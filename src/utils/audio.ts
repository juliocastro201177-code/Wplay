/**
 * Web Audio API synthesizer and speech announcer for WePlay Clone LATAM.
 * Zero external audio assets needed; all effects generated with mathematical oscillators and filters.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = (type: 'coin' | 'gift_small' | 'gift_huge' | 'pop' | 'bell' | 'engine' | 'bass' | 'win' | 'click' | 'correct' | 'buzz' | 'swords' | 'romance' | 'island' | 'camera' | 'dice' | 'applause' | 'laughter' | 'fart' | 'drumroll' | 'horn' | 'splat') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'coin': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.35);
        break;
      }
      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
      case 'gift_small': {
        // Sparkle arpeggio
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.06);
          gain.gain.setValueAtTime(0.18, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.25);
        });
        break;
      }
      case 'gift_huge': {
        // Regal fanfare & bass drop
        const oscBass = ctx.createOscillator();
        const gainBass = ctx.createGain();
        oscBass.type = 'sawtooth';
        oscBass.frequency.setValueAtTime(160, now);
        oscBass.frequency.exponentialRampToValueAtTime(45, now + 0.8);
        gainBass.gain.setValueAtTime(0.35, now);
        gainBass.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        oscBass.connect(gainBass);
        gainBass.connect(ctx.destination);
        oscBass.start(now);
        oscBass.stop(now + 1.2);

        // Chimes chord
        [587.33, 739.99, 880.00, 1174.66, 1479.98].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + 0.15 + idx * 0.05);
          gain.gain.setValueAtTime(0.25, now + 0.15 + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.15 + idx * 0.05);
          osc.stop(now + 1.6);
        });
        break;
      }
      case 'engine': {
        // Troka / Italika revving sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.4);
        osc.frequency.linearRampToValueAtTime(140, now + 0.8);
        osc.frequency.linearRampToValueAtTime(320, now + 1.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.0);
        break;
      }
      case 'bass': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.7);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
      case 'correct': {
        const freqs = [440, 554.37, 659.25, 880];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.07);
          gain.gain.setValueAtTime(0.2, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.3);
        });
        break;
      }
      case 'win': {
        const freqs = [392, 523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0.25, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.6);
        });
        break;
      }
      case 'buzz': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'swords': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'romance': {
        // Magical romantic chime arpeggio: F5 -> A5 -> C6 -> E6 -> A6
        const notes = [698.46, 880.00, 1046.50, 1318.51, 1760.00];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.18, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.6);
        });
        break;
      }
      case 'island': {
        // Warm tropical marimba / ocean breeze tone
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.15, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.8);
        });
        break;
      }
      case 'camera': {
        // Camera mechanical shutter sound (quick dual click)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1400, now);
        osc1.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.04);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1000, now + 0.07);
        osc2.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain2.gain.setValueAtTime(0.25, now + 0.07);
        gain2.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.07);
        osc2.stop(now + 0.12);
        break;
      }
      case 'dice': {
        // Shaking and rolling dice rattle
        for (let i = 0; i < 5; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320 + Math.random() * 280, now + i * 0.05);
          gain.gain.setValueAtTime(0.2, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.04);
        }
        break;
      }
      case 'applause': {
        // Simulating rhythmic clapping bursts
        for (let i = 0; i < 8; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400 + Math.random() * 400, now + i * 0.07);
          gain.gain.setValueAtTime(0.18, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.05);
        }
        break;
      }
      case 'laughter': {
        // Playful cartoon laugh "Ha-Ha-Ha"
        const pitches = [520, 620, 580, 680, 540];
        pitches.forEach((p, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(p, now + idx * 0.1);
          osc.frequency.exponentialRampToValueAtTime(p - 80, now + idx * 0.1 + 0.08);
          gain.gain.setValueAtTime(0.22, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.08);
        });
        break;
      }
      case 'fart': {
        // Comic buzzing pitch glide down
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.35);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'drumroll': {
        for (let i = 0; i < 14; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(160 + (i % 2 === 0 ? 30 : 0), now + i * 0.04);
          gain.gain.setValueAtTime(0.08 + (i / 14) * 0.2, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.035);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.035);
        }
        // Cymbal crash at end
        const oscCymbal = ctx.createOscillator();
        const gainCymbal = ctx.createGain();
        oscCymbal.type = 'sawtooth';
        oscCymbal.frequency.setValueAtTime(900, now + 0.58);
        gainCymbal.gain.setValueAtTime(0.25, now + 0.58);
        gainCymbal.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        oscCymbal.connect(gainCymbal);
        gainCymbal.connect(ctx.destination);
        oscCymbal.start(now + 0.58);
        oscCymbal.stop(now + 1.1);
        break;
      }
      case 'horn': {
        // Festive party horn toot-toot!
        [0, 0.18].forEach((offset) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'sawtooth';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(440, now + offset);
          osc2.frequency.setValueAtTime(554.37, now + offset);
          gain.gain.setValueAtTime(0.25, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.14);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now + offset);
          osc1.stop(now + offset + 0.14);
          osc2.start(now + offset);
          osc2.stop(now + offset + 0.14);
        });
        break;
      }
      case 'splat': {
        // Wet impact splat sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      default:
        break;
    }
  } catch {
    // Audio context may be restricted by browser policy before first interaction
  }
};

/**
 * Speech synthesizer voice announcement for high-value gifts (>= 1000 coins).
 * Voice says: "¡REGALAZO! [Sender] envió [Gift] a [Receiver]" with energetic Mexican/LATAM voice.
 */
export const speakAnnouncement = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 1.15;
    utterance.pitch = 1.1;

    // Pick Mexican/Latin voice if available
    const voices = window.speechSynthesis.getVoices();
    const latamVoice = voices.find(v => v.lang === 'es-MX' || v.lang.startsWith('es-') || v.lang === 'es');
    if (latamVoice) {
      utterance.voice = latamVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch {
    // Silently continue if speech not allowed
  }
};
