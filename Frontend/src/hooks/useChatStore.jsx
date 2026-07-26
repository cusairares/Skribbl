import { create } from "zustand";

export const useChatStore = create((set) => ({
    chatMessages: [],

    setChatMessages: (messagesOrFn) => set((state) => ({
        chatMessages: typeof messagesOrFn === 'function' ? messagesOrFn(state.chatMessages) : messagesOrFn
    })),
}));
