export interface ILpu {
    titleName         : string,
    name              : string,
    category          : IAvailableLpyTypes,
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

export interface ISelectedLpu {
    name: string,
    category: IAvailableLpyTypes
}