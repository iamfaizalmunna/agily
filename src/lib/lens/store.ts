"use client";

import { create } from "zustand";

export type LensMessage = {
  role: "user" | "lens";
  text: string;
  source?: "ollama" | "local";
};

type LensState = {
  open: boolean;
  pending: boolean;
  ollama: boolean | null;
  messages: LensMessage[];
  setOpen: (open: boolean) => void;
  setPending: (pending: boolean) => void;
  setOllama: (ollama: boolean | null) => void;
  push: (message: LensMessage) => void;
};

export const useLensStore = create<LensState>((set) => ({
  open: false,
  pending: false,
  ollama: null,
  messages: [],
  setOpen: (open) => set({ open }),
  setPending: (pending) => set({ pending }),
  setOllama: (ollama) => set({ ollama }),
  push: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
