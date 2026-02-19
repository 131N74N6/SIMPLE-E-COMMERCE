type NotificationProps = {
    message_text: string;
}

export function Notification(props: NotificationProps) {
    return (
        <div className="shadow_[0_0_6px_rgba(0,0,0,0.3)] bg-white p-[1.3rem] rounded-[1.3rem] z-20">
            <h3>{props.message_text}</h3>
        </div>
    );
}

export function Notification2(props: NotificationProps) {
    return (
        <div className="flex justify-center items-center fixed inset-0 shadow-[0_0_6px_rgba(0,0,0,0.3)] bg-white p-[1.3rem] rounded-[1.3rem] z-20">
            <p className="text-blue-700 mb-4">{props.message_text}</p>
        </div>
    )
}