import React, { useCallback, useEffect, useMemo, useState } from "react";
import {useSearchParams} from "react-router-dom";

import CodeEditorWindow from "../components/CodeWindowEditor";
import Loader from "../components/Loader";
import axios from "axios";
import {isEmpty} from "lodash";
import {useSelector} from "react-redux";

import {SELECTED_TAB, UNSELECTED_TAB} from "../consts";
import {requestTimerStart} from "../store/actions";
import {RootState} from "../store/rootReduser";


const EditorPage = React.memo(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const lpu   = searchParams.get('lpu')      ?? '';
    let fileType= searchParams.get('fileType') ?? '',
        lpuType = searchParams.get('lpuType')  ?? ''

    const [loading, setLoading] = useState(false);
    const [chunkLoading, setChunkLoading] = useState(false);
    const [usingChunk, setUsingChunk] = useState(true);

    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const memoizedCode = useMemo(() => code, [code]);

    const lpuSplited = lpu.split('-');
    let storeSelectedLpu = useSelector((state: RootState) => state.availableLpu.find((item) => item.name === lpuSplited[0]));
    if(storeSelectedLpu && storeSelectedLpu.childElements && lpuSplited.length > 1) {
        storeSelectedLpu = storeSelectedLpu.childElements.find(item => item.name === lpuSplited[0]);
    }
    const category = storeSelectedLpu?.category;

    const changeCode = useCallback((action: string, data: string) => {
        switch (action) {
            case "code":
                setCode(data);
                break;
            default:
                console.warn("case not handled!", action, data);
        }
    }, []);

    const onClickFileTypeTabs = useCallback((event: any) => {
        const newFileType = event.target.id;
        if (lpu && newFileType && lpuType) {
            setSearchParams({
                lpu,
                fileType: newFileType,
                lpuType,
            });
        }
    }, [lpu, lpuType, setSearchParams, storeSelectedLpu]);


    const onClickLpuTypeTabs = useCallback((event: any) => {
        const newLpuType = event.target.id;
        if (storeSelectedLpu) {
            const availableFileTypes = Object.keys(storeSelectedLpu.category[newLpuType]);
            if (!availableFileTypes.includes(fileType)) {
                setSearchParams({
                    lpu,
                    fileType: availableFileTypes[0],
                    lpuType: newLpuType,
                });
            } else {
                setSearchParams({
                    lpu,
                    fileType,
                    lpuType: newLpuType,
                });
            }
        }
    }, [lpu, fileType, setSearchParams, storeSelectedLpu]);


    const sendFileHandler = useCallback(async () => {
        if (!(lpu && fileType && lpuType)) {
            alert("Не могу отправить файл.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/sendNodeFile", {
                id: lpu,
                fileType,
                lpuType,
                node: category && category[fileType]?.clearAll ? "" : code || "",
            });
        } catch (e: any) {
            setError(e.message);
        }
        setLoading(false);

        await getFile();
    }, [lpu, fileType, lpuType, code, category]);

    const getFileContent = useCallback(async () => {
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
                    requestTimerStart(true);
                    const response = await fetch(url, {
                        method : 'GET',
                        signal : currentAbortController.signal
                    });
                    setLoading(false);
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
                                requestTimerStart(false)
                                setCode(fullData);
                                break;
                            }
                            const decoder = new TextDecoder('utf-8');
                            const chunk = decoder.decode(value);

                            if(chunk) {
                                fullData += chunk;

                                if(countChunkIterations === 1
                                    || countChunkIterations % 100 === 0
                                ) {
                                    setCode(fullData);
                                }
                            }
                        }
                    }
                } catch (e) {
                    requestTimerStart(false);
                    setCode('');
                }
            } else {
                try {
                    const currentAbortController = new AbortController();
                    setAbortController(currentAbortController);
                    requestTimerStart(true);
                    let response = await axios.get(`/api/getFileByLpuIdAndType`, {
                        params : {id: lpu, fileType, lpuType},
                        signal : currentAbortController.signal
                    });
                    requestTimerStart(false);

                    setCode(response.data);
                } catch (e) {
                    requestTimerStart(false);
                    setCode('');
                }
            }
        }
    }, [lpu, fileType, lpuType, usingChunk]);

    const getFile = useCallback(async () => {
        setCode("");
        setLoading(true);
        setError("");
        if (abortController) {
            abortController.abort(); // Отменить запрос при размонтировании компонента
        }
        await getFileContent();
        setLoading(false);
    }, [lpu, fileType, lpuType, usingChunk, abortController, getFileContent]);

    const codeEdit = useMemo(() => {
        if (loading) {
            return (
                <div>
                    {fileType === 'error' &&
                        <div className={'text-amber-700 font-bold'}>
                            Загрузка может происходить долго, т.к файлы лога могут весить очень много. <br />Рекомендуется такие логи очищать (они не удаляются, а заменяются на пустой. Старый лог остается)
                        </div>
                    }
                    <Loader/>
                </div>
            );
        } else if (error) {
            return (
                <div className={'w-full text-amber-800 font-bold'}>
                    {error}
                </div>
            );
        } else {
            return (
                <div className={'pb-5'}>
                    <div className={'w-full'}>
                        {fileType === 'error' ? 'Текст ошибок' : 'Конфигурационный файл'}
                    </div>
                    <CodeEditorWindow
                        code     = {memoizedCode}
                        onChange = {changeCode}
                        language = {fileType}
                        theme    = {'oceanic-next'}
                    />
                </div>
            );
        }
    }, [loading, error, fileType, memoizedCode, chunkLoading]);

    useEffect(() => {
        getFile();
    }, [lpu, fileType, lpuType])

    const readonly = useMemo(() => {
        if (fileType && category && category.hasOwnProperty(fileType)) {
            return !!category[fileType].readonly || false;
        }
        return false;
    }, [fileType, category]);

    return (
        <div className={'justify-center w-full mx-auto max-w-[70%] pt-5'}>
            {isEmpty(lpu)
                ? (
                    <div>
                        Выберите ЛПУ
                    </div>
                )
                : (
                    <>
                        <div className={'items-center flex justify-between text-white'}>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                {
                                    lpuType && category
                                        ?
                                            Object.keys(category)?.map((item: string) => {
                                                return (
                                                    <li className="mr-2" key={item}>
                                                        <button onClick   = {onClickLpuTypeTabs}
                                                                id        = {item}
                                                                className = {lpuType === item ? SELECTED_TAB : UNSELECTED_TAB}
                                                        >
                                                            {item}
                                                        </button>
                                                    </li>
                                                );
                                            })
                                        : ''
                                }
                            </ul>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li className="mr-2">
                                    {
                                        lpuType && category
                                            ? Object.keys(category[lpuType]).map((type) => {
                                                return (
                                                    <button
                                                        onClick={onClickFileTypeTabs}
                                                        id={type}
                                                        className={fileType === type ? SELECTED_TAB : UNSELECTED_TAB}
                                                    >
                                                        {type}
                                                    </button>
                                                );
                                            })
                                            : ''
                                    }
                                </li>
                            </ul>
                        </div>
                        <div className={'w-full pt-2 justify-items-end pb-2 h-[50px] items-center flex justify-between text-white'}>
                            <button className={'p-2 mr-0 bg-indigo-500  rounded text-white disabled:bg-blue-100'}
                                    onClick={getFile}
                            >
                                Обновить
                            </button>
                            <div className={'flex p-1'}>
                                <div className={'text-black p-1 pt-1 pr-1 rounded bg-blue-200'}>
                                    Получать файл по частям
                                </div>
                                <label className="switch pl-1 ml-1">
                                    <input type="checkbox" checked={usingChunk} onChange={() => {
                                        setUsingChunk((prev) => !prev)}
                                    }/>
                                    <span className="slider-input round"></span>
                                </label>
                            </div>
                            <button className={'p-2 bg-blue-600 rounded text-white disabled:bg-blue-100'}
                                    onClick={sendFileHandler}
                                    disabled={readonly}
                            >
                                {
                                    category && category[fileType]?.clearAll
                                        ? 'Очистить файл'
                                        : 'Отправить'
                                }
                            </button>
                        </div>
                        {chunkLoading
                            && (
                                <div className={'text-amber-700 font-bold'}>
                                    Файл загружен не полностью. Загрузка файла происходит частично.
                                </div>
                            )
                        }
                        {codeEdit}
                    </>
                )
            }
        </div>
    );
})

export default EditorPage;