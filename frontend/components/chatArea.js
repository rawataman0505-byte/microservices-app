import { useSelector } from "react-redux"

export default function ChatArea(){
    const { selectedChat } = useSelector(state => state.userReducer);
    console.log("Selected Chat in ChatArea:", selectedChat);
    return( 
        <div>
            id: {selectedChat?._id}
            {/* {selectedChat && <h2>{selectedChat}</h2>} */}
        </div>
    )
}