const ChatModel = require('../models/chat.js');

// Create a new chat only if there isn't an existing chat between the two users
exports.createChat = async (senderId, receiverId) => {
    try {
        // Check if there's an existing chat between the two users
        const existingChat = await ChatModel.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingChat) {
            // If an existing chat is found, return the existing chat
            return existingChat;
        } else {
            // If no existing chat is found, create a new chat
            const newChat = new ChatModel({
                members: [senderId, receiverId]
            });
            const result = await newChat.save();
            return result;
        }
    } catch (error) {
        throw error;
    }
};

//Find all the user's existing chats, return the array 
exports.userChats = async(req, res)=>{
    try {
        const chat = await ChatModel.find({
            members: {$in: [req.params.userId]}
        })
        
        res.status(200).json(chat);
        
    } catch (error) {
        res.status(500).json(error);
        
    }
}

//Look for chat where the members include the two users mentioned 
exports.findChat = async(req, res)=>{
    try {
        const chat = await ChatModel.findOne({
            members: {$all :[req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat);
        
    } catch (error) {
        res.status(500).json(error);
        
    }
}
