import express from "express";
import errorMiddleware from "../middlewares/errorsMiddleware.js";

import authRoute from "./authRoutes.js";
import companyRoute from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";
import userRoute from "./userRoutes.js";

const router = express.Router();
const path = "/api-v1/";

router.use(`${path}auth`, authRoute); // Mount auth routes
router.use(`${path}users`, userRoute); // Mount user routes
router.use(`${path}companies`, companyRoute); // Mount company routes
router.use(`${path}jobs`, jobRoute); // Mount job routes

// Example of applying error handling middleware globally
router.use(errorMiddleware);

export default router;
