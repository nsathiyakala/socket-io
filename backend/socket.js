const socket = require("socket.io");
const { saveMessageToDB } = require("./controller/ChatController");


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

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);

    });
  });
};

module.exports = socketServer;


