import { create } from "zustand";

export const useGameStore = create((set)=>({
    roomId:"",
    isHost:false,
    username:"",

    updateRoomId: (roomId) => set({ roomId }),
    updateHost: (isHost) => set({ isHost }),
    updateUsername: (username) => set({ username }),
    
}))