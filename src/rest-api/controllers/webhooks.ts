import { NextFunction, Request, Response } from "express";

class WebhooksController {
  static processStripeWebhook = (req: Request, res: Response) => {
    console.log(req.body);
    res.status(200).send("Webhook received");
  };

  static checkStripeWebhookSignature = (req: Request, res: Response) => {
    res.send("live");
  };
}

export default WebhooksController;
