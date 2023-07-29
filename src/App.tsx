import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import EditorPage from "./pages/EditorPage";
import {Header} from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import Loader from "./components/Loader";
import {AppDispatch, IRootState} from "./store/rootReduser";
import {availableLpuStore} from "./store/actions";


function App() {
    const dispatch: AppDispatch = useDispatch();
    const availableLpu = useSelector((state: IRootState) => state.availableLpu);

    useEffect(() => {
        dispatch(availableLpuStore())
    }, [dispatch]);

    if(!availableLpu) {
        return (
            <Loader />
        )
    }
    return (
        <>
            <Header />
            <Loader />
            <div className={'flex'}>
                <LeftPanel />
                <Routes>
                    <Route path={'/'}          element={<EditorPage />}/>
                    <Route path={'/:id/:type'} element={<EditorPage />}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
