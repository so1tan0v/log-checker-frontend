import {combineReducers} from "redux";
import {ILpu} from "../interface";
import {AVAILABLE_LPU} from "../consts";

// const initSelectLpuRState = '';
// function selectLpuReducer(state = initSelectLpuRState, action: {type: string, payload: ISelectedLpu}) {
//     switch (action.type) {
//         case SELECTED_LPU:
//           return action.payload
//         default:
//           return state
//       }
// }

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
    availableLpu : availableLpuReducer
})