const catchAsync = require("../utils/catchAsync");
const Chats = require("../models/chatModel");
const AppError = require("../utils/appError");
const Message = require("../models/messageModel");

exports.CreateChat = catchAsync(async (req, res) => {
  const { members } = req.body;
  if (!members || members.length < 2) {
    return next(new AppError(401, "Chat requires at least 2 members"));
  }

  const chat = await Chats.create({ members });

  res.status(201).json({
    message: "Chat created successfully",
    success: true,
    data: chat,
  });
});

exports.getAllChats = catchAsync(async (req, res, next) => {
  // ✅ Get user ID from JWT middleware
  // console.log(req.user);
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return next(new AppError(401, "User ID not found in token"));
  }

  // ✅ Query all chats where this user is a member
  // const allChats = await Chats.find({
  //   members: { $in: [userId] }, // Must be array
  // }); // optional: populate user details
  const allChats = await Chats.find({ "members._id": userId });

  res.status(200).json({
    message: "Chats fetched successfully",
    success: true,
    data: allChats,
  });
});

exports.getNewMessage = catchAsync(async (req, res, next) => {
  const { chatId, sender, text } = req.body;

  // 1️⃣ Validate inputs
  if (!chatId || !sender || !text) {
    return next(new AppError(400, "chatId, sender, and text are required"));
  }

  // 2️⃣ Create the message
  const message = await Message.create({ chatId, sender, text });

  // 3️⃣ Update chat efficiently and return updated doc if needed
  const chatUpdate = await Chats.findByIdAndUpdate(
    chatId,
    {
      lastMessage: message._id,
      $inc: { unreadMessageCount: 1 },
    },
    { new: true } // returns updated chat if needed
  );

  if (!chatUpdate) {
    return next(new AppError(404, "Chat not found"));
  }

  // 4️⃣ Send structured response
  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: {
      message,
      chatId: chatUpdate._id,
      lastMessage: chatUpdate.lastMessage,
    },
  });

});

exports.getAllMessage = catchAsync( async (req,res,next)=>{
  const { chatId } = req.params;

  if(!chatId){
    return next( new AppError(400, "Invalid ChatId"))
  }

  const allmessage = await Message.find({chatId:chatId}).sort({createdAt:1})

  res.status(201).json({
    success: true,
    message: "Message fetched successfully",
    data: allmessage
  });

});
