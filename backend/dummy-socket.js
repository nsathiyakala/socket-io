socket.on("joinRoom", async(room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });