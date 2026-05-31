import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import factoriesRouter from "./factories";
import healthRouter from "./health";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/factories", factoriesRouter);
router.use("/settings", settingsRouter);
router.use("/admin", adminRouter);

export default router;
