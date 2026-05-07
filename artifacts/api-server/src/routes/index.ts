import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import factoriesRouter from "./factories";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/factories", factoriesRouter);
router.use("/admin", adminRouter);

export default router;
