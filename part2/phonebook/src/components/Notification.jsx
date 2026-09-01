const Notification = ({message}) => {
    if (message.content === null) {
        return null
    }
    const messageStyle = {
        color: message.isError ? "red" : "green",
        background: "lightgrey",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    return (
        <div style = {messageStyle}>
            {message.content}
        </div>
    )
}

export default Notification
