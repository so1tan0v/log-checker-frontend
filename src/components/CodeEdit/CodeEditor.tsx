import React, { useCallback, useEffect, useMemo, useState } from "react";

import CodeEditorWindow from "./CodeWindowEditor";
import axios from "axios";

import {getFileContent, getLpuById} from "../../helper";
import {useDispatch, useSelector} from "react-redux";
import {setLoader} from "../../store/actions";
import {AppDispatch, IRootState} from "../../store/rootReduser";
import JsonFormatter from "react-json-formatter";

interface CodeEditorProps {
    lpu      : string,
    lpuType  : string,
    fileType : string
}

const jsonStyle = {
    propertyStyle : {color: 'black'},
    stringStyle   : {color: 'green'},
    numberStyle   : {color: 'darkorange'}
}

const CodeEditor = (props: CodeEditorProps) => {
    const {
        lpu,
        lpuType,
        fileType
    } = props ?? {
        lpu      : '',
        lpuType  : '',
        fileType : ''
    };

    const dispatch: AppDispatch = useDispatch();

    const [chunkLoading, setChunkLoading] = useState(false);
    const [usingChunk, setUsingChunk] = useState(true);

    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const selectedLpu = getLpuById(lpu);
    const category = selectedLpu?.category;

    const loading = useSelector((state: IRootState) => state.app.loader);

    const readonly = useMemo(() => {
        if (fileType && category && category.hasOwnProperty(lpuType)) {
            return category[lpuType][fileType].readonly || false;
        }
        return false;
    }, [fileType, lpuType, lpu, category]);

    const changeCode = useCallback((action: string, data: string) => {
        switch (action) {
            case "code":
                setCode(data);
                break;
            default:
                console.warn("case not handled!", action, data);
        }
    }, []);

    const sendFileHandler = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!(lpu && fileType && lpuType)) {
            alert("Не могу отправить файл.");
            return;
        }

        dispatch(setLoader(true));
        try {
            await axios.post("/api/sendNodeFile", {
                id: lpu,
                fileType,
                lpuType,
                node: event.currentTarget.id === 'clearAll' ? "" : code || "",
            });
        } catch (e: any) {
            setError(e.message);
        }
        dispatch(setLoader(false));

        await getFile();
    }, [lpu, fileType, lpuType, code, category, readonly]);

    const getFile = useCallback(async () => {
        if (abortController) {
            await abortController.abort();
        }
        setCode("");
        dispatch(setLoader(true));
        setError("");
        await getFileContent({
            lpu,
            fileType,
            lpuType,
            usingChunk,
            setAbortController,
            setChunkLoading,
            setCode,
            setError
        });
        dispatch(setLoader(false));
    }, [lpu, fileType, lpuType, usingChunk, abortController, readonly]);

    useEffect(() => {
        getFile();
    }, [lpu, fileType, lpuType]);


    const codeEdit = useMemo(() => {
        if (loading) {
            return (
                <div>
                    {fileType === 'error' &&
                        <div className={'text-amber-700 font-bold'}>
                            Загрузка может происходить долго, т.к файлы лога могут весить очень много. <br />Рекомендуется такие логи очищать (они не удаляются, а заменяются на пустой. Старый лог остается)
                        </div>
                    }
                </div>
            );
        } else if (error) {
            return (
                <div className={'w-full text-amber-800 font-bold'}>
                    Произошел отвал. Обратись к @sasha в ТАДАМ
                    <JsonFormatter
                        json={error}
                        tabWith={4}
                        jsonStyle={jsonStyle}
                    />
                </div>
            );
        } else {
            return (
                <div className={'pb-5'}>
                    <CodeEditorWindow
                        code     = {code}
                        onChange = {changeCode}
                        language = {fileType}
                        theme    = {'oceanic-next'}
                    />
                </div>
            );
        }
    }, [error, code, chunkLoading, loading, readonly]);

    return (
        <div className={'justify-center w-full mx-auto max-w-[70%] pt-5'}>
            <div className={'w-full pt-2 justify-items-end pb-2 h-[50px] items-center flex justify-between text-white'}>
                <button className = {'p-2 mr-0 bg-indigo-500  rounded text-white disabled:bg-blue-100'}
                        onClick   = {getFile}
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
                <div className={'flex space-x-1'}>
                    {category && fileType && lpuType && category[lpuType][fileType]?.clearAll
                        ? (
                            <button className = {'p-2 bg-blue-600 rounded text-white disabled:bg-blue-100'}
                                    onClick   = {sendFileHandler}
                                    id={'clearAll'}
                                    disabled  = {readonly}
                            >
                                Очистить файл
                            </button>
                        )
                        : ``}
                    <button className = {'p-2 bg-blue-600 rounded text-white disabled:bg-blue-100'}
                            onClick   = {sendFileHandler}
                            id={'sendFile'}
                            disabled  = {readonly}
                    >
                        Отправить
                    </button>
                </div>
            </div>
            {chunkLoading
                && (
                    <div className={'text-amber-700 font-bold'}>
                        Файл загружен не полностью. Загрузка файла происходит частично.
                    </div>
                )
            }
            {codeEdit}
        </div>
    );
}

export default CodeEditor;