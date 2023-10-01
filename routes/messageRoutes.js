const express = require('express')
const Protect = require('../middleware/AuthMiddleware')
const { sendMessage, allMessages } = require('../controllers/messageController')

const router = express.Router()

router.route('/').post(Protect, sendMessage)
router.route('/:chatId').get(Protect, allMessages)

module.exports = router;