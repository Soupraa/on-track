import { useEffect, useState } from "react";

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayString = time.toLocaleDateString([], { weekday: 'long' });
    return (
        <>
            {dayString} - {timeString}
        </>
    );
};

export default LiveClock;