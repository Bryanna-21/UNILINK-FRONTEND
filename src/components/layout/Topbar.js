import "./../../styles/layout/topbar.css";

import {
FaSearch,
FaBell,
FaUserCircle
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

export default function Topbar(){

const {user}=useAuth();

return(

<header className="topbar">

<div className="search-box">

<FaSearch/>

<input

type="text"

placeholder="Search anything..."

 />

</div>

<div className="topbar-right">

<button className="notification-btn">

<FaBell/>

<span className="notification-badge">

3

</span>

</button>

<div className="profile-box">

<FaUserCircle size={35}/>

<div>

<h4>

{user?.name}

</h4>

<p>

{user?.role}

</p>

</div>

</div>

</div>

</header>

);

}
