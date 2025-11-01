const express = require("express");
const router = express.Router();
const { CreateChat, getAllChats, getNewMessage, getAllMessage } = require("../controller/chatController")

router.post("/create-chat", CreateChat)
router.get("/getAllChats", getAllChats)
router.post("/getNewMessage", getNewMessage)
router.get("/getAllMessage/:chatId", getAllMessage)

module.exports = router;


