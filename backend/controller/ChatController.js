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


const receiveMessage = async (req, res) => {
    try {
        const { sender, receiver } = req.query;

        // Fetch messages strictly between the two users
        const messages = await messageModel.find({
            $or: [
                { sender, receiver }, // From sender to receiver
                { sender: receiver, receiver: sender }, // From receiver to sender
            ],
        }).sort({ createdAt: 1 }); // Optional: Sort messages by creation time

        res.status(200).json({ message: messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    saveMessageToDB,
    saveMessage,
    receiveMessage
}
