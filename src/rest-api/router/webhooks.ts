import { Router } from "express";
import WebhooksController from "../controllers/webhooks";
import bodyParser from "body-parser";

const router = Router();

router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  WebhooksController.processStripeWebhook
);

router.get("/stripe", WebhooksController.checkStripeWebhookSignature);

export default router;