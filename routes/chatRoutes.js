const express = require('express');
const Protect = require('../middleware/AuthMiddleware');
const { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');

const router = express.Router();

router.route("/").post(Protect, accessChat);
router.route("/").get(Protect, fetchChat);
router.route("/group").post(Protect, createGroupChat);
router.route("/rename").put(Protect, renameGroup);
router.route("/removegroup").put(Protect, removeFromGroup);
router.route("/addgroup").put(Protect, addToGroup);

module.exports = router;