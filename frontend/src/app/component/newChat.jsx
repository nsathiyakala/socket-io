// "use client";
// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:8000");

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [username, setUsername] = useState("");
//   const [receiverName, setReceivername] = useState("");


//   useEffect(() => {
//     // Fetch initial messages
//     fetch("http://localhost:8000/chat/getMessage")
//         .then((res) => res.json())
//         .then((data) => setMessages(data.message));

//     // Listen for new messages
//     socket.on("receiveMessage", (message) => {
//         if (
//             (message.sender === username && message.receiver === receiverName) ||
//             (message.sender === receiverName && message.receiver === username)
//         ) {
//             setMessages((prevMessages) => [...prevMessages, message]);
//         }
//     });

//     return () => {
//         socket.disconnect();
//     };
// }, [username, receiverName]); // Re-run when username or receiverName changes


//   const sendMessage = () => {
//     if (newMessage.trim() && username.trim()) {
//       const messageData = { sender: username, receiver: receiverName, message: newMessage };
//       socket.emit("sendMessage", messageData);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">Chat</div>
//       <div className="chat-body">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`message ${msg.sender === username ? "sent" : "received"}`}
//           >
//             <div className="bubble">
//               <strong>{msg.sender}:</strong> {msg.message}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="chat-footer">
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//           <input
//           type="text"
//           placeholder="Send To"
//           value={receiverName}
//           onChange={(e) => setReceivername(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [receiverName, setReceivername] = useState("");

  useEffect(() => {
    // Fetch chat messages when both usernames are set
    if (username && receiverName) {
      fetch(`http://localhost:8000/chat/getMessage?sender=${username}&receiver=${receiverName}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.message || []);
        });
    }

    const handleReceiveMessage = (message) => {
      if (
        (message.sender === username && message.receiver === receiverName) ||
        (message.sender === receiverName && message.receiver === username)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    // Attach listener
    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup listener
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [username, receiverName]); // Dependencies ensure it re-runs only when these change



  const sendMessage = () => {
    if (newMessage.trim() && username.trim() && receiverName.trim()) {
      const messageData = { sender: username, receiver: receiverName, message: newMessage };
      console.log("Message Sent",messageData);
  
      socket.emit("sendMessage", messageData, (acknowledgement) => {
        console.log("Server Acknowledgement:", acknowledgement); // Log server acknowledgment
      });
  
      setNewMessage("");
    }
  };
  

  return (
    <>
     <div className="chat-container">
      <div className="chat-header">Chat</div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === username ? "sent" : "received"}`}
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
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Send To"
          value={receiverName}
          onChange={(e) => setReceivername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>


        <div style={{display:"flex", justifyContent:"center"}}>
        <button >
          <a href="/group">
          Group Chat
          </a>
        </button>
        
        </div>

    </>
   
  );
};

export default Chat;
