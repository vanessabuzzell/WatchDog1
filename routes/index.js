import express from "express";
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

const router = express.Router();
const swaggerDocument = JSON.parse(readFileSync(new URL('../swagger.json', import.meta.url)));

router.get("/", (req, res) => {
    res.json("hello this is our final app api! Visit /api-docs for usage help");

})
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;