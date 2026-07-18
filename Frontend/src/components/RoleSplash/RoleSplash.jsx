import React from "react";
import styles from "./RoleSplash.module.css";

function RoleSplash({ role }) {
    const isDrawer = role === "Drawer";

    return (
        <div data-component="role-splash" className={styles.roleSplash}>
            <h1 className={`${styles.title} ${isDrawer ? styles.titleDrawer : styles.titleGuesser}`}>
                {isDrawer ? "You are the Drawer!" : "You are a Guesser!"}
            </h1>
            <p className={styles.subtitle}>
                {isDrawer 
                    ? "Pick a word and draw it to the best of your ability." 
                    : "Watch the canvas closely and try to guess the word."
                }
            </p>
        </div>
    );
}

export { RoleSplash };
export default RoleSplash;
