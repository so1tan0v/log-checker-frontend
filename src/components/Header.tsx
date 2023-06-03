import React from "react";

export function Header () {
    return (
        <nav className="h-[50px] items-center flex justify-between px-5 bg-blue-700 text-white">
            <span className="font-bold">Просмотр логов и конфигурационных файлов Doctorroom</span>
        </nav>
    )
}