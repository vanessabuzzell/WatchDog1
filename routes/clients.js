import { createNewClient, deleteClientById, getAllClients, getClientById, updateClientById } from '../controllers/clients.js';
import express from "express";
// import { handleValidation, validateClient, validateClientPatch } from '../middleware/validator.js';

const router = express.Router();

// this is /clients because it is defined in the routes/index.js file
router.get("/", getAllClients);

// then this will be /clients/:id
router.get("/:id", getClientById);

router.post("/", createNewClient);

router.put("/:id", updateClientById);

router.delete("/:id", deleteClientById);

export default router;