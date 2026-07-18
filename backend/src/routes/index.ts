import { Router } from "express";
import authRoutes from "./auth.routes";
import taskRoutes from "./task.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

export default router;
