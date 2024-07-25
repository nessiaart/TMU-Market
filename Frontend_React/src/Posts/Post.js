import React, { useEffect, useState } from "react";
import "./post.css";
import { Trash } from 'phosphor-react';


function Post() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    price: "",
    category: "",
    location: "",
  });

  const [deletePostId, setDeletePostId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  
  const [, setLoading] = useState(false);
  const [user, setUser] = useState(null);


  const handleDeleteConfirmation = (postId) => {
    setDeletePostId(postId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setDeletePostId(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${deletePostId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("Post deleted successfully");
        fetchPosts();
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post", error);
    } finally {
      setDeletePostId(null);
      setShowDeleteConfirmation(false);
    }
  };

  // Function to fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "GET", 
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const fetchedPosts = await response.json();
        setPosts(fetchedPosts);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(posts);
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedUser);

        console.log("Decoded user ID: ", decodedUser.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [setUser]);

  const userPosts = user
    ? posts.filter((post) => {
        return (
          post.createdBy &&
          post.createdBy._id &&
          user.id &&
          post.createdBy._id.toString() === user.id.toString()
        );
      })
    : [];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You're not logged in. Please log in to continue.");
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    
    const submissionData = new FormData(event.target);

    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: submissionData, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Post created successfully");
        // Refresh the list of posts to include the new one
        fetchPosts();
        setFormData({
          title: "",
          description: "",
          tags: "",
          price: "",
          category: "",
          location: "",
        });
      } else if (response.status === 401) {
        alert("Session expired, Please log in gain.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        const result = await response.json();
        alert(`Failed to create post: Invalid Input! Try again!`);
      }
    } catch (error) {
      console.error("Error submitting the form", error);
      alert(`Error submitting the form: Invalid Input! Try again!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="section-heading">Create a New Post</h2>
      <form
        className="post-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter the title"
        />

        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Describe what you're selling (min. 10 characters)"
        />

        <label htmlFor="tags" className="form-label">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="form-input"
          placeholder="Add tags (comma-separated)"
        />

        <label htmlFor="postPics" className="form-label">
          Images
        </label>
        <input
          type="file"
          id="postPics"
          name="images" 
          className="form-input"
          multiple
          accept="image/*"
        />

        <label htmlFor="price" className="form-label">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter price CAD$"
        />

        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select a category</option>
          <option value="Items Wanted">Items Wanted</option>
          <option value="Items for Sale">Items for Sale</option>
          <option value="Academic Services">Academic Services</option>
        </select>

        <label htmlFor="location" className="form-label">
          Location
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select Location</option>
          <option value="DCC">DCC</option>
          <option value="ENG">ENG</option>
          <option value="TRSM">TRSM</option>
          <option value="SLC">SLC</option>
        </select>

        <button type="submit" className="form-submit-button">
          Post
        </button>
      </form>

      <h3 className="section-subheading">Your Posts</h3>
      <ul className="post-list">
        <div className="posts-container">
          {userPosts.map((post) => (
            <li key={post._id} className="post">
              <div className="postsingle">
                <div className="post-details">
                  <div className="post-image">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:3001/${image}`}
                        alt={post.title}
                      />
                    ))}
                  </div>
                  <br />

                  <h4 className="title">{post.title}</h4>
                  <div className="desc">
                    <p className="description">{post.description}</p>

                    <div className="post-info">
                      <span className="tags">Tags: {post.tags.join(", ")}</span>
                      <br />
                      <span className="location">
                        Location: {post.location}
                      </span>
                      <br />
                      <span className="category">
                        Category: {post.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="post-actions">
                <button className="delbutton" onClick={() => handleDeleteConfirmation(post._id)}><Trash size={25} /></button>
              </div>
              </div>
            </li>
          ))}
        </div>
      </ul>
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this post?</p>
          <button className="delbutton" onClick={handleDeleteConfirm}>Yes</button> <gap></gap>
          <button className="delbutton" onClick={handleDeleteCancel}>No</button>
        </div>
      )}
    </div>
  );
}

export default Post;
