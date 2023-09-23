const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const Protect = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/",Protect,allUsers);

module.exports = router;
