export interface ILpu {
    titleName         : string,
    name              : string,
    availableLpuTypes : Array<string>
    childElements     ?: Array<ILpu>
    readonly          : boolean
}

export interface ISelectedLpu {
    name              : string
    availableLpuTypes : Array<string>
    readonly          ?: boolean
}