import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

import CodeEditorWindow from "../components/CodeWindowEditor";
import Loader from "../components/Loader";
import {SELECTED_TAB, UNSELECTED_TAB} from "../consts";
import {isEmpty} from "lodash";

import {getFileByLpuIdAndType} from "../helper";
import {store} from "../store/store";
import {ISelectedLpu} from "../interface";
import {selectLpu} from "../store/actions";
import axios from "axios";


export default function StartPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const lpu= searchParams.get('lpu');
    let fileType= searchParams.get('fileType') ?? 'yaml'
    let lpuType= searchParams.get('lpuType') ?? 'Амбулатория'

    const changeCode = (action:string, data:string) => {
        switch (action) {
            case "code": {
                return setCode(data);
            }
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
        await axios.post('/api/sendNodeFile', {
            id: lpu,
            fileType,
            lpuType,
            node: fileType === 'error'
                ? ''
                : code ?? ''
        })
        setLoading(false);

        getFile();
    }

    const getFile = () => {
        setLoading(true)
        setError('');
        if(lpu)
            getFileByLpuIdAndType(lpu, fileType, lpuType)
                .then(fileNode => {
                    setCode(fileNode)
                    setLoading(false)
                })
                .catch(error => {
                    setLoading(false);
                    setError(`Произошла ошибка. Обратитесь к @sasha в ТАДАМе: \n\r ${error.message}`);
                });
    }

    useEffect( () => {
        getFile()
    }, [lpu, fileType, lpuType]);

    let selectedLpu : ISelectedLpu = store.getState().selectLpu;
    if(!selectedLpu && lpu) {
        const selectedLpu = store.getState().availableLpu.find(item => item.name === lpu);
        if(selectedLpu) {
            selectLpu({
                name: selectedLpu.name,
                availableLpuTypes: selectedLpu.availableLpuTypes
            });
        }
    }

    const codeEdit = loading
        ?  (
            <div>
                {fileType === 'error' && <div className={'text-amber-700 font-bold'}>Загрузка может происходит долго, т.к файлы лога могу весить очень много. <br />Рекомендуется такие логи очищать (они не удаляются, а заменяются на пустой. Старый лог остается)</div>}
                <Loader/>
            </div>
        )
        : (
            error
                ?  (<div className={'w-full text-amber-800 font-bold'}>
                    {error}
                </div>)
                : (
                    <div className={'pb-5'}>
                        <div className={'w-full'}>{fileType === 'error' ? 'Текст ошибок' : 'Конфигурационный файл'}</div>
                        <CodeEditorWindow
                            code={code}
                            onChange={changeCode}
                            language={fileType}
                            theme={'oceanic-next'}/>
                    </div>
                )
        )

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
                                            <li className="mr-2">
                                                <button onClick={onClickLpuTypeTabs} id={item}
                                                        className={lpuType === item ? SELECTED_TAB : UNSELECTED_TAB}>
                                                    {item}
                                                </button>
                                            </li>
                                        )
                                    })
                                }


                                {/*<li className="mr-2">*/}
                                {/*    <button onClick={onClickLpuTypeTabs} id={'Амбулатория'}*/}
                                {/*            className={lpuType === 'Амбулатория' ? SELECTED_TAB : UNSELECTED_TAB}>*/}
                                {/*        {'Амбулатория'}*/}
                                {/*    </button>*/}
                                {/*</li>*/}

                                {/*<li className="mr-2">*/}
                                {/*    <button onClick={onClickLpuTypeTabs} id={'Стационар'}*/}
                                {/*            className={lpuType === 'Стационар' ? SELECTED_TAB : UNSELECTED_TAB}>*/}
                                {/*        Стационар*/}
                                {/*    </button>*/}
                                {/*</li>*/}
                            </ul>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li className="mr-2">
                                    <button onClick={onClickFileTypeTabs} id={'yaml'}
                                            className={fileType === 'yaml' ? SELECTED_TAB : UNSELECTED_TAB}>
                                        yaml
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button onClick={onClickFileTypeTabs} id={'error'}
                                            className={fileType === 'error' ? SELECTED_TAB : UNSELECTED_TAB}>
                                        Error log
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className={'w-full grid pt-2 justify-items-end pb-2'}>
                            <button className={'p-2 bg-blue-600 rounded text-white'} onClick={sendFileHandler}>
                                {
                                    fileType === 'error'
                                        ? 'Очистить лог'
                                        : 'Отправить'
                                }
                            </button>
                        </div>
                        {codeEdit}
                    </>
                )
            }
        </div>
    );
}