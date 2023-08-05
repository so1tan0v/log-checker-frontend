import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {isEmpty} from "lodash";

import IntegratedEditorComponent from "../components/CodeEditor/IntegratedEditorComponent"
import LeftPanel from "../components/LeftPanel";
import Loader from "../components/Loader";
import {AppDispatch, IRootState} from "../store/rootReduser";
import {availableLpuStore} from "../store/actions";


function EditorPage() {
    const dispatch: AppDispatch = useDispatch();
    const availableLpu = useSelector((state: IRootState) => state.availableLpu);

    useEffect(() => {
        dispatch(availableLpuStore())
    }, [dispatch]);

    if(isEmpty(availableLpu) ) {
        return (
            <Loader />
        )
    }
    return (
        <>
            <Loader />
            <div className={'flex h-full'}>
                <LeftPanel />
                <Routes>
                    <Route path={'/'}          element={<IntegratedEditorComponent />}/>
                    <Route path={'/:id/:type'} element={<IntegratedEditorComponent />}/>
                </Routes>
            </div>
        </>
    );
}

export default EditorPage;
