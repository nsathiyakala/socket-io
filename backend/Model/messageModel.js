const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const messageModel = mongoose.model("Message", messageSchema)
module.exports = messageModel