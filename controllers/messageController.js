const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async (req, resp) => {
  const { chatId, content } = req.body;
  // console.log(chatId,content);

  if (!chatId || !content) {
    console.log("Invalid data passed into request");
    return resp.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    resp.json(message);
  } catch (error) {
    resp.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, resp) => {
    try {
        const messages = await Message.find({chat:req.params.chatId})
    .populate("sender" , "name email pic")
    .populate("chat")
    
    resp.json(messages)
    } catch (error) {
        resp.status(400);
        throw new Error(error.message);  
    }
})

module.exports = { sendMessage, allMessages };
