import axios from "axios";
import {availableLpu} from "./store/actions";


export async function sleep (delay = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, delay)
    })
}
export async function getAvailableLpu() {
    let response = await axios.get(`/api/getAvailableLpu`);

    availableLpu(response.data);
}

//
// export async function getFileByLpuIdAndType(id: string, fileType: string, lpuType: string): Promise<string> {
//     let response = await axios.get(`/api/getFileByLpuIdAndType`, {params: {id, fileType, lpuType}});
//
//     return response.data;
// }

