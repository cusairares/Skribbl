import styles from "./ToolTip.module.css"


function ToolTip(){

    return(
        <div data-component="tool-tip" className={styles.toolTip}>
            <h3>ToolTip</h3>
        </div>
    )
}

export {ToolTip}