const socket = require('socket.io');
const {saveGroupChat}= require('./controller/GroupChatController')

io.on("connection", (socket) => {
    console.log("A user connected");
  
    // Join group
    socket.on("joinGroup", ({ groupId, userId }) => {
      Group.findById(groupId).then((group) => {
        if (group && group.members.includes(userId)) {
          socket.join(groupId);
          console.log(`User ${userId} joined group ${groupId}`);
        } else {
          socket.emit("error", "You are not a member of this group");
        }
      });
    });
  
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  io.to(groupId).emit("newMessage", { userId, message, timestamp: newChat.timestamp });


//   ////////////////////////////////////////




io.on("connection", (socket) => {
    console.log("A user connected");
  
    // Join group room
    socket.on("joinGroup", ({ groupId, userId }) => {
      Group.findById(groupId).then((group) => {
        if (group && group.members.includes(userId)) {
          socket.join(groupId); // User joins the group room
          console.log(`User ${userId} joined group ${groupId}`);
        } else {
          socket.emit("error", "You are not a member of this group");
        }
      });
    });
  
    // Listen for message events
    socket.on("sendMessage", async ({ groupId, userId, message }) => {
      try {
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
          socket.emit("error", "You are not a member of this group");
          return;
        }
  
        // Save message to database
        const newChat = new Chat({ groupId, sender: userId, message });
        await newChat.save();
  
        // Emit the message to all group members in real-time
        io.to(groupId).emit("newMessage", { 
          sender: userId, 
          message, 
          timestamp: newChat.timestamp 
        });
      } catch (err) {
        socket.emit("error", "Failed to send message");
      }
    });
  
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  
  