"use client"
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your backend URL

const GroupChat = () => {
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (userId && groupId) {
      fetch(`http://localhost:8000/group/receive-group-message/${groupId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.message || []);
        });
    }
    socket.on("receiveGroupMessage", (data) => {
      console.log("receivedMessage", data );
      
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => socket.off("receiveGroupMessage");
  }, [userId,groupId]);

  // Join group on button click
  const joinGroup = () => {
      if (!groupId || !userId) {
        alert("Please enter both Group ID and User ID");
        return;
      }
      const groupData = { groupId, sender:userId };
      console.log("groupData",groupData);
      
    
      const groupSocket = socket.emit("joinRoom", groupData);
      console.log("socket",groupSocket);

      
        socket.on("error", (errorMsg) => {
          alert(errorMsg);
          setJoined(false); // Handle errors like not being a member
        });
     
        setJoined(true);

  
  };

  // Send message
  const sendMessage = () => {
    if (!message) return;
    const messageData = { groupId, sender:userId, message };
    console.log("messageData", messageData);
    
    const MessageSocket = socket.emit("sendGroupMessage", messageData);
    console.log("MessageSocket", MessageSocket);
    
    setMessage(""); // Clear input after sending
  };

  // Listen for incoming messages
 

  return (
    <>
    <div className="group-chat-container" style={{ padding: "20px" }}>
      {!joined ? (
        <div>
          <h2>Join Group Chat</h2>
          <input
            type="text"
            placeholder="Group ID"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            style={{ margin: "5px" }}
          />
          <br />
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ margin: "5px" }}
          />
          <br/>
          <button onClick={joinGroup} style={{ padding: "10px 20px", margin: "10px" }}>
            Join Group
          </button>
        </div>
      ) : (
        <div>
          <h2>Group Chat</h2>
          <div
            className="chat-box"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} style={{ margin: "5px 0" }}>
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              ))
            ) : (
              <p>No messages yet...</p>
            )}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "70%", padding: "10px" }}
          />
          <button onClick={sendMessage} style={{ padding: "10px 20px", marginLeft: "10px" }}>
            Send
          </button>
        </div>
      )}
    </div>
    </>
   



  );
};

export default GroupChat;
