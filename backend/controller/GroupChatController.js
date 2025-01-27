const CreateGroupModel = require('../Model/createGroupModel');
const GroupMessageModel = require("../Model/groupMessageModel")

const createGroup = async (req, res) => {
    try {
        const {groupId, members} = req.body;
        // console.log({groupId, members});
        
        const group = new CreateGroupModel({
            groupId,
            members,
        });

        await group.save();

        res.status(200).json(
            group
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};


const saveGroupChat = async(messageData)=>{
    const {groupId,sender,message} = messageData
    const newMessage = new GroupMessageModel({groupId,sender,message})
    return await newMessage.save()
}

const sendGroupMessage = async(req,res)=>{

    try {
         const {groupId,sender,message}=req.body

        //  console.log({groupId,sender,message});
         
        //  console.log(groupId);
         
         const group = await CreateGroupModel.findById(groupId)
        //  console.log("id",group.id);

         if(groupId !== group.id){
            return res.status(400).json({message:"Group not found"})
         }

         if(!group.members.includes(sender)){
            return res.status(400).json({message:"Sender not found"})
         
         }

         const savedMessage = await saveGroupChat({groupId, sender, message})
         return res.status(200).json({message:savedMessage})
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
   
}

const receiveGroupMessage = async(req, res)=>{
    try {
        const {groupId} = req.params
        const messages = await GroupMessageModel.find({groupId})
        res.status(200).json({message:messages})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports ={
    createGroup,
    saveGroupChat,
    sendGroupMessage,
    receiveGroupMessage
}