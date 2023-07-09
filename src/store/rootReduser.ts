import {combineReducers} from "redux";
import {ILpu} from "../interface";
import {AVAILABLE_LPU, TIMER} from "../consts";

const initTimerState: boolean = false;
function timerReducer(state: boolean = initTimerState, action: {type: string, payload: boolean}) {
    switch (action.type) {
        case TIMER:
          return action.payload
        default:
          return state
      }
}

const initAvailableLpuState: Array<ILpu> = [];
function availableLpuReducer(state = initAvailableLpuState, action: {type: string, payload: Array<ILpu>}) {
    switch (action.type) {
        case AVAILABLE_LPU:
          return action.payload
        default:
          return state
      }
}

export const rootReducer = combineReducers({
    // selectLpu    : selectLpuReducer,
    availableLpu      : availableLpuReducer,
    requestTimerStart : timerReducer
})