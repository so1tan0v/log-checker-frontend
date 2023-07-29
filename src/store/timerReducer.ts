import {TIMER_OFF, TIMER_ON} from "./types";

const initTimerState = {
    payload: false
};
export default function timerReducer(state = initTimerState, action: {type: string, payload: boolean}) {
    switch (action.type) {
        case TIMER_ON:
            return {
                ...state,
                payload: true
            }
        case TIMER_OFF:
            return {
                ...state,
                payload: false
            }
        default:
          return state
      }
}