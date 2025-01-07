import "module-alias/register";
import "dotenv/config";
import "./config/database";
import { ApolloServer } from "apollo-server-express";
import express, { Request, Response } from "express";
import typeDefs from "@schemas/index";
import resolvers from "@resolvers/index";
import webhooksRouter from "./rest-api/router/webhooks";
import rateLimit from "express-rate-limit";
import { Helpers } from "@utils/constants";

const app = express();
app.set("trust proxy", 1);

const port = process.env.PORT || 4000;


const limiter = rateLimit({
  windowMs: Helpers.TEN_MINUTES_IN_MS,
  max: 200,
  message: (req: Request, res: Response) => {
    const retryAfter = Math.ceil(
      (Number(res.get("x-ratelimit-reset")!) - Date.now()) / 1000
    );

    return `Too many requests from this IP, please try again after ${retryAfter} seconds.`;
  },
  headers: true,
  handler: (req, res, next, options) => {
    res.setHeader("Retry-After", Math.ceil(options.windowMs / 1000));
    res.status(options.statusCode).send(options.message(req, res));
  },
});

app.use(limiter);

app.use("/webhooks", webhooksRouter);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  cache: "bounded",
  persistedQueries: {
    ttl: 900,
  }
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
});
