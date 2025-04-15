import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./views/Root";
import LandingPage from "./views/LandingPage";
import UsersLogin from "./views/UsersLogin";
import SignUp from "./views/UserResister";
import DashboardLayout from "./views/DashboardLayout";
import Dashboard from "./views/Dashboard";
import Expenses from "./views/Expenses";
import Earnings from "./views/Income";
import Settings from "./views/Settings";


const router=createBrowserRouter([
    {
        path:'/',
        element:<Root/>,
        children:[
            {
                index:true,
                element:<LandingPage/>
            },
            {
                path:'/login',
                element:<UsersLogin/>
            },{
                path:'register',
                element:<SignUp/>
            },{
                path:'layout/',
                element:<DashboardLayout/>,
                children:[
                    {
                        index:true,
                        element:<Dashboard/>
                    },{
                        path:'expenses',
                        element:<Expenses/>
                    },{
                        path:'earnings',
                        element:<Earnings/>
                    },{
path:'settings',
                        element:<Settings/>
                    }
                ]
            }
        ]
    }
])

export default function App(){
    return (<RouterProvider router={router}/>)
}
