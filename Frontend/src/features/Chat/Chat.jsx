import { useContext, useEffect } from "react";
import styles from "./Chat.module.css";
import { SessionContext } from "../../context/Session/SessionContext";
import { ChatHistory } from "../../components/ChatHistory/ChatHistory";
import { ChatBox } from "../../components/ChatBox/ChatBox";
import { useGameStore } from "../../hooks/useGameStore";
import { useSignalRStore } from "../../hooks/useSignalRStore";

function Chat() {
    const connection = useSignalRStore((state) => state.connection)
    const { chatMessages, setChatMessages } = useContext(SessionContext);
    const { isWordSelected, role } = useContext(SessionContext);
    const roomId = useGameStore((state) => state.roomId)

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
