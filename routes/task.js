import express from "express";
import { deleteParticularTask, getAllTask, getMyTask ,postTask, updateTask } from "../controllers/task.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { taskValidation } from "../validators/taskValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";
const router = express.Router();

router.get("/alltasks", getAllTask)
// developer API Endpoint 

router.get("/tasks", isAuthenticated, getMyTask)
router.route("/tasks")
    .post( isAuthenticated , taskValidation , validate , postTask)
router.route("/:id")
 .put(isAuthenticated , updateTask)
 .delete(isAuthenticated ,  deleteParticularTask)


export default router;