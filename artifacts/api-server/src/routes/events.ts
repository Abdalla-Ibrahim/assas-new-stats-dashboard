import { Router, type IRouter } from "express";
import { getDataVersion, onDataChange } from "../lib/dataEvents";

const router: IRouter = Router();

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  res.write(`event: ready\n`);
  res.write(`data: ${JSON.stringify({ version: getDataVersion(), changedAt: new Date().toISOString() })}\n\n`);

  const unsubscribe = onDataChange((payload) => {
    res.write(`event: data-change\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });

  const heartbeat = setInterval(() => {
    res.write(`event: ping\n`);
    res.write(`data: ${JSON.stringify({ version: getDataVersion() })}\n\n`);
  }, 30_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
    res.end();
  });
});

export default router;

