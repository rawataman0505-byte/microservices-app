const express = require("express");
const {createProxyMiddleware} = require("http-proxy-middleware");
const dotenv = require("dotenv");
dotenv.config({path:"./.env"});
const { verifyToken } = require("./middleware/verifyToken");

const app = express();

console.log(process.env.NODE_ENV)
const AUTH_SERVICE_URL = process.env.AUTH_URL;
const CHAT_SERVICE_URL = process.env.CHAT_URL;
const VIDEO_SERVICE_URL = process.env.VIDEO_URL;

const Port = process.env.PORT || 8081

// app.get("/",(req,res)=>{
//     res.send({
//         msg:"hello world"
//     })
// });


// Route proxies
app.use("/auth", createProxyMiddleware({ target: AUTH_SERVICE_URL, changeOrigin: true }));
app.use("/chat", verifyToken, createProxyMiddleware({ target: CHAT_SERVICE_URL, changeOrigin: true }));
app.use("/video", verifyToken, createProxyMiddleware({ target: VIDEO_SERVICE_URL, changeOrigin: true }));

app.listen(Port, () => console.log("API Gateway running on port 8080"));
