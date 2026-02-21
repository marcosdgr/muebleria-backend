import Router from "express"
import { loginAdmin } from "../controllers/auth.controller.js"
import validate from "../middlewares/validate.middleware.js"
import { loginAdminSchema } from "../validators/login.validator.js";

const router = Router();

router.post("/login", validate(loginAdminSchema), loginAdmin);

export default router;