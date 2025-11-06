const express = require("express");
const connectDB = require("./db/connection");
const AppError = require("./utils/appError");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();
const chatRoutes = require("./routes/chatRoutes")


const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded());

app.use(cookieParser());

app.options('/*splat', cors(corsOptions));


connectDB()

app.get("/", (req,res)=>{
  console.log("from / hello world", req.headers , req.user )
res.send("hello world")
})


app.use("/api/chat", chatRoutes);

app.all("/*path", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});


app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message || "Something went wrong",
  });
});


module.exports = app;

// app.use((err,req,res,next)=>{
//     // err.statusCode = err.statusCode || 500;
//     // err.status = err.status || 'error'

//     res.status(err.statusCode).json({
//         status:err.status,
//         message:err.message
//     })
// })



// app.get("/getAlluser",()=>{
//     res.send("here is list of users")
// })

// const login = async (req,res)=>{
//     const data = req.body;
//     res.status(201).json({
//         status:'success',
//         message:"User Logied In Successfully"
//     })

// }

// app.post("/login",login)

// app.post("/signup",(req,res)=>{
//     res.status(201).json({
//         status:'success',
//         message:"User Created Successfully"
//     })

// })

// app.all("/*",(req,res,next)=>{
//     // res.status(404).json({
//     //     status:"fail",
//     //     message:`Can't find ${req.originalUrl} on this server`
//     // })
//     next(new AppError(404,`Can't find ${req.originalUrl} on this server`))
// })