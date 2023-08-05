import React, { useCallback } from "react";
import {useSearchParams} from "react-router-dom";

import {isEmpty} from "lodash";

import {SELECTED_TAB, UNSELECTED_TAB} from "../../consts";
import {getLpuById} from "../../helper";
import CodeEditor from "./TabbedCodeEditorComponent";


const IntegratedEditorComponent = React.memo(() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const lpu   = searchParams.get('lpu')      ?? '';
    let fileType= searchParams.get('fileType') ?? '',
        lpuType = searchParams.get('lpuType')  ?? '',
        selectedLpu = getLpuById(lpu);

    if(!selectedLpu && lpu) {
        debugger
        setSearchParams({});
    }

    const category = selectedLpu?.category;

    const onClickFileTypeTabs = useCallback((event: any) => {
        const newFileType = event.target.id;
        if (lpu && newFileType && lpuType) {
            setSearchParams({
                lpu,
                fileType: newFileType,
                lpuType,
            });
        }
    }, [lpu, lpuType, setSearchParams]);

    const onClickLpuTypeTabs = useCallback((event: any) => {
        const newLpuType = event.target.id;
        if (selectedLpu) {
            const availableFileTypes = Object.keys(selectedLpu.category[newLpuType]);
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
    }, [lpu, fileType, setSearchParams, selectedLpu]);

    if(isEmpty(lpu)) {
        return (
            <div className={'justify-center w-full mx-auto max-w-[70%] pt-5'}>
                Выберите ЛПУ
            </div>
        );
    }

    return (
        <div className={'justify-center w-full mx-auto max-w-[70%] pt-5'}>
            <div className={'items-center flex justify-between text-white'}>
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                    {
                        lpuType && category &&
                            Object.keys(category)?.map((item: string) => {
                                return (
                                    <li id={item} key={item} className="mr-2">
                                        <button onClick   = {onClickLpuTypeTabs}
                                                id        = {item}
                                                className = {lpuType === item ? SELECTED_TAB : UNSELECTED_TAB}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                );
                            })
                    }
                </ul>
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                        {
                            lpuType && category &&
                                Object.keys(category[lpuType]).map((type) => {
                                    return (
                                        <li id={type} key={type} className="mr-2">
                                            <button
                                                onClick   = {onClickFileTypeTabs}
                                                id        = {type}
                                                className = {fileType === type ? SELECTED_TAB : UNSELECTED_TAB}
                                            >
                                                {type}
                                            </button>
                                        </li>
                                    );
                                })
                        }
                </ul>
            </div>
            <CodeEditor
                lpu      = {lpu}
                lpuType  = {lpuType}
                fileType = {fileType}
            />
        </div>
    );
})

export default IntegratedEditorComponent;