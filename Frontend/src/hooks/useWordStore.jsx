import { create } from "zustand";

export const useWordStore = create((set) => ({
    currentWord: "",
    wordOptions: [],
    isWordSelected: false,

    setCurrentWord: (currentWord) => set({ currentWord }),
    setWordOptions: (wordOptions) => set({ wordOptions }),
    setIsWordSelected: (isWordSelected) => set({ isWordSelected }),
}));
