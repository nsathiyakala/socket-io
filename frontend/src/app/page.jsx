import Chat from "./component/chat";
import "./style.css"

export default function Home() {
  return (
   <>
   <div className="chat-container" >
          <div className="chat-header">Chat</div>
          <div className="chat-body">
              <div className="message received">
                  <div className="bubble">Hello! How are you?</div>
              </div>
              <div className="message sent">
                  <div className="bubble">I'm good, thanks! How about you?</div>
              </div>
              <div className="message received">
                  <div className="bubble">I'm doing great!</div>
              </div>
          </div>
          <div className="chat-footer">
              <input type="text" placeholder="Type a message..."/>
              <button> send </button>
          </div>
    </div>

    <div>
        <Chat/>
    </div>
   </>
    
    
  );
}
