import React from 'react';
import {Route, Routes} from "react-router-dom";

import EditorPage from "./pages/EditorPage";

import {Header} from "./components/Header";
import LeftPanel from "./components/LeftPanel";

function App() {
    return (
        <>
            <Header />
            <div className={'flex'}>
                <LeftPanel />
                <Routes>
                    <Route path={'/'} element={<EditorPage />}/>
                    <Route path={'/:id/:type'} element={<EditorPage />}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
