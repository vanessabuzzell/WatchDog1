import express from "express";
// import pkg from "express-openid-connect";
import { requiresAuth } from "../middleware/auth.js";
import { createNewService, deleteServiceById, getAllServices, getServiceById, updateServiceById } from '../controllers/services.js';

// const { requiresAuth } = pkg;
const router = express.Router();

router.use(requiresAuth());
// this is /services because it is defined in the routes/index.js file
router.get("/", getAllServices);
// then this will be /services/:id
router.get("/:id", getServiceById);

router.post("/", createNewService);

router.put("/:id", updateServiceById);

router.delete("/:id", deleteServiceById);

export default router;