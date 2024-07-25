import React, { useState, useEffect } from 'react';
import { BsActivity, BsFilePost, BsPeopleFill } from 'react-icons/bs';
import { MdManageAccounts } from 'react-icons/md';
import Header from './Header'; // Import the Header component
import Sidebar from './Sidebar'; // Import the Sidebar component
import './SommieApp.css';


function AdminHome() {
    const [userCount, setUserCount] = useState(0); // State to store the number of users
    const [postCount, setPostCount] = useState(0);

    useEffect(() => {
        fetchUserCount(); // Fetch the number of users when the component mounts
        fetchPostCount(); // Fetch the number of posts when the component mounts
    }, []);

    // Function to fetch the number of users from the server
    const fetchUserCount = async () => {
        try {
            const response = await fetch('http://localhost:3001/users/count');
            const data = await response.json();
            setUserCount(data.count); // Update the user count state
        } catch (error) {
            console.error('Error fetching user count:', error);
        }
    };

    // Function to fetch the number of posts from the server
    const fetchPostCount = async () => {
        try {
            const response = await fetch('http://localhost:3001/posts/count');
            const data = await response.json();
            setPostCount(data.count); // Update the post count state
        } catch (error) {
            console.error('Error fetching post count:', error);
        }
    };

    return (
        <div className='sommie-grid-container'> {/* Add the grid-container div */}
            <Header /> {/* Render the Header component */}
            <Sidebar /> {/* Render the Sidebar component */}
            <main className='sommie-container'>
                <div className='sommie-title'>
                    <h9><b>DASHBOARD</b></h9>
                </div>

                <div className='sommie-cards'>
                    <div className='cardforsommie'>
                    <h3><b>USERS</b></h3>
                        <div className='sommiecard-inner'>
                            
                            <BsPeopleFill className='sommiecard_icon'/>
                        </div>
                        <h6>{userCount}</h6> {/* Display the user count */}
                    </div>
                    <div className='cardforsommie'>
                    <h3><b>POSTS</b></h3>
                        <div className='sommiecard-inner'>
                            
                            <BsFilePost className='sommiecard_icon'/>
                        </div>
                        <h6>{postCount}</h6>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminHome;