export interface ILpu {
    titleName         : string,
    name              : string,
    availableLpuTypes : IAvailableLpyTypes,
    childElements     ?: Array<ILpu>
}


export interface IAvailableLpyTypes {
    [key: string]: {
        [key: string]: {
            path     : string,
            clearAll ?: boolean,
            readonly ?: boolean
        }
    }
}
