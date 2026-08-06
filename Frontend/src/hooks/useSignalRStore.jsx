import { create } from "zustand";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useSessionStore } from "./useSessionStore";

const BASE_ROOM_URL = `${import.meta.env.VITE_GAME_URL}api/v1/rooms`;

export const useSignalRStore = create((set, get) => ({
  connection: null,

  setConnection: (connection) => set({ connection }),

  getActiveConnection: async () => {
    const currentConnection = get().connection;

    if (
      currentConnection &&
      currentConnection.state === HubConnectionState.Connected
    ) {
      return currentConnection;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_GAME_URL}gamehub`)
      .withAutomaticReconnect()
      .build();

    await newConnection.start();
    console.log("SignalR Connection successful");
    console.log("SignalR ConnectionId:", newConnection.connectionId);

    set({ connection: newConnection });
    return newConnection;
  },
  
  joinRoom: async (targetRoomId, joinRoomRequest, navigate) => {
    if (!targetRoomId?.trim()) return;

    const cleanRoomId = targetRoomId.trim().toUpperCase();
    const { username: targetUsername, avatarOptions } = joinRoomRequest;

    try {
      const connection = await get().getActiveConnection();

      // Invoke SignalR hub method
      await connection.invoke("JoinSignalRGroup", {
        RoomId: cleanRoomId,
        Username: targetUsername,
        AvatarOptions: avatarOptions,
      });

      // API request to join room
      const joinRoomRequestBody = {
        Username: targetUsername ? targetUsername.trim() : "",
        ConnectionId: connection.connectionId,
        AvatarOptions: avatarOptions,
      };

      const response = await fetch(`${BASE_ROOM_URL}/${cleanRoomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joinRoomRequestBody),
      });

      if (response.ok) {
        console.log(
          `Player ${targetUsername ? targetUsername.trim() : ""} successfully joined room: ${cleanRoomId} (ConnectionId: ${connection.connectionId})`
        );
        if (navigate) {
          navigate(`/game/${cleanRoomId}`);
        }
      } else {
        console.error("Failed to join room via API");
        await get().disconnect();
        useSessionStore.getState().reset();
      }
    } catch (error) {
      console.error("Network or SignalR error during joinRoom:", error);
      await get().disconnect();
      useSessionStore.getState().reset();
    }
  },

  disconnect: async () => {
    const targetConnection = get().connection;
    if (targetConnection) {
      if (get().connection === targetConnection) {
        set({ connection: null });
      }
      try {
        await targetConnection.stop();
      } catch (error) {
        console.error("Error stopping SignalR connection:", error);
      } finally {
        if (get().connection === targetConnection) {
          set({ connection: null });
        }
      }
    }
  },
}));