import React, { useState, useEffect } from 'react';
import { BsFillTrashFill } from 'react-icons/bs'; // Import icons for edit and delete
import { FaEdit } from 'react-icons/fa';
import Header from './Header'; // Import the Header component
import Sidebar from './Sidebar'; // Import the Sidebar component


function ManageUser() {
    const [users, setUsers] = useState([]);
    const [newFirstName, setNewFirstName] = useState('');

    // Function to handle editing the first name
    const editFirstName = async (email) => {
        const confirmChange = window.confirm(`Are you sure you want to change this user's first name to ${newFirstName}?`);
        if (confirmChange) {
           try {
            // Send a request to the server to update the first name
            const response = await fetch(`http://localhost:3001/users/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fname: newFirstName }), // Send the new first name
            });
            if (response.ok) {
                // If the update is successful, fetch the updated user list
                fetchUsers();
            } else {
                console.error('Failed to update first name');
            }
        } catch (error) {
            console.error('Error editing first name:', error);
        } 
        }
        
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    // Function to fetch all users from the server
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (email) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (confirmDelete) {
            try {
                await fetch(`http://localhost:3001/users/${email}`, {
                    method: 'DELETE',
                });
                // Update the user list after deletion
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className='sommie-grid-container'> {/* Add the grid-container div */}
        <Header /> {/* Render the Header component */}
        <Sidebar /> {/* Render the Sidebar component */}
        <main>
            <h9>Manage Users</h9>
            <table>
                <thead>
                    <tr>
                        <th>FIRST NAME</th>
                        <th>LAST NAME</th>
                        <th>EMAIL</th>
                        <th>UPDATE USERNAME</th>
                        <th>DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.email}> {/* Use email as the key */}
                            <td>
                            {user.fname}
                                {/* Display input field to edit first name */}
                                
                            </td>
                            <td>{user.lname}</td>
                            <td>{user.email}</td>
                            <td> Change First Name
                                <input
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                /><FaEdit 
                            style={{ color: 'blue', cursor: 'pointer', transition: 'transform 0.2s' }} 
                            onClick={() => editFirstName(user.email)}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'} // Enlarge on hover
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} // Reset size on mouse leave 

                            
                            
                            /></td> 

                            <td>
                            <BsFillTrashFill 
                                style={{ color: 'red', cursor: 'pointer', transition: 'transform 0.2s' }} 
                                onClick={() => deleteUser(user.email)}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'} // Enlarge on hover
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} // Reset size on mouse leave
                            /></td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
        </div>
    );
}

export default ManageUser;
