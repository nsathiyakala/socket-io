const messageModel = require("../Model/messageModel")

const saveMessageToDB = async (messageData) => {
    const { sender, receiver, message } = messageData;
    const newMessage = new messageModel({
        sender,
        receiver,
        message,
    });
    return await newMessage.save(); 
};


const saveMessage = async (req, res) => {
    try {
        const savedMessage = await saveMessageToDB(req.body); 
        console.log(savedMessage);
        
        res.status(200).json({ message: savedMessage });
    } catch (error) {
        res.status(200).json({message: error });
    }
};

// exports.saveMessage = async (req, res) => {
//     try {
//         const { sender, receiver, message } = req.body
//         const newMessage = new messageModel({
//             sender,
//             receiver,
//             message
//         })
//         await newMessage.save()
        
//         res.status(200).json({
//             message: newMessage
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

const receiveMessage = async(req,res)=>{
    try {

        const receiveMessage = await messageModel.find()

        res.status(200).json({
            message:receiveMessage
        })
        
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    saveMessageToDB,
    saveMessage,
    receiveMessage
}
