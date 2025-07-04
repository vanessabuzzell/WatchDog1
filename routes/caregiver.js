import { getAllCaregivers, getCaregiverById, createNewCaregiver, updateCaregiverById, deleteCaregiverById} from "../controllers/caregiver.js"
import express from "express";

const router = express.Router();

router.get("/", getAllCaregivers);

router.get("/:id", getCaregiverById);

router.post("/", createNewCaregiver);

router.put("/:id", updateCaregiverById);

router.delete("/:id", deleteCaregiverById);

export default router;