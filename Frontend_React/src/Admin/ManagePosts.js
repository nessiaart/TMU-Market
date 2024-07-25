import React, { useState, useEffect } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import Header from './Header'; // Import the Header component
import Sidebar from './Sidebar'; // Import the Sidebar component

function ManagePosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts data from the backend API
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3001/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const deletePost = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this Post? This action cannot be undone.');
        if (confirmDelete) {
            try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            // Remove the deleted post from the state
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        }
        
    };

    return (
        <div className='sommie-grid-container'> {/* Add the grid-container div */}
        <Header /> {/* Render the Header component */}
        <Sidebar /> {/* Render the Sidebar component */}
        <main>
            <h9>MANAGE POSTS</h9>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>POST TITLE</th>
                        <th>POST ID</th>
                        <th>DESCRIPTION</th>
                        <th>TIMESTAMP</th>
                        <th>DELETE POST</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post._id}>
                            <td>{post.title}</td>
                            <td>{post._id}</td>
                            <td>{post.description}</td>
                            <td>{post.createdAt}</td>
                            <BsFillTrashFill 
                                style={{ color: 'red', cursor: 'pointer', transition: 'transform 0.2s' }} 
                                onClick={() => deletePost(post._id)}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'} // Enlarge on hover
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} // Reset size on mouse leave
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
        </div>
    )
}

export default ManagePosts;