import express from 'express'
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessageForUser, getUserForSideBar, sendMessage } from "../controllers/message.controllers.js";
const router = express.Router() ; 
router.get("/users" , protectRoute,getUserForSideBar) ;
router.get("/:id" , protectRoute,getMessageForUser) ;
router.post("/send/:id" , protectRoute,sendMessage) ;
export default router ;