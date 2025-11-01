const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    members:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId ,
                ref: "users"
            }
        ]
    },
    lastmessage:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId ,
                ref: "messages"
            }
        ]
    },
    unredaMessageCount:{
        type:"Number",
        default : 0
    }

}, {timestamp:true})


const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;