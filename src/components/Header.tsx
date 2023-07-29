import React, { useEffect } from 'react';
import {useStopwatch} from "react-timer-hook";
import {useSelector} from "react-redux";


export function Header() {
    const requestTimerStart = useSelector((state: any) => state.app.timer);
    const timer = useStopwatch();

    useEffect(() => {
        if (requestTimerStart) {
            timer.reset();
            timer.start();
        } else {
            timer.pause();
        }
    }, [requestTimerStart]);

    return (
        <nav className="h-[50px] items-center flex justify-between px-5 bg-blue-700 text-white">
            <span className="font-bold">Просмотр логов и конфигурационных файлов ООО "Виста"</span>
            <div className={'flex p-0 m-0 content-center'}>
                <div className={'bg-blue-200 text-blue-900 h-4/5 rounded-2xl content-center pt-2 pb-2 pl-1 pr-1 ml-1 mr-1'}>
                    Request timer: <span id={'timer'}>{timer.seconds}</span>
                </div>
            </div>
        </nav>
    );
}