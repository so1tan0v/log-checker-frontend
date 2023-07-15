import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export function Header() {
    const [timer, setTimer] = useState(0.0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const requestTimerStart = useSelector((state: any) => state.requestTimerStart);

    useEffect(() => {
        if (requestTimerStart) {
            startTimer();
        } else {
            endTimer();
        }
    }, [requestTimerStart]);

    let starTimestamp = new Date().getTime();
    const startTimer = () => {
        setTimer(0.0);
        const intId = setInterval(() => {
            const time = new Date().getTime();
            const differenceInMilliseconds = time - starTimestamp;
            const differenceInSeconds = differenceInMilliseconds / 1000;
            setTimer(differenceInSeconds);
        }, 100);

        setIntervalId(intId);
    };

    const endTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
        }

        setIntervalId(null);
    };

    return (
        <nav className="h-[50px] items-center flex justify-between px-5 bg-blue-700 text-white">
            <span className="font-bold">Просмотр логов и конфигурационных файлов ООО "Виста"</span>
            <div className={'bg-blue-200 text-blue-900 h-4/5 rounded-2xl content-center pt-2 pl-1 pr-1 ml-1 mr-1'}>
                Request timer <span id={'timer'}>{timer.toFixed(2)}</span>
            </div>
        </nav>
    );
}