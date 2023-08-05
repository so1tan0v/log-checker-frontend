import React, {useEffect} from 'react';
import {Route, Routes, useNavigate, useLocation} from "react-router-dom";

import EditorPage from "./EditorPage";
import {Header} from "../components/Header";


function MainPage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate(`/editor${location.search}`);
        }
    }, [navigate, location]);


    return (
        <>
            <Header />
            <Routes>
                <Route path={'/'} element={<EditorPage />}/>
                <Route path={'/editor'} element={<EditorPage />}/>
            </Routes>
        </>
    );
}

export default MainPage;
