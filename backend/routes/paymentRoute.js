import express from "express";
import { enrollCourse } from "../controllers/orderController.js";

let paymentRouter = express.Router();

// Free enrollment endpoint (no payment required)
paymentRouter.post("/enroll", enrollCourse);

export default paymentRouter;