import React, { useState, useEffect } from "react";
 
import "./ProfileInfo.css";

function ProfileInfo() {
  const [userData, setUserData] = useState(null);

  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    fetchUserData();
    getRandomImage();
  }, []);

  const imageList = [
    "https://cdn-icons-png.flaticon.com/128/9308/9308861.png",
    "https://cdn-icons-png.flaticon.com/128/9459/9459313.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308904.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308963.png",
    "https://cdn-icons-png.flaticon.com/128/1972/1972498.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308916.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308864.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308979.png",
    "https://cdn-icons-png.flaticon.com/128/1440/1440572.png",
    "https://cdn-icons-png.flaticon.com/128/5448/5448005.png",
    "https://cdn-icons-png.flaticon.com/128/1183/1183760.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308879.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308872.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308891.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308930.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308957.png",
    "https://cdn-icons-png.flaticon.com/128/9308/9308945.png",
  ];
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    const randomImageUrl = imageList[randomIndex];
    setRandomImage(randomImageUrl);
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

  return (
    <div className="section profile-info">
      <h2 className="section-heading">Profile Information</h2>
      <div className="profile-details">
        <img src={randomImage} alt="Random Image" className="random-image" />
        <div className="leftdet">
          {userData && (
            <div className="profile-infor">
              <p>
                {" "}
                {userData.fname} {userData.lname}
              </p>
              <p> {userData.email} </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
