import "dotenv/config";
import { DATABASE_URI } from "@utils/constants";
import crypto from "crypto";
import mongoose from "mongoose";
console.log(process.env.DATABASE_URI);
mongoose
  .connect(DATABASE_URI)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));