const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, resp) => {
  const { name, email, password, pic } = req.body;

  //check if any field are undefined
  if (!name || !email || !password) {
    resp.send(400);
    throw new Error("please fill the required field");
  }

  const userExists = await User.findOne({ email });

  //if user exist
  if (userExists) {
    resp.status(400);
    throw new Error("User already exist!");
  }

  //create user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  //if user created succesfully
  if (user) {
    resp.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    resp.status(400);
    throw new Error("failed to create user");
  }
});

const authUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchedPassword(password))) {
    resp.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    resp.status(401);
    throw new Error("Invalid email & password");
  }
});

const allUsers = asyncHandler (async (req, resp) => {
  const keyword = req.query.search ? {
    $or:[
      {name:{ $regex: req.query.search, $options: "i"} },
      {email: { $regex: req.query.search, $options: "i"} },
    ]
  } :
  {};
  const users = await User.find(keyword).find({_id:{$ne: req.user._id}});
  resp.send(users);
  // console.log(keyword);
});

module.exports = { registerUser, authUser, allUsers };
