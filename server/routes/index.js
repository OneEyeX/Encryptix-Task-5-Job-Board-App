import express from "express";

import authRoute from "./authRoutes.js";
import companyRoute from "./companiesRoutes.js";
import userRoute from "./userRoutes.js";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute);
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);

export default router;
