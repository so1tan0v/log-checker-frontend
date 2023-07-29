import React from "react";
import {Oval} from "react-loader-spinner";
import {useSelector} from "react-redux";
import {IRootState} from "../store/rootReduser";

export default function Loader() {
    const visible = useSelector((state: IRootState) => state.app.loader)

    return (
        <div className={'fixed top-[50%] left-[50%] z-50'}>
            <Oval
                height               = {100}
                width                = {100}
                color                = "#0366fc"
                secondaryColor       = "#03a9fc"
                wrapperStyle         = {{}}
                wrapperClass         = ""
                visible              = {visible}
                ariaLabel            = 'otval-loading'
                strokeWidth          = {2}
                strokeWidthSecondary = {2}
            />
        </div>
    )
}