const express = require("express");

const router = express.Router();

// Controller imports
const authController =
  require("../../Controllers/AuthController").authController;

const userController = require("../../Controllers/UserController");

const conversationController = require("../../Controllers/ConversationsController");

// Middleware imports
const authMiddleware = require("../../Middlewares/auth");

router.post("/user/auth", authController);

router.get("/user", authMiddleware, userController.getUser);

router.post(
  "/conversations",
  authMiddleware,
  conversationController.getConversationList
);

router.get(
  "/conversations/:conversationId",
  conversationController.getConversationById
);

module.exports = router;
