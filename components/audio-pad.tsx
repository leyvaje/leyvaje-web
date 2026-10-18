'use client';

import { useEffect, useRef } from 'react';

type Drum = 'kick' | 'snare' | 'hat';

export function AudioPad() {
  const context = useRef<AudioContext | null>(null);
  const keys: Record<string, Drum> = { a: 'kick', s: 'snare', d: 'hat' };

  function play(drum: Drum) {
    const audio = context.current ?? new AudioContext();
    context.current = audio;
    void audio.resume();

    const hues: Record<Drum, string> = { kick: '#00f0ff', snare: '#dcb4ff', hat: '#2be280' };
    document.documentElement.style.setProperty('--holo-color', hues[drum]);
    document.documentElement.style.setProperty('--holo-angle', `${Math.floor(Math.random() * 360)}deg`);

    const now = audio.currentTime;
    const gain = audio.createGain();
    gain.connect(audio.destination);

    if (drum === 'kick') {
      const oscillator = audio.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(38, now + 0.2);
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 0.26);
      return;
    }

    const length = drum === 'snare' ? 0.24 : 0.085;
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * length), audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
    }

    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    filter.type = drum === 'snare' ? 'bandpass' : 'highpass';
    filter.frequency.value = drum === 'snare' ? 1800 : 8200;
    noise.buffer = buffer;
    gain.gain.setValueAtTime(drum === 'snare' ? 0.62 : 0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    noise.connect(filter);
    filter.connect(gain);
    noise.start(now);
    noise.stop(now + length);
  }

  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      const drum = keys[event.key.toLowerCase()];
      if (drum) {
        event.preventDefault();
        playRef.current(drum);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="audio-pad" role="group" aria-label="Interactive drum soundboard">
      {(['kick', 'snare', 'hat'] as const).map((drum) => <button key={drum} type="button" onClick={() => play(drum)}><span>{drum === 'kick' ? 'A' : drum === 'snare' ? 'S' : 'D'}</span>{drum === 'hat' ? 'Hi-hat' : drum}</button>)}
    </div>
  );
}
