const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');

const Protect = asyncHandler ( async (req, resp, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          token = req.headers.authorization.split(" ")[1];
    
          //decodes token id
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
          req.user = await User.findById(decoded.id).select("-password");
    
          next();
        } catch (error) {
          resp.status(401);
          throw new Error("Not authorized, token failed");
        }
      }
    
      if (!token) {
        resp.status(401);
        throw new Error("Not authorized, no token");
      }
    });

module.exports = Protect;