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
  const [groupName,setGroupName] = useState("")
  const [users,setUsers] = useState("")
  // const [members,setMembers] = useState([])

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
  }, [userId,groupId,messages]);

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

 

  // Listen for incoming messages


    const createGroup = () => {
      const groupMembers = users.split(",");
      console.log(groupMembers);
  
      // setMembers(groupMembers);
      // console.log(members);
      
  
      const groupData = {
        groupId:groupName,
        members: groupMembers,
        
      };
      console.log(groupData);
      
      fetch("http://localhost:8000/group/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      }).then((res) => res.json()).then((data) => {
        if(data){
          console.log("Group created successfully");
          console.log(data);
          setJoined(true);
          setUserId(data.members[0])
          console.log(userId);
          
          setGroupId(data._id)
          console.log(groupId);
          
        }
        else {
           console.error("Failed to create group");
          }
        
      });

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
        <button onClick={()=>setGroup(true)}>Create New Group</button>
        {group && (
          <div style={{marginTop:"10px"}}>
            <input 
            type="text" 
            placeholder="Group Name" 
            value={groupName}
            onChange={(e)=>setGroupName(e.target.value)}/> <br />
            <input style={{marginTop:"10px"}}
             type="text" 
             placeholder="Add Group Members"
             value={users} 
             onChange={(e)=> setUsers(e.target.value)
             
             }/> <br />
            <button style={{marginTop:"10px"}} onClick={createGroup}>Create Group</button>
          </div>
        )}
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
