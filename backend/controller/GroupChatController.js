const {messageModel} = require('../Model/groupChatModel')

exports.groupChat = async (res,req)=>{
    try {
        const fetchChat = await messageModel.find({room})
        res.status(200).json({
            message: fetchChat
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
 


}