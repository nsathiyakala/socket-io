const socket = require("socket.io");
const { saveMessageToDB } = require("./controller/ChatController");
const { saveGroupChat } = require("./controller/GroupChatController");
const createGroupModel = require("./Model/createGroupModel");


socketServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // Listen for messages
    socket.on("sendMessage", async (messageData) => {
      console.log("Message received from client:", messageData);

      const savedMessage = await saveMessageToDB(messageData);
      console.log("Saved message:", savedMessage);

      
      const recipientSocketId = savedMessage.receiver;
      console.log("receiver",recipientSocketId);
      
      if (recipientSocketId) {
        // Emit to the specific recipient
        
        const emmision = io.emit("receiveMessage", savedMessage);
        // const recive = io.to(savedMessage.sender).emit("receiveMessage", savedMessage);
       
        console.log("emmision",emmision);
        
      } else {
        console.log("Recipient not connected:", messageData.receiver);
      }
    });


    // socket.on("joinRoom",async ({groupData}) =>{
    //   console.log(groupData);
      
    //   createGroupModel.findById(groupData.groupId).then((group)=>{
    //     if(group && group.members.includes(groupData.sender)){
    //       socket.join(groupData.groupId)
    //       console.log(`User ${groupData.sender} joined room ${groupData.groupId}`);
        
    //     }
    //     else{
    //       console.log("User not found in group");
    //     }  
    //   })
    // })

    socket.on("joinRoom", async (groupData) => {
      console.log(groupData);
      
      try {
        const group = await createGroupModel.findById(groupData.groupId);
        console.log(group);
        
        if (group && group.members.includes(groupData.sender)) {
          socket.join(groupData.groupId);
          console.log(`User ${groupData.sender} joined room ${groupData.groupId}`);
        } else {
          socket.emit("error", "User not found in group or group does not exist");
        }
      } catch (err) {
        console.error("Error in joinRoom:", err);
        socket.emit("error", "An error occurred while joining the room");
      }
    });
    
    
      
    socket.on("sendGroupMessage", async(messageData)=>{
      console.log("messageData",messageData);
      
      try {
        const savedMessage = await saveGroupChat(messageData)
        console.log("savedMessage", savedMessage);
        const emmission = io.to(messageData.groupId).emit("receiveGroupMessage", savedMessage)
        console.log(emmission);
        
      } catch (error) {
        socket.emit("error", "Failed to send message");
      }
     
    })

   

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);

    });
  });
};

module.exports = socketServer;


