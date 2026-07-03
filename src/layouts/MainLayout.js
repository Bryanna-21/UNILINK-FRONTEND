import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

import "../styles/layout/layout.css";

export default function MainLayout(){

return(

<div className="layout">

<Sidebar/>

<div className="main">

<Topbar/>

<div className="content">

<Outlet/>

</div>

</div>

</div>

);

}
