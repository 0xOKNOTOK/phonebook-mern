const Notification = ({ message, errorType }) => {
    if (message === null) {
        return null;
    }

    return <div className={errorType}>{message}</div>;
};

export default Notification;
