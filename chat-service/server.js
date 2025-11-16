const dotenv = require("dotenv")
dotenv.config({path:"./.env"})
const Server = require("./app")

console.log(process.env.NODE_ENV)

const Port = process.env.PORT || 5000
Server.listen(Port,()=>{
    console.log(`App is listening to http://localhost:${Port}`)
})