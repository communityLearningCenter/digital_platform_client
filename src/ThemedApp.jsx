import { useState, useMemo, createContext, useContext } from "react";
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { QueryClientProvider, QueryClient } from "react-query";

import { grey } from "@mui/material/colors";

import Template from "./Template";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TeacherRegisteration from "./pages/TeacherRegisteration"; 
import TeachersList from "./pages/TeacherList";   
import StuRegisteration from "./pages/StudentRegisteration";
import StuList from "./pages/StudentList";
import LCList from "./pages/LearningCenter";
import ExamResults from "./pages/ExamResult";
import ExamResultsList from "./pages/ExamResultList";

const AppContext = createContext();

export function useApp(){
    return useContext(AppContext);
}

export const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path:"/",
        element:<Template></Template>,
        children:[
            {
                path:"/home",
                element:<Home/>,
            },
            {
                path:"/",
                element:<Login/>,
            },            
            {
                path:"/register",
                element:<Register/>,
            },
            {
                path:"/profile/:id",
                element:<Profile/>
            },
            {
                path:"/teachersregisteration",
                element:<TeacherRegisteration/>,
            },
            {
                path:"/teachers",
                element:<TeachersList/>,
            },
            {
                path:"/registration",
                element:<StuRegisteration/>,
            },
            {
                path:"/registration/:id",
                element:<StuRegisteration/>,
            },
            {
                path:"/students",
                element:<StuList/>,
            },
            {
                path:"/learningcenters",
                element:<LCList/>,
            },
            {
                path:"/examresult",
                element:<ExamResults/>,
            },
            {
                path:"/examresultlist",
                element:<ExamResultsList/>,
            },
        ],
    },    
]);

export default function ThemedApp() {
    
    const [showDrawer, setShowDrawer] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [globalMsg, setGlobalMsg] = useState(null);    
    const [auth, setAuth] = useState(null);
    const [mode, setMode] = useState("light");

    const theme = useMemo(() => {
        return createTheme({
            //palette: {mode},
            palette: {
                mode, 
                primary: {main:"#eceff1"},//{main: "#ff5722"}, 
                banner: mode === "dark" ? grey [800] : grey[200], 
                text:{fade: grey[500],},
            }
        });
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider 
                value = {{ 
                    showDrawer, setShowDrawer,
                    showForm, setShowForm, 
                    globalMsg, setGlobalMsg,
                    auth, setAuth,
                    mode, setMode,                     
                    }}> 
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
                <CssBaseline/>
            </AppContext.Provider>
        </ThemeProvider>
    );
}