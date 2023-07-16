import axios from "axios";
import {availableLpu} from "./store/actions";

export async function getAvailableLpu() {
    let response = await axios.get(`/api/getAvailableLpu`);

    availableLpu(response.data);
}
