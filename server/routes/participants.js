import express from "express";
import { getUser, updateUser } from "../controllers/participant.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);

export default router;

// test the users route
// router.get("/test", testUsersRoute);