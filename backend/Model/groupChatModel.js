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
    room: {
        type: String,
        required: true
    }
},{timestamps:true})

const messageModel = mongoose.model("Message", messageSchema)
module.exports = messageModel