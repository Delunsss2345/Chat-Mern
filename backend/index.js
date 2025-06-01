import express from "express" ;
import dotenv from "dotenv"
import { connectDB } from "./src/lib/db.js";
import authRouters from "./src/routers/auth.routers.js"
import messageRouters from "./src/routers/message.routers.js"
import cookieParser from "cookie-parser";
import {app , server} from "./src/lib/socket.js"
import cors from 'cors' ;
dotenv.config()  ;


const port = process.env.PORT ; 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser()) ; 
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,               
  optionsSuccessStatus: 200         
}));


app.use('/api/auth' , authRouters) ; 
app.use('/api/messages' , messageRouters) ; 

server.listen(port , (res , req) => {
    console.log(`Connect http://localhost:${port}`) ; 
    connectDB() ; 
}) ; 

