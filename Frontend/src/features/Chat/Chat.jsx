import { useEffect } from "react";
import styles from "./Chat.module.css";
import { ChatHistory } from "../../components/ChatHistory/ChatHistory";
import { ChatBox } from "../../components/ChatBox/ChatBox";
import { useSessionStore } from "../../hooks/useSessionStore";
import { useChatStore } from "../../hooks/useChatStore";
import { useWordStore } from "../../hooks/useWordStore";
import { useRoundStore } from "../../hooks/useRoundStore";
import { useSignalRStore } from "../../hooks/useSignalRStore";

function Chat() {
    const connection = useSignalRStore((state) => state.connection)
    const chatMessages = useChatStore((state) => state.chatMessages);
    const setChatMessages = useChatStore((state) => state.setChatMessages);
    
    const isWordSelected = useWordStore((state) => state.isWordSelected);
    const role = useRoundStore((state) => state.role);
    const roomId = useSessionStore((state) => state.roomId)

    useEffect(() => {
        if (!connection) return;

        const handleRecevieMessage = (chatMessageEvent) => {
            setChatMessages((prev) => [...prev, chatMessageEvent]);
        };

        connection.on("RecevieMessage", handleRecevieMessage);

        return () => {
            connection.off("RecevieMessage", handleRecevieMessage);
        };
    }, [connection, setChatMessages]);
    
    const handleSendMessage = (value) => {
        const chatMessageRequest = { roomId: roomId, message: value };
        if (isWordSelected && role == "Guesser") {
            connection.invoke("SendGuess", chatMessageRequest);
        }
        else {
            connection.invoke("SendMessage", chatMessageRequest);
        }
    };

    return (
        <div data-component="chat-box" className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <span>Lobby Chat</span>
            </div>
            <div className={styles.chatHistoryWrapper}>
                <ChatHistory chatMessages={chatMessages}></ChatHistory>
            </div>
            <div className={styles.chatboxWrapper}>
                <ChatBox handleSendMessage={handleSendMessage}></ChatBox>
            </div>
        </div>
    );
}

export { Chat };
