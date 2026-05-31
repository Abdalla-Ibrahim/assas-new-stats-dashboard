import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

const router: IRouter = Router();

const PUBLIC_SETTING_KEYS = new Set(["map_display_settings"]);

router.get("/:key", async (req, res, next) => {
  try {
    if (!PUBLIC_SETTING_KEYS.has(req.params.key)) {
      return res.status(404).json({ error: "Setting not found." });
    }

    const [setting] = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, req.params.key))
      .limit(1);

    return res.json({
      setting: setting ?? {
        key: req.params.key,
        value: null,
        updatedAt: null,
      },
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
