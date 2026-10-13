//require('dotenv').config({path: './env'})
import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setSocketIO } from "./utils/socket.js";

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

connectDB()
.then(() => {
  const httpServer = createServer(app);
  const io = new Server(httpServer,  {
  
cors: {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
},

 });

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);

      console.log(`User ${userId} joined room`);
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    })
  })

  setSocketIO(io);

  httpServer.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO DB connection failed !!! ", err);
})


/*
APPROACH 1: GOOD BUT NOT SO MUCH
import express from "express"
const app = express()
;( async () => {
    try{
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error
      })
      app.listen(process.env.PORT, () => {
        console.log(`App is listening on port $ {process.env.PORT}`)
      })
    }catch(error){
        console.error("ERROR: ", error)
        throw err
    }
})()
 */