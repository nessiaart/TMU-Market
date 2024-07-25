import React from 'react';
import { Link } from 'react-router-dom';
import { BsActivity, BsFilePost, BsHouseDoorFill, BsPeopleFill } from 'react-icons/bs';
import {MdManageAccounts} from 'react-icons/md';

function Sidebar({ logOut }) {
    const handleLogout = () => {
        // Clear local storage and redirect to the sign-in page
        window.localStorage.clear();
        window.location.href = "/sign-in";
    };
    return (
        <aside id="sidebar">
            <div className='sidebar-title'>
                <div>
                    <img src={require('./tmulogo.png')} className="logo" />
                </div>

                <span className='icon close_icon'>X</span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to="/Adminhome">
                    <div className="sidebar-item-content">
                            <BsHouseDoorFill className='icon'/>
                            <b>HOME</b>
                        </div>
                    </Link>                    
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/manage-user">
                        <div className="sidebar-item-content">
                            <BsPeopleFill className='icon'/>
                            <b>MANAGE USERS</b>
                        </div>
                    </Link>
                </li>

                <li className='sidebar-list-item'>
                    <Link to="/manage-posts" className="sidebar-link">
                        <div className="sidebar-item-content">
                            <BsFilePost className="icon" />
                            <b>MANAGE POSTS</b>
                        </div>
                    </Link>
                </li>
                <li >
                    <button className="sommie-logout-button" onClick={handleLogout} ><b>LOGOUT</b></button>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;