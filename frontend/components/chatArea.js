import { useSelector } from "react-redux"

export default function ChatArea(){
    const { selectedChat } = useSelector(state => state.userReducer);
    // console.log("Selected Chat in ChatArea:", selectedChat);
    return( 
        <div>
            {selectedChat && <h2>{selectedChat._id}</h2>}
        </div>
    )
}