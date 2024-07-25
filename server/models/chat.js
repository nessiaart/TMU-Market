const mongoose = require('mongoose');


//Schema for a chat, each chat will have its members in an array
const ChatSchema = mongoose.Schema({
    members:{
        type: Array,
    },
}, {
    timestamps: true,
});

//save the model 
const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;

