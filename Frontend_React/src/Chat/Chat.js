import React, { useRef, useState, useEffect } from "react";
import { AddressBook, X } from "phosphor-react";
import "./chat.css";
import { decodeToken } from "../utils/auth.js";
import { userChats } from "../utils/chatRequest.js";
import Conversation from "./Conversation.js";
import ChatBox from "./ChatBox.js";
import MessageBox from "./MessageBox.js";
import { io } from "socket.io-client";

const Chat = ({ token }) => {
  const socket = useRef();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      if (token) {
        const userData = decodeToken(token);
        try {
          const { data } = await userChats(userData.id);
          setChats(data);
          setUser(userData.id);
          
          socket.current.emit("new-user-add", userData.id);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    socket.current = io("ws://localhost:3002");
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);

    
    useEffect(() => {
      socket.current.on("receive-message", (data) => {
        console.log("message", data);
        setReceiveMessage(data);
        console.log(receiveMessage);
      });
    }, []);

  const checkOnlineStatus = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  return (
    <div className="flex h-full w-full">
      <div
        className={`contacts ${
          showContacts ? "w-full" : "md:w-1/3"
        }  ${showContacts ? "" : "hidden"} md:block p-2`}
      >
        <div className="heading">
          <button
            className="md:hidden"
            onClick={() => {
              setShowContacts(!showContacts);
              setIsHamburgerClicked(!isHamburgerClicked);
            }}
          >
            <X size={24} className="icon" />
          </button>
          <strong>Contacts</strong>
          <div className="contact-list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {setCurrentChat(chat);
                  if (isHamburgerClicked) {
                    setShowContacts(!showContacts);
                    setIsHamburgerClicked(!isHamburgerClicked);
                  }
                }}
              >
                <Conversation
                  data={chat}
                  currentUserId={user}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`chat flex flex-col w-full ${
          showContacts ? "hidden" : ""
        }`}
      >
        <div className="flex-grow-0 flex-shrink p-2">
          <div className="heading">
            <button
              className="md:hidden"
              onClick={() => {
                setShowContacts(!showContacts);
                setIsHamburgerClicked(!isHamburgerClicked);
              }}
            >
              <AddressBook size={40} className="icon" />
            </button>
            <ChatBox
              chat={currentChat}
              currentUser={user}
            />
          </div>
        </div>

        <MessageBox
          chat={currentChat}
          currentUser={user}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
