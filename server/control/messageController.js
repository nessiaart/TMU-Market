const MessageModel= require("../models/messages.js");

//Save messages in the db
//Saves who sent it, chat it was in and the text of the message 
exports.addMessage = async(req,res)=>{
    const{chatId, senderId, text} = req.body;

    //create instance of model
    const message = new MessageModel({
        chatId,
        senderId,
        text
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
        
    }
}


//Get messages from the db 
//Uses chat id to search
exports.getMessages = async(req, res)=>{
    const {chatId} = req.params;
    try {
        const result = await MessageModel.find({chatId});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}