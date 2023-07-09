import {store} from "./store";
import {AVAILABLE_LPU} from "../consts";
import {TIMER} from "../consts";
import {ILpu} from "../interface";

export function requestTimerStart (state: boolean) {
    store.dispatch({
        type    : TIMER,
        payload : state
    })
}

export function availableLpu (state: Array<ILpu>) {
    store.dispatch({
        type: AVAILABLE_LPU,
        payload: state
    })
}