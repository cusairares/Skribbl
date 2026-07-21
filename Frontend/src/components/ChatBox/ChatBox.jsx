import { useState } from "react";
import styles from "./ChatBox.module.css";

function ChatBox({ handleSendMessage }) {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        handleSendMessage(value);
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.chatBoxForm}>
            <input
                type="text"
                className={styles.chatInput}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type your guess or message..."
                maxLength={100}
            />
            <button type="submit" className={styles.sendButton} aria-label="Send message">
                <span className={styles.sendIcon}>➤</span>
            </button>
        </form>
    );
}

export { ChatBox };
