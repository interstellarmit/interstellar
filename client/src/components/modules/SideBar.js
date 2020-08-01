import React from "react";

function SideBar(props) {
    return <>
        <div>SideBar</div>
        <button onClick = {props.handleLogout}>Logout</button>
    </>
}

export default SideBar;