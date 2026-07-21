import { useContext, useEffect } from "react";
import styles from "./Chat.module.css";
import { SessionContext } from "../../context/Session/SessionContext";
import { SignalRContext } from "../../context/SignalR/SignalRContext";
import { UserContext } from "../../context/User/UserContext";
import { ChatHistory } from "../../components/ChatHistory/ChatHistory";
import { ChatBox } from "../../components/ChatBox/ChatBox";

function Chat() {
    const { connection } = useContext(SignalRContext);
    const { chatMessages, setChatMessages } = useContext(SessionContext);
    const { isWordSelected, role } = useContext(SessionContext);
    const { roomId } = useContext(UserContext);

    useEffect(() => {
        if (!connection) return;

        const handleRecevieMessage = (messagePayload) => {
            setChatMessages((prev) => [...prev, messagePayload]);
        };

        connection.on("RecevieMessage", handleRecevieMessage);

        return () => {
            connection.off("RecevieMessage", handleRecevieMessage);
        };
    }, [connection, setChatMessages]);
    
    const handleSendMessage = (value) => {
        const messagePayload = { roomId: roomId, message: value };
        if (isWordSelected && role == "Guesser") {
            connection.invoke("SendGuess", messagePayload);
        }
        else {
            connection.invoke("SendMessage", messagePayload);
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
