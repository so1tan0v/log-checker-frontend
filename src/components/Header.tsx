import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {titleName} from '../consts';

export function Header() {
    const requestTimerStart = useSelector((state: any) => state.app.timer);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (requestTimerStart) {
            setStartTime(Date.now());
            interval = setInterval(() => {
                if (startTime) {
                    const currentTime = Date.now();
                    const elapsedMilliseconds = currentTime - startTime;
                    setElapsedTime(elapsedMilliseconds);
                }
            }, 100);
        } else {
            if (interval) {
                clearInterval(interval);
            }
            if (startTime) {
                const endTime = Date.now();
                const elapsedMilliseconds = endTime - startTime;
                setElapsedTime(elapsedMilliseconds);
            }
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [requestTimerStart, startTime]);

    return (
        <nav className="h-[50px] items-center flex justify-between px-5 bg-blue-700 text-white">
            <span className="font-bold">{titleName}</span>
            <div className={'flex p-0 m-0 content-center'}>
                <div
                    className={'bg-blue-200 text-blue-900 h-4/5 rounded-2xl content-center pt-2 pb-2 pl-1 pr-1 ml-1 mr-1'}>
                    Request timer: <span id={'timer'}>{(elapsedTime / 1000).toFixed(3)} s</span>
                </div>
            </div>
        </nav>
    );
}