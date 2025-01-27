"use client"
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your backend URL

const NewGroupChat = () => {
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [group,setGroup] = useState(false)

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


    //  createGroup
//   const createGroup = () =>{
//         setGroup(true)
        
//   }
 

  return (
    <>
    <div className="group-chat-container" style={{ padding: "20px" }}>
        
      {!joined ? (
        <>
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
        {/* <div onClick={setGroup(true)}>Create Group</div> */}
        </>
        
      ) : (
        <div className="chat-container">
        <div className="chat-header">Group Chat</div>
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === userId ? "sent" : "received"}`}
            >
              <div className="bubble">
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      )}
    </div>
    </>
   



  );
};

export default NewGroupChat;
