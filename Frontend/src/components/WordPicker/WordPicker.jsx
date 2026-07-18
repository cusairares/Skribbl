import React from "react";
import styles from "./WordPicker.module.css";

function WordPicker({ words, onSelectWord }) {
    return (
        <div data-component="word-picker" className={styles.wordPickerContainer}>
            <h2 className={styles.title}>Choose a Word</h2>
            <div className={styles.buttonContainer}>
                {words && words.map((word) => (
                    <button
                        key={word}
                        className={styles.wordButton}
                        onClick={() => onSelectWord(word)}
                    >
                        {word}
                    </button>
                ))}
            </div>
        </div>
    );
}

export { WordPicker };
