import styles from "./ChatBox.module.css";

function ChatBox() {
    return (
        <div data-component="chat-box" className={styles.chatBox}>
            <h3>Chat Box</h3>
        </div>
    );
}

export { ChatBox };
