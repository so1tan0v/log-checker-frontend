import axios from "axios";
import {store} from "./index";
import {requestTimerStart, setLoader} from "./store/actions";
import {isEmpty} from "lodash";

export async function getAvailableLpu() {
    return (await axios.get(`/api/getAvailableLpu`)).data;
}

export function getLpuById(lpuId: string) {
    if(!lpuId)
        return null;

    const availableLpu = store.getState().availableLpu;

    const mainId = lpuId.split('-');

    let selectedLpu = availableLpu?.find(item => item.name === mainId[0]);
    if(mainId.length > 1) {
        selectedLpu = selectedLpu?.childElements?.find(item => item.name === mainId[1]);
    }
    if(selectedLpu?.childElements && mainId.length === 1)
        return null;

    return selectedLpu;
}

export interface GetFileContentProps{
    lpu                : string;
    fileType           : string;
    lpuType            : string;
    usingChunk         : boolean;
    setAbortController : (controller: any) => void;
    setChunkLoading    : (loading: boolean) => void;
    setCode            : (code: string) => void;
    setError           : (error: string) => void;
}

export async function getFileContent (props: GetFileContentProps) {
    const {
        lpu,
        fileType,
        lpuType,
        usingChunk,
        setAbortController,
        setChunkLoading,
        setCode,
        setError
    } = props;

    if(lpu) {
        if(usingChunk) {
            const url = new URL('/api/getFileByLpuIdAndTypeByChunk', window.location.origin);
            const params = new URLSearchParams();
            params.append('id', lpu);
            params.append('fileType', fileType);
            params.append('lpuType', lpuType);
            url.search = params.toString();

            const currentAbortController = new AbortController();
            setAbortController(currentAbortController);

            try {
                let fullData = '';
                store.dispatch(requestTimerStart(true));
                const response = await fetch(url, {
                    method : 'GET',
                    signal : currentAbortController.signal
                });
                store.dispatch(setLoader(false));
                setChunkLoading(true);
                let countChunkIterations = 0;
                if(response.body) {
                    const reader = response.body.getReader();
                    while (true) {
                        countChunkIterations++;
                        const { done, value } = await reader.read();
                        if (done) {
                            setAbortController(null);
                            setChunkLoading(false);
                            store.dispatch(requestTimerStart(false));
                            setCode(fullData);
                            break;
                        }
                        const decoder = new TextDecoder('utf-8');
                        const chunk = decoder.decode(value);

                        if (response.status !== 200) {
                            throw JSON.parse(chunk);
                        }

                        if(chunk) {
                            fullData += chunk;

                            if(countChunkIterations === 1
                                || countChunkIterations % 80 === 0
                            ) {
                                setCode(fullData);
                            }
                        }
                    }
                }
            } catch (e: any) {
                store.dispatch(setLoader(false));
                store.dispatch(requestTimerStart(false));
                setChunkLoading(false);
                setCode('');
                setError(e?.response?.data ?? e?.response ?? e);
            }
        } else {
            try {
                const currentAbortController = new AbortController();
                setAbortController(currentAbortController);
                store.dispatch(requestTimerStart(true));
                let response = await axios.get(`/api/getFileByLpuIdAndType`, {
                    params : {id: lpu, fileType, lpuType},
                    signal : currentAbortController.signal
                });
                store.dispatch(requestTimerStart(false));

                setCode(response.data);
            } catch (e: any) {
                store.dispatch(setLoader(false));
                store.dispatch(requestTimerStart(false));
                setCode('');
                setError(e?.response?.data ?? e?.response ?? e);
            }
        }
    }
}