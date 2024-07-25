const express = require('express');
const { createChat, findChat, userChats } = require('../control/chatController.js');

const router = express.Router();

//routers for all of the controllers 
router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;  