import React, { useEffect, useState, useRef } from "react";
import { getUser } from "../utils/userRequest";
import { addMessage, getMessages } from "../utils/messageRequest";
import { format } from "timeago.js";
import { PaperPlaneTilt } from "phosphor-react"; 

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  

   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = chat.members.find((id) => id !== currentUser);
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat) fetchUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat) fetchMessages();
  }, [chat]);


const handleSend = async (e) => {
    e.preventDefault();
  
    
    const trimmedMessage = newMessage.trim();
  
   
    if (!trimmedMessage) {
      
      setNewMessage("");
      return;
    }
  
   
    const message = {
      senderId: currentUser,
      text: trimmedMessage,
      chatId: chat._id,
    };

    const receiverId = chat.members.find((id)=> id !== currentUser);
    console.log(message);
    setSendMessage({...message, receiverId});
  
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    console.log("Message Arrived: ", receiveMessage);
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  
  useEffect(()=> {
    scroll.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])
  return (
    <div className="chat-box">
      <div className="chat-body">
        {chat ? (
          <>
            {messages.map((message, index) => (
              <div ref = {scroll}
                key={index}
                className={
                  message.senderId === currentUser ? "own" : "message"
                }
              >
                <span
                  style={{ display: "block", fontWeight: "bold", color: "black" }}
                >
                  {message.text}
                </span>
                <span style={{ color: "black" }}>
                  {format(message.createdAt)}
                </span>
              </div>
            ))}

          </>
        ) : (
          <span className = "tapChat" style = {{fontSize: "30px"}}>Tap on a Chat to Start a Conversation...</span>
        )}

        
      </div>
      {chat? (<div className="flex gap-2 p-2">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Type..."
                  className="bg-white border p-2 w-full rounded-lg"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="button1 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={(handleSend)}
              >
                <PaperPlaneTilt title="Send" size={20} />
              </button>
            </div>) : ("")}
    </div>
  );
};

export default ChatBox;
