import React from 'react';
import {Route, Routes} from "react-router-dom";

import StartPage from "./pages/EditorPage";

import {Header} from "./components/Header";
import LeftPanel from "./components/LeftPanel";

function App() {
    return (
        <>
            <Header />
            <LeftPanel />
            <Routes>
                <Route path={'/'} element={<StartPage />}/>
                <Route path={'/:id/:type'} element={<StartPage />}/>
            </Routes>
        </>
    );
}

export default App;
