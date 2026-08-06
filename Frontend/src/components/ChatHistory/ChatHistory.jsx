import { useRef, useEffect } from "react";
import styles from "./ChatHistory.module.css";

function ChatMessage({ message }) {
    const isCorrect = message.status === "CorrectGuess";

    if (isCorrect) {
        return (
            <div className={styles.messageRow}>
                <span className={styles.messageText} style={{ color: "#2e7d32", fontWeight: "bold" }}>
                    {message.message}
                </span>
            </div>
        );
    }

    return (
        <div className={styles.messageRow}>
            <span className={styles.senderName}>
                {message.username}
            </span>
            <span className={styles.colon}>: </span>
            <span className={styles.messageText}>{message.message}</span>
        </div>
    );
}

function ChatHistory({ chatMessages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    return (
        <div className={styles.historyContainer}>
            {chatMessages && chatMessages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

export { ChatHistory };