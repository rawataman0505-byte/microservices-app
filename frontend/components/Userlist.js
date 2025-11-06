import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../services/chat";
import  {setAllChats, setSelectedChat }  from "../redux/slice/userSlice";


export default function Userlist({searchKey}) {

const { allUsers, allChats, user:currentUser, selectedChat } = useSelector(state => state.userReducer);
const dispatch = useDispatch();
// placeholder to avoid runtime errors when checking online status
const onlineUser = []

 function formatName(user){
        if (!user) return ''
        const name = user.name || user.firstname || user.email || ''
        return name.toUpperCase()
    }

  function initial(user){
      const name = user.name || user.firstname || user.email || ''
      return (name.charAt(0) || '').toUpperCase()
  }

async function startNewChat(searchedUserId) {
  let payload={
    "members":[currentUser._id, searchedUserId]
  }
      
      try {
        const res = await createNewChat(payload)
        // console.log(res && res.data, 'res from create chat');

        // Try to extract array of chats from a few possible response shapes
        const parsed = res && res.data && res.data.data ? res.data.data : null
        let chatsArray = []
        if (Array.isArray(parsed)) chatsArray = parsed
        else if (Array.isArray(parsed.data)) chatsArray = parsed.data
        else if (Array.isArray(parsed.chats)) chatsArray = parsed.chats
        else if (Array.isArray(parsed.data && parsed.data.chats)) chatsArray = parsed.data.chats

        // dispatch to redux so other pages/components can access all chats
        dispatch(setAllChats(chatsArray))
        dispatch(setSelectedChat(parsed))
      } catch (err) {
        // prefer APIError message if present
        setError(err && err.message ? err.message : 'Failed to load chats')
        // if unauthorized, token might be invalid/expired
        if (err && err.status === 401) {
          try { localStorage.removeItem('token') } catch (e) {}
        }
      }
    }

 const openChat = (selectedUserId) => {
  
        const chat = allChats.find(chat => 
            chat.members.includes(currentUser._id) && 
            chat.members.includes(selectedUserId)
        )
console.log("chat",chat ,selectedUserId);
        if(chat){
            dispatch(setSelectedChat(chat));
        }
    }

// console.log("allUsers",currentUser);

  return (
   allUsers.filter(user => {
                return (user.name?.toLowerCase().includes(searchKey?.toLowerCase()) && searchKey ) ||
                (allChats.find(chat => chat.members.includes(user._id)))

            }).map((user) => {
    // compute a safe initial for each user
   
    return  <div
      className="user-search-filter"
      onClick={() => openChat(user._id)}
      key={user._id}
    >
      <div className={
        // IsSelectedChat(user) ? 
        "selected-user" 
        // : "filtered-user"
        }>
        <div className="filter-user-display">
          {user.profilePic && (
            <img
              src={user.profilePic}
              alt="Profile Pic"
              className="user-profile-image"
              style={
                onlineUser.includes(user._id)
                  ? { border: "#82e0aa 3px solid" }
                  : {}
              }
            />
          )}

          {!user.profilePic && (
            <div
              className={
                // IsSelectedChat(user)
                //   ? "user-selected-avatar"
                  // : 
                  "user-default-avatar"
              }
              style={
                // onlineUser.includes(user._id)
                  // ? 
                  { border: "#82e0aa 3px solid" }
                  // : {}
              }
            >
              {initial(user)}
            </div>
          )}
          <div className="filter-user-details">
            <div className="user-display-name">{formatName(user)}</div>
            <div className="user-display-email">
              {/* {getlastMessage(user._id) || user.email} */}
            </div>
          </div>
          {/* <div>
            {getUnreadMessageCount(user._id)}
            <div className="last-message-timestamp">
              {getLastMessageTimeStamp(user._id)}
            </div>
          </div> */}
          {!allChats.find(chat => chat.members.includes(user._id)) && (
            <div className="user-start-chat">
              <button
                className="user-start-chat-btn"
                onClick={() => startNewChat(user._id)}
              >
                Start Chat
              </button>
            </div>
           )} 
        </div>
      </div>
    </div>
   })
  );
}
