// src/store/playerStore.ts
// Global audio player state dengan Zustand

import { create } from "zustand";

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  mediaUrl: string;
  duration: number;
}

interface PlayerState {
  // State
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;        // 0–1
  progress: number;      // detik
  duration: number;      // detik
  isShuffle: boolean;
  repeatMode: "none" | "one" | "all";
  isMinimized: boolean;

  // Actions
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (vol: number) => void;
  setProgress: (sec: number) => void;
  setDuration: (sec: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleMinimize: () => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: "none",
  isMinimized: false,

  play: (track, queue = []) => {
    set({
      currentTrack: track,
      isPlaying: true,
      progress: 0,
      queue: queue.length > 0 ? queue : [track],
    });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  next: () => {
    const { queue, currentTrack, isShuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

    if (repeatMode === "one") {
      // Putar ulang lagu yang sama
      set({ progress: 0, isPlaying: true });
      return;
    }

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          set({ isPlaying: false });
          return;
        }
      }
    }

    set({ currentTrack: queue[nextIndex], progress: 0, isPlaying: true });
  },

  prev: () => {
    const { queue, currentTrack, progress } = get();
    if (!currentTrack) return;

    // Jika sudah > 3 detik, restart lagu saja
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = Math.max(0, currentIndex - 1);
    set({ currentTrack: queue[prevIndex], progress: 0, isPlaying: true });
  },

  setVolume: (vol) => set({ volume: Math.min(1, Math.max(0, vol)) }),
  setProgress: (sec) => set({ progress: sec }),
  setDuration: (sec) => set({ duration: sec }),

  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),

  cycleRepeat: () =>
    set((s) => {
      const modes: Array<"none" | "one" | "all"> = ["none", "all", "one"];
      const i = modes.indexOf(s.repeatMode);
      return { repeatMode: modes[(i + 1) % modes.length] };
    }),

  toggleMinimize: () => set((s) => ({ isMinimized: !s.isMinimized })),
  clearQueue: () => set({ queue: [], currentTrack: null, isPlaying: false }),
}));
