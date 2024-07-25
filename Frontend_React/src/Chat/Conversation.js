import React, { useState, useEffect } from 'react';
import {getUser} from "../utils/userRequest.js"

const Conversation = ({ data, currentUserId, online}) => {
    const [userData, setUserData] = useState(null);
    const [randomImage, setRandomImage] = useState("");

    useEffect(() => {
        console.log(data);
        console.log(currentUserId);

       
        if (data && data.members) {
            const userId = data.members.find((id) => id !== currentUserId);
            const getUserData = async()=>{
                try{
                    const {data} = await getUser(userId);
                    setUserData(data);
                    console.log(data);

                     
                     const imageList = [
                        'https://cdn-icons-png.flaticon.com/128/9308/9308861.png',
                        'https://cdn-icons-png.flaticon.com/128/9459/9459313.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308904.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308963.png',
                        'https://cdn-icons-png.flaticon.com/128/1972/1972498.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308916.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308864.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308979.png',
                        'https://cdn-icons-png.flaticon.com/128/1440/1440572.png',
                        'https://cdn-icons-png.flaticon.com/128/5448/5448005.png',
                        'https://cdn-icons-png.flaticon.com/128/1183/1183760.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308879.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308872.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308891.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308930.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308957.png',
                        'https://cdn-icons-png.flaticon.com/128/9308/9308945.png'
                    ];
                    const randomIndex = Math.floor(Math.random() * imageList.length);
                    const randomImageUrl = imageList[randomIndex];
                    setRandomImage(randomImageUrl); 
                }
                catch(error){
                    console.log(error);
                }
            }
            getUserData();
        }


    }, [data, currentUserId]);
    return (
        <div className="contact-block">
          <div>
    
            <img src={randomImage} className="profile" alt="profile" />
            <div className="name">
              <span style={{ fontWeight: "bold" }}>
                {userData?.user.fname} {userData?.user.lname}
              </span>
              <div className="status">
              <span>
  {online ? (
    <span>
      Online <div className="online-dot display: inline-block"></div>
    </span>
  ) : (
    "Offline"
  )}
</span>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Conversation;
