import React, { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { getNewMessage, getAllMessages } from "../services/chat";
import moment from "moment";

export default function ChatArea() {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  // console.log("Selected Chat in ChatArea:", selectedChat);
  const selectedUser = selectedChat?.members?.find(
    (member) => member._id !== user._id
  );
  const [ message, setMessage ] = useState("");
  const [ allMessage, setallMessage ] = useState([]);

  async function SendNewMessage() {
    let payload = {
      chatId: selectedChat._id,
      sender: user._id,
      text: message,
    };
    // console.log("payload",payload)
    try {
      const res = await getNewMessage(payload);
      // console.log(res && res.data, 'res from create chat');

      // Try to extract array of chats from a few possible response shapes
      const parsed = res && res.data && res.data.data ? res.data.data : null;
      if(parsed){
      setMessage('')
      }
     
      // let chatsArray = []
      // if (Array.isArray(parsed)) chatsArray = parsed
      // else if (Array.isArray(parsed.data)) chatsArray = parsed.data
      // else if (Array.isArray(parsed.chats)) chatsArray = parsed.chats
      // else if (Array.isArray(parsed.data && parsed.data.chats)) chatsArray = parsed.data.chats

      // dispatch to redux so other pages/components can access all chats
      // dispatch(setAllChats(chatsArray))
      // dispatch(setSelectedChat(parsed))
    } catch (err) {
      // prefer APIError message if present
      // setError(err && err.message ? err.message : 'Failed to load chats')
      // if unauthorized, token might be invalid/expired
      if (err && err.status === 401) {
        try {
          localStorage.removeItem("token");
        } catch (e) {}
      }
    }
  }

  async function GetAllMessage() {
    try {
      // console.log("selectedChat._id",selectedChat._id)
      const res = await getAllMessages(selectedChat._id);
      const parsed = res && res.data && res.data.data ? res.data.data : null;
      if(parsed){
      setallMessage(parsed)
      }
    } catch (err) {
      if (err && err.status === 401) {
        try {
          localStorage.removeItem("token");
        } catch (e) {}
      }
    }
  }

  function formatName(user) {
    let fname = user.name.toUpperCase();
    return fname;
  }
  useEffect(() => {
    GetAllMessage();
  }, [selectedChat]);

const formatTime = (timestamp) => {
        const now = moment();
        const diff = now.diff(moment(timestamp), 'days')

        if(diff < 1){
            return `Today ${moment(timestamp).format('hh:mm A')}`;
        }else if(diff === 1){
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
        }else {
            return moment(timestamp).format('MMM D, hh:mm A');
        }
    }

  return (
    <>
      {/* id: {selectedChat?._id} */}
      {/* {selectedChat && <h2>{selectedChat}</h2>} */}
      {selectedChat && (
        <div class="app-chat-area">
          <div class="app-chat-area-header">{formatName(selectedUser)}</div>



          <div className="main-chat-area" id="main-chat-area">
                        { allMessage.map(msg => {
                            const isCurrentUserSender = msg.sender === user._id;

                            return <div className="message-container" 
                            style={isCurrentUserSender ? {justifyContent: 'end'} : 
                            {justifyContent: 'start'}}
                            >
                                        <div>
                                            <div 
                                            className={isCurrentUserSender ? "send-message" : "received-message"}
                                            >
                                                <div>{ msg.text }</div>
                                                <div>{msg.image && <img src={msg.image} alt="image" height="120" width="120"></img>}</div>
                                            </div>
                                            <div className="message-timestamp" 
                                                 style={isCurrentUserSender ? {float: 'right'} : {float: 'left'}}
                                            >
                                                { formatTime(msg.createdAt) } {isCurrentUserSender && msg.read && 
                                                    <i className="fa fa-check-circle" aria-hidden="true" style={{color: '#e74c3c'}}></i>
                                                }
                                            </div>
                                        </div>
                                    </div>
                        })}
                        <div className="typing-indicator">
                            {/* {isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && <i>typing...</i>} */}
                        </div>
                    </div>



           <div className="send-message-div">
                        <input type="text" 
                            className="send-message-input" 
                            placeholder="Type a message"
                            value={message}
                            onChange={ (e) => { 
                                setMessage(e.target.value)
                                // socket.emit('user-typing', {
                                //     chatId: selectedChat._id,
                                //     members: selectedChat.members.map(m => m._id),
                                //     sender: user._id
                                // })
                            } 
                        }
                        />
                        
                        <label for="file">
                            <i className="fa fa-picture-o send-image-btn"></i>
                            <input
                                type="file"
                                id="file"
                                style={{display: 'none'}}
                                accept="image/jpg,image/png,image/jpeg,image/gif"
                                // onChange={sendImage}
                            >
                            </input>
                        </label>

                        <button 
                            className="fa fa-smile-o send-emoji-btn" 
                            aria-hidden="true"
                            // onClick={ () => { setShowEmojiPicker(!showEmojiPicker)} }
                             >
                        </button>
                        <button 
                            className="fa fa-paper-plane send-message-btn" 
                            aria-hidden="true"
                            onClick={ () => SendNewMessage('') }
                            >
                        </button>
                    </div>
        </div>
      )}
    </>
  );
}
