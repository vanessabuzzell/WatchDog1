import express from "express";
// import pkg from "express-openid-connect";
import { requiresAuth } from "../middleware/auth.js";
import { createNewClient, deleteClientById, getAllClients, getClientById, updateClientById } from '../controllers/clients.js';

// const { requiresAuth } = pkg;
const router = express.Router();

router.use(requiresAuth());

// this is /clients because it is defined in the routes/index.js file
router.get("/", getAllClients);

// then this will be /clients/:id
router.get("/:id", getClientById);

router.post("/", createNewClient);

router.put("/:id", updateClientById);

router.delete("/:id", deleteClientById);

export default router;