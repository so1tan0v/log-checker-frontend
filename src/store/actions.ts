import {store} from "./store";
import {AVAILABLE_LPU} from "../consts";
import {ILpu} from "../interface";

// export function selectLpu (state: ISelectedLpu) {
//     store.dispatch({
//         type: SELECTED_LPU,
//         payload: state
//     })
// }

export function availableLpu (state: Array<ILpu>) {
    store.dispatch({
        type: AVAILABLE_LPU,
        payload: state
    })
}