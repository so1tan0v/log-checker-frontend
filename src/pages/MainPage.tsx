import React, {useEffect} from 'react';
import {Route, Routes, useNavigate, useLocation} from "react-router-dom";

import EditorPage from "./EditorPage";
import {Header} from "../components/Header";


function MainPage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/') {
            const search = window.location.search;
            history.pushState({}, document.title, window.location.pathname);
            navigate(`editor${search}`);
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
