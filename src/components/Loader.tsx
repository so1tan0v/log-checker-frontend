import React from "react";
import {Oval} from "react-loader-spinner";
import {useSelector} from "react-redux";
import {IRootState} from "../store/rootReduser";

export default function Loader() {
    const visible = useSelector((state: IRootState) => state.app.loader)

    return (
        <div className={'fixed inset-0 pointer-events-none flex justify-center items-center'}>
            <Oval
                height               = {150}
                width                = {150}
                color                = "#0366fc"
                secondaryColor       = "#03a9fc"
                wrapperStyle         = {{}}
                wrapperClass         = ""
                visible              = {visible}
                ariaLabel            = 'otval-loading'
                strokeWidth          = {1}
                strokeWidthSecondary = {2}
            />
        </div>
    )
}