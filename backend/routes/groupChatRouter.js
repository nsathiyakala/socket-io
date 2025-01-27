const express = require("express")
const { createGroup, sendGroupMessage, receiveGroupMessage } = require("../controller/GroupChatController")

const router = express.Router()

router.route("/createGroup").post(createGroup)
router.route("/send-group-message").post(sendGroupMessage)
router.route("/receive-group-message/:groupId").get(receiveGroupMessage)

module.exports = router  