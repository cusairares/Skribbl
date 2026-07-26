import { create } from "zustand";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

const BASE_ROOM_URL = `${import.meta.env.VITE_GAME_URL}api/rooms`;

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

    const { username: targetUsername, avatarOptions } = joinRoomRequest;

    try {
      const connection = await get().getActiveConnection();

      // Invoke SignalR hub method
      await connection.invoke("JoinSignalRGroup", {
        RoomId: targetRoomId,
        Username: targetUsername,
        AvatarOptions: avatarOptions,
      });

      // API request to join room
      const joinRoomRequestBody = {
        Username: targetUsername.trim(),
        ConnectionId: connection.connectionId,
        AvatarOptions: avatarOptions,
      };

      const response = await fetch(`${BASE_ROOM_URL}/join/${targetRoomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joinRoomRequestBody),
      });

      if (response.ok) {
        console.log(
          `Player ${targetUsername.trim()} successfully joined room: ${targetRoomId} (ConnectionId: ${connection.connectionId})`
        );
        if (navigate) {
          navigate(`/game/${targetRoomId}`);
        }
      } else {
        console.error("Failed to join room via API");
      }
    } catch (error) {
      console.error("Network or SignalR error during joinRoom:", error);
    }
  },

  disconnect: async () => {
    const { connection } = get();
    if (connection) {
      await connection.stop();
      set({ connection: null });
    }
  },
}));