import {AVAILABLE_LPU} from "./types";
import {ILpu} from "../interface";


const initAvailableLpuState: Array<ILpu> = [];
export function availableLpuReducer(state = initAvailableLpuState, action: {type: string, payload: Array<ILpu>}) {
    switch (action.type) {
        case AVAILABLE_LPU:
          return action.payload;
        default:
          return state
      }
}