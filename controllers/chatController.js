const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat = asyncHandler(async (req, resp) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent request");
    return resp.sendStatus(400);
  }

  //if chat exist and condition matches populate it
  let isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user_id } } },
      { users: { $elemMatch: { $eq: req.userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //inside messageModelwe have to populate sender field
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
    //in isChat final data of a chat is available
  });

  // now we check if chat.length is more than 0 we can show only 0th chat with these user or if not we create the chat with these two users.
  if (isChat.length > 0) {
    resp.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroup: false,
      users: [req.user_id, userId], // both the user which are logedIn and the other with which we are tying to create a chat.
    };

    //to store the created data in database
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      resp.status(200).send(fullChat);
    } catch (error) {
      resp.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, resp) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user_id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        })
        resp.status(200).send(results)
      });
  } catch (error) {
    resp.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, resp) => {
  if(!req.body.users || !req.body.name){
    return resp.status(400).send({message: "please fill all the feilds"})
  }

  let users = JSON.parse(req.body.users);
  if(users.length < 2){
    return resp
    .status(400)
    .send({message:"For group chat more than two users are required"})
  }

  //user that is loggedin along with the part of these group chat
  users.push(req.user);

  try {
    //create a group chat
    const groupChat = await Chat.create({
      chatName:req.body.name,
      users:users,
      isGroupChat:true,
      groupAdmin:req.user,
    })

//fetch the group chat in database and send back to the user
    const fullGroupChat = await Chat.findOne({ _id:groupChat._id})
    .populate("users", "-password")
    .populate("groupAdmin","-password")

    resp.status(200).send(fullGroupChat)

  } catch (error) {
    resp.status(400)
    throw new Error(error.message)
  }

});

const renameGroup = asyncHandler(async (req, resp) => {
  const {chatName, chatId} = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName:chatName
    },
    {
      new: true
    }
  )
  .populate("users", "-password")
    .populate("groupAdmin","-password")

    if(!updatedChat){
      resp.status(400);
      throw new Error("chat not found")
    } else{
      resp.json(updatedChat)
    }
});

const removeFromGroup = asyncHandler(async (req, resp) => {
  const {userId, chatId} = req.body;

  const groupRemove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull:{users:userId}
    },
    {
      new: true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!groupRemove){
    resp.status(400)
    throw new Error("user not removed")
  }
  else{
    resp.send(groupRemove)
  }
});

const addToGroup = asyncHandler(async (req, resp) => {
  const {userId, chatId} = req.body;

  const groupAdd = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push:{users:userId}
    },
    {
      new: true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!groupAdd){
    resp.status(400);
    throw new Error("user not added")
  }
  else{
    resp.json(groupAdd)
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
