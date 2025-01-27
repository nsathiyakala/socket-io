const express = require("express")
const { saveMessage, receiveMessage } = require("../controller/ChatController")
const router = express.Router()

router.route("/sendMessage").post(saveMessage)
router.route("/getMessage").get(receiveMessage)

module.exports = router