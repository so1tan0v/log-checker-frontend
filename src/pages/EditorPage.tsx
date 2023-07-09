import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";

import CodeEditorWindow from "../components/CodeWindowEditor";
import Loader from "../components/Loader";
import {SELECTED_TAB, UNSELECTED_TAB} from "../consts";
import {isEmpty} from "lodash";

import {sleep} from "../helper";
import {store} from "../store/store";
import axios from "axios";
import {requestTimerStart} from "../store/actions";


const EditorPage = React.memo(() => {
    let [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [chunkLoading, setChunkLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedLpu, setSelectedLpu] = useState({name: '', availableLpuTypes: [''], readonly: false});

    const lpu= searchParams.get('lpu');
    let fileType= searchParams.get('fileType') ?? 'yaml'
    let lpuType= searchParams.get('lpuType') ?? 'Амбулатория'

    const [code, setCode] = useState('');
    const oldCode = useRef(code);

    const memoizedCode = useMemo(() => code, [code]);

    if((!selectedLpu || !selectedLpu.name || selectedLpu.name !== lpu) && lpu) {
        const selectedLpu = store.getState().availableLpu.find(item => item.name === lpu);
        if(selectedLpu) {
            setSelectedLpu({
                name              : selectedLpu.name,
                availableLpuTypes : selectedLpu.availableLpuTypes,
                readonly          : selectedLpu.readonly
            });
            // selectLpu(selectedLpu);
        }
    }

    const changeCode = (action:string, data:string) => {
        switch (action) {
            case "code":
                return setCode(data);
            default: {
                console.warn("case not handled!", action, data);
            }
        }
    };

    const onClickFileTypeTabs = (event: any) => {
        fileType = event.target.id
        if(lpu && fileType && lpuType) {
            setSearchParams({
                lpu,
                fileType,
                lpuType
            })
        }
    };

    const onClickLpuTypeTabs = (event: any) => {
        lpuType = event.target.id
        if(lpu && fileType && lpuType) {
            setSearchParams({
                lpu,
                fileType,
                lpuType
            })
        }
    };

    const sendFileHandler = async () => {
        if(!(lpu && fileType && lpuType)) {
            alert('Не могу отправить файл.')
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/sendNodeFile', {
                id: lpu,
                fileType,
                lpuType,
                node: fileType === 'error'
                    ? ''
                    : code ?? ''
            })
        } catch (e: any) {
            setLoading(false);
            setError(e.message)
        }
        setLoading(false);

        await getFile();
    }

    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const getFileContent = async () => {
        if(lpu) {
            const url = new URL('/api/getFileByLpuIdAndTypeNew', window.location.origin);
            const params = new URLSearchParams();
            params.append('id', lpu);
            params.append('fileType', fileType);
            params.append('lpuType', lpuType);
            url.search = params.toString();

            const currentAbortController = new AbortController();
            setAbortController(currentAbortController);

            try {
                requestTimerStart(true);
                const response = await fetch(url, {
                    method : 'GET',
                    signal : currentAbortController.signal
                });
                setLoading(false);
                setChunkLoading(true);
                if(response.body) {
                    const reader = response.body.getReader();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            setAbortController(null);
                            setChunkLoading(false);
                            requestTimerStart(false);
                            break;
                        }
                        const decoder = new TextDecoder('utf-8');
                        const chunk = decoder.decode(value);

                        if(chunk) {
                            await sleep(10);
                            setCode(oldCode.current + chunk);
                        }
                    }
                }
            } catch (e) {
                requestTimerStart(false);
                setCode('');
                console.log('Запрос бы отменен');
            }
        }
    }

    const getFile = useCallback(async () => {
        setCode('');
        setLoading(true);
        setError('');
        if (abortController) {
            abortController.abort(); // Отменить запрос при размонтировании компонента
        }
        await getFileContent()
    }, [lpu, fileType, lpuType]);

    useEffect(() => {
        oldCode.current = code;
    }, [code])

    useEffect(() => {
        getFile();
    }, [lpu, fileType, lpuType])

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
    }, [loading, error, fileType, memoizedCode, chunkLoading, oldCode]);

    return (
        <div className={'container mx-auto max-w-[50%] pt-5'}>
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
                                    selectedLpu?.availableLpuTypes?.map(item => {
                                        return (
                                            <li className="mr-2" key={item}>
                                                <button onClick={onClickLpuTypeTabs}
                                                        id={item}
                                                        className={lpuType === item ? SELECTED_TAB : UNSELECTED_TAB}
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li className="mr-2">
                                    <button onClick={onClickFileTypeTabs}
                                            id={'yaml'}
                                            className={fileType === 'yaml' ? SELECTED_TAB : UNSELECTED_TAB}
                                    >
                                        yaml
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button onClick={onClickFileTypeTabs}
                                            id={'error'}
                                            className={fileType === 'error' ? SELECTED_TAB : UNSELECTED_TAB}
                                    >
                                        Error log
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className={'w-full pt-2 justify-items-end pb-2 h-[50px] items-center flex justify-between text-white'}>
                            <button className={'p-2 mr-0 bg-indigo-500  rounded text-white disabled:bg-blue-100'}
                                    onClick={getFile}
                            >
                                Обновить
                            </button>
                            <button className={'p-2 bg-blue-600 rounded text-white disabled:bg-blue-100'}
                                    onClick={sendFileHandler}
                                    disabled={selectedLpu?.readonly}
                            >
                                {
                                    fileType === 'error'
                                        ? 'Очистить лог'
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