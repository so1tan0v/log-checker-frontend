export interface ILpu {
    titleName         : string,
    name              : string,
    availableLpuTypes : Array<string>
    childElements     ?: Array<ILpu>
}

export interface ISelectedLpu {
    name              : string
    availableLpuTypes : Array<string>
}