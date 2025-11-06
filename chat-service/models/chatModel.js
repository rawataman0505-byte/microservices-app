const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    members: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: String,
      email: String
    }
  ],
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