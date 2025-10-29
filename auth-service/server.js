const dotenv = require("dotenv")
dotenv.config({path:"./.env"})
const app = require("./app")

console.log(process.env.NODE_ENV)

const Port = process.env.PORT || 5000
app.listen(Port,()=>{
    console.log(`App is listening to http://localhost:${Port}`)
})