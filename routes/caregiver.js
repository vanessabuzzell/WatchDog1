import express from "express";
// import pkg from "express-openid-connect";
import { requiresAuth } from "../middleware/auth.js";
import { getAllCaregivers, getCaregiverById, createNewCaregiver, updateCaregiverById, deleteCaregiverById } from "../controllers/caregiver.js"

// const { requiresAuth } = pkg;
const router = express.Router();

router.use(requiresAuth());

router.get("/", getAllCaregivers);

router.get("/:id", getCaregiverById);

router.post("/", createNewCaregiver);

router.put("/:id", updateCaregiverById);

router.delete("/:id", deleteCaregiverById);

export default router;