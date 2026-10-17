'use client';

import { useRef } from 'react';

type Drum = 'kick' | 'snare' | 'hat';

export function AudioPad() {
  const context = useRef<AudioContext | null>(null);

  function play(drum: Drum) {
    const audio = context.current ?? new AudioContext();
    context.current = audio;
    void audio.resume();

    const now = audio.currentTime;
    const gain = audio.createGain();
    gain.connect(audio.destination);

    if (drum === 'kick') {
      const oscillator = audio.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(145, now);
      oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.24);
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 0.29);
      return;
    }

    const length = drum === 'snare' ? 0.2 : 0.075;
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * length), audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      const noise = Math.sin(index * 12.9898) * 43758.5453;
      samples[index] = (noise - Math.floor(noise)) * 2 - 1;
    }

    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = drum === 'snare' ? 1200 : 7000;
    noise.buffer = buffer;
    gain.gain.setValueAtTime(drum === 'snare' ? 0.42 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    noise.connect(filter);
    filter.connect(gain);
    noise.start(now);
    noise.stop(now + length);
  }

  return (
    <div className="audio-pad" role="group" aria-label="Interactive drum soundboard">
      {(['kick', 'snare', 'hat'] as const).map((drum) => <button key={drum} type="button" onClick={() => play(drum)}><span>{drum.slice(0, 1).toUpperCase()}</span>{drum}</button>)}
    </div>
  );
}
