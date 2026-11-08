import { useState } from "react"
import { useImperativeHandle } from "react"

const Toggleable = (props) => {
    const [visible, setVisible] = useState(false)
    
    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(props.ref, () => {
        return { toggleVisibility }
    })

    const hideWhenVisible = { display: visible ? "none" : ""}
    const showWhenVisible = { display: visible ? "" : "none"}

    return (
        <div>
            <div style = {hideWhenVisible}>
                <button onClick = {toggleVisibility}>{props.buttonLabel}</button>
            </div>

            <div style = {showWhenVisible}>
                {props.children}
                <button onClick = {toggleVisibility}>cancel</button>
            </div>
        </div>
    )
}

export default Toggleable