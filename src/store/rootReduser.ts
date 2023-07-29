import {combineReducers} from "redux";

import {availableLpuReducer} from "./lpuReducer";

import {ILpu} from "../interface";
import {appReducer, IAppReducer} from "./appReducer";
import {ThunkDispatch} from "redux-thunk";
import {AvailableLpuAction} from "./actions";

export type AppDispatch = ThunkDispatch<IRootState, unknown, AvailableLpuAction>;


export interface IRootState {
    availableLpu      : Array<ILpu>
    app               : IAppReducer,
    // selectedLpu       : string
}

export const rootReducer = combineReducers({
    availableLpu : availableLpuReducer,
    app          : appReducer,
    // selectedLpu  : selectedLpu,
});