import React, { useState, useEffect } from "react";
import "./home.css";
import Weather from "./weather";
import ClickedAd from "../ClickedAd/ClickedAd.js";

function Home({ username, onBackButtonClick }) {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    date: "",
  });

  const [posts, setPosts] = useState([]);
  const [clickedPost, setClickedPost] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchPosts({});
  }, []);

  const handleClickedAd = (post) => {
    setClickedPost(post);
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dashboard", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
        }),
      });
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

const fetchPosts = async (appliedFilters) => {
  const token = localStorage.getItem("token");
  let query = new URLSearchParams();

  for (const filter in appliedFilters) {
    if (appliedFilters[filter]) {
      query.append(filter, appliedFilters[filter]);
    }
  }

  // Log the applied filters to see what's being sent to the backend
  console.log('Applied Filters:', appliedFilters);

  const url = `http://localhost:3001/api/posts?${query.toString()}`;

  // Log the final URL to verify the query string is correctly constructed
  console.log('Fetching posts with URL:', url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const fetchedPosts = await response.json();
      // Sort the fetchedPosts array based on the createdAt field in descending order
      fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(fetchedPosts);
    } else {
      console.error("Failed to fetch posts");
    }
  } catch (error) {
    console.error("Error fetching posts", error);
  }
};

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    console.log("Filters:", filters);
    const appliedFilters = { ...filters, query: searchQuery };
    fetchPosts(appliedFilters);
   
  };


  const handleFilterChange = (filterName, value) => {
  setFilters(prevFilters => {
    const newFilters = { ...prevFilters, [filterName]: value };
    fetchPosts(newFilters);

    return newFilters;
  });
};


  const handleBack = () => {
    onBackButtonClick(); 
    setClickedPost(null);
  };
  return (
    <div className="home-container">
      <header className="home-header">
        <Weather />
        <h2>Welcome to TMU Market</h2>
        <div>
          <br />
          {userData && (
            <div>
              <p>Hi, {userData.fname}! Welcome back to TMU market!</p>
              <br />
            </div>
          )}
        </div>
      </header>

      {clickedPost ? (
        <div>
        <button className="backbutton" style = {{ margin: "5px", textAlign: "left" }} onClick={handleBack}> Back To Ads</button>
        <ClickedAd post={clickedPost} userData={userData} />
        
        </div>
      ) : (
        <div>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search query"
              className="search-input"
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div className="filter-container">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Select Category</option>
              <option value="Wanted">Items wanted</option>
              <option value="Sale">Items for Sale</option>
              <option value="Academics">Academic Services</option>
            </select>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Select Location</option>
              <option value="DCC">DCC</option>
              <option value="TRSM">TRSM</option>
              <option value="ENG">ENG</option>
              <option value="SLC">SLC</option>
            </select>
            <select
              value={filters.price}
              onChange={(e) => handleFilterChange("price", e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Select Price Range</option>
              <option value="<10">Less than $10</option>
              <option value="10-50">$10 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value=">100">More than $100</option>
            </select>

          </div>

          <h3 className="section-subheading">Listed Posts</h3>
          <ul className="post-list">
            <div className="posts-container">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="post"
                  onClick={() => handleClickedAd(post, userData)}
                >
                  <div className="postsingle">
                    <div className="post-details">
                      <div className="post-image">
                        {post.images &&
                          post.images.map((image, index) => (
                            <img
                              key={index}
                              src={`http://localhost:3001/${image}`}
                              alt={post.title}
                            />
                          ))}
                      </div>
                      <div className="post-details">
                        <h4 className="title">{post.title}</h4>
                        <p className="description">{post.description}</p>

                        <div className="post-info">
                          <span className="price">${post.price}</span>
                          <br />
                          <span className="tags">{post.tags.join(", ")}</span>
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
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
