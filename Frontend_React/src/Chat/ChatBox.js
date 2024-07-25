import React, { useEffect, useState } from "react";
import { getUser } from "../utils/userRequest";

const ChatBox = ({ chat, currentUser}) => {
  
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (chat && chat.members) {
      
      const userId = chat.members.find((id) => id !== currentUser); // Access chat members properly
      const getUserData = async () => {
        try {
          const { data } = await getUser(userId);
          setUserData(data);
        } catch (error) {
          console.log(error);
        }
      };
      if (chat != null) getUserData();
    }
  }, [chat, currentUser]);

  return (
    <>
      <div>
        <>
          <div>
            <div className="name">
              <span style={{ fontWeight: "bold", justifyContent: "space-evenly"}}>
                {userData?.user.fname} {userData?.user.lname}
              </span>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default ChatBox;
