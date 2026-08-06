import { create } from "zustand";

export const useSessionStore = create((set) => ({
    roomId: "",
    isHost: false,
    username: "",
    participants: [],
    isGameStarted: false,

    updateRoomId: (roomId) => set({ roomId }),
    updateHost: (isHost) => set({ isHost }),
    updateUsername: (username) => set({ username }),
    setIsGameStarted: (isGameStarted) => set({ isGameStarted }),
    setParticipants: (participantsOrFn) => set((state) => ({
        participants: typeof participantsOrFn === 'function' ? participantsOrFn(state.participants) : participantsOrFn
    })),
}));
