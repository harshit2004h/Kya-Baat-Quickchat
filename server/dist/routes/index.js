import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import ChatGroupController from "../controllers/ChatGroupController.js";
import ChatGroupUserController from "../controllers/ChatGroupUserController.js";
import ChatsController from "../controllers/ChatsController.js";
const router = Router();
router.post("/auth/login", AuthController.login);
//chat group routes
router.post("/chat-group", AuthMiddleware, ChatGroupController.store);
router.get("/chat-group", AuthMiddleware, ChatGroupController.index);
router.get("/chat-group/:id", ChatGroupController.show);
router.put("/chat-group/:id", AuthMiddleware, ChatGroupController.update);
router.delete("/chat-group/:id", AuthMiddleware, ChatGroupController.destroy);
//chat group user routes
router.get("/chat-group-users", ChatGroupUserController.index);
router.post("/chat-group-users", ChatGroupUserController.store);
//chat messages routes
router.get("/chats/:group_id", ChatsController.index);
export default router;
