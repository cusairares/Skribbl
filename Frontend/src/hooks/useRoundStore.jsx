import { create } from "zustand";

export const useRoundStore = create((set) => ({
    currentRound: 1,
    totalRounds: 3,
    turnEndTime: null,
    isTurnActive: false,
    role: null,
    showRoleSplash: false,

    setCurrentRound: (currentRound) => set({ currentRound }),
    setTotalRounds: (totalRounds) => set({ totalRounds }),
    setTurnEndTime: (turnEndTime) => set({ turnEndTime }),
    setIsTurnActive: (isTurnActive) => set({ isTurnActive }),
    setRole: (role) => set({ role }),
    setShowRoleSplash: (showRoleSplash) => set({ showRoleSplash }),
}));
