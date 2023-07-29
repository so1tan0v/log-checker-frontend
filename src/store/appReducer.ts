import {LOAD_FILE_AS_CHUNK_OFF, LOAD_FILE_AS_CHUNK_ON, LOADER_OFF, LOADER_ON, TIMER_OFF, TIMER_ON} from "./types";

export interface IAppReducer {
    loader          : boolean,
    timer           : boolean,
    loadFileAsChunk : boolean
}

const initLoaderReducerState: IAppReducer = {
    loader          : false,
    timer           : false,
    loadFileAsChunk : false
}

export function appReducer(state = initLoaderReducerState, action: { type: string, payload: IAppReducer }) {
    switch (action.type) {
        case LOADER_ON:
            return {
                ...state,
                loader: true
            }
        case LOADER_OFF:
            return {
                ...state,
                loader: false
            }
        case TIMER_ON:
            return {
                ...state,
                timer: true
            }
        case TIMER_OFF:
            return {
                ...state,
                timer: false
            }
        case LOAD_FILE_AS_CHUNK_ON:
            return {
                ...state,
                timer: true
            }
        case LOAD_FILE_AS_CHUNK_OFF:
            return {
                ...state,
                timer: false
            }
        default:
            return state;
    }
}