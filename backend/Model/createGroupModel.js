const mongoose = require("mongoose")

const CreateGroupSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    }
},{timestamps:true})

const CreateGroupModel = mongoose.model("Group", CreateGroupSchema)
module.exports = CreateGroupModel