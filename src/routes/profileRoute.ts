import { Router } from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/profileController";
import { protect } from "../middlewares/authMiddleware";

const profileRoutes = Router();

profileRoutes.get("/", protect, getProfile);
profileRoutes.put("/", protect, updateProfile);
profileRoutes.put("/password", protect, changePassword);

export default profileRoutes;