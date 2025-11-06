import { useState } from "react";
import Search from "./Search";
import UsersList from "./Userlist";

function Sidebar({ user }){
    const [searchKey, setSearchKey] = useState('');
    return (
        <div className="app-sidebar">
            <Search 
                searchKey={searchKey} 
                setSearchKey={setSearchKey}>               
            </Search>
           <UsersList 
                searchKey={searchKey} 
                user={user}
                // socket={socket}
                // onlineUser={onlineUser}
            >
            </UsersList>
        </div>
    )
}

export default Sidebar;