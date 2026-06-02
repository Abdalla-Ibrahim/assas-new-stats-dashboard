import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import analyticsRouter from "./analytics";
import eventsRouter from "./events";
import factoriesRouter from "./factories";
import healthRouter from "./health";
import settingsRouter from "./settings";
import shippingRouter from "./shipping";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use("/factories", factoriesRouter);
router.use("/settings", settingsRouter);
router.use("/analytics", analyticsRouter);
router.use("/shipping", shippingRouter);
router.use("/admin", adminRouter);

export default router;
