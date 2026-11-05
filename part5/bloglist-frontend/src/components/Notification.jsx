const Notification = ({ notification }) => {
    const { message, error } = notification
    if (message === null) {
        return null;
    }
    const divStyle = {}
    if (error) {
        divStyle.color = "red"
        divStyle.border = "3px solid red"
    } else {
        divStyle.color = "green"
        divStyle.border = "3px solid green"
    }
    return (
        <div style = {divStyle}>
            {message}
        </div>
    )
};

export default Notification;
