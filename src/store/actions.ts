import {AVAILABLE_LPU, LOADER_OFF, LOADER_ON, TIMER_OFF, TIMER_ON} from "./types";
import {getAvailableLpu} from "../helper";
import {ThunkAction} from "redux-thunk";
import {IRootState} from "./rootReduser";
import {ILpu} from "../interface";
import {Action} from "redux";

export interface AvailableLpuAction extends Action<typeof AVAILABLE_LPU> {
  payload: ILpu[];
}

export function setLoader (status = false) {
    return {
        type: status
            ? LOADER_ON
            : LOADER_OFF
    } as AvailableLpuAction;
}

export function requestTimerStart(status = false) {
    return {
        type: status
            ? TIMER_ON
            : TIMER_OFF
    } as AvailableLpuAction
}

export function availableLpuStore(): ThunkAction<void, IRootState, unknown, AvailableLpuAction >  {
    return async dispatch  => {
        try {
            dispatch(setLoader(true));
            const data = await getAvailableLpu();
            dispatch({
                type: AVAILABLE_LPU,
                payload: data
            })
            dispatch(setLoader(false));
        } catch (e) {
            dispatch(setLoader(false));
        }
    }
}