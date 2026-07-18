import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  paginationSchema,
  updateTaskSchema,
} from "../validators";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), taskController.create);
router.get("/", validate(paginationSchema, "query"), taskController.getAll);
router.get("/stats", taskController.getStats);
router.get("/:id", taskController.getById);
router.put("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", taskController.delete);

export default router;
