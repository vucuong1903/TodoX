import express from "express";
import tasksController from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", tasksController.getTasks);
router.post("/", tasksController.createTask);
router.put("/:id", tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);

export default router;
