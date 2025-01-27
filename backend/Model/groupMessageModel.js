const mongoose = require("mongoose")

const GroupMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required: true
    },
    message: {
        type: String,
        required: true
    },
},{timestamps:true})

const GroupMessageModel = mongoose.model("GroupMessage", GroupMessageSchema)
module.exports = GroupMessageModel
