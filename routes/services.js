import { createNewService, deleteServiceById, getAllServices, getServiceById, updateServiceById } from '../controllers/services.js';
import express from "express";


const router = express.Router();
// this is /services because it is defined in the routes/index.js file
router.get("/", getAllServices);  

// then this will be /services/:id
router.get("/:id", getServiceById);

router.post("/", createNewService);

router.put("/:id", updateServiceById);

router.delete("/:id", deleteServiceById);

export default router;
