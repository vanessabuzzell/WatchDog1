import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import indexRoutes from './routes/index.js';
import clientsRoutes from './routes/clients.js';
import caregiverRoutes from './routes/caregiver.js';
import bodyParser from 'body-parser';
import mongodb from './db/connect.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 8080;

app.set('trust proxy', 1); // Trust the first proxy (Render uses one)

// cors header policy
app.use(express.json());
app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })


// static htmls should go after passport but before routes 
app.use(express.static(path.join(__dirname, 'views')))

// routes
app.use("/", indexRoutes);
app.use("/clients", clientsRoutes);
app.use("/caregiver", caregiverRoutes);

// catch all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(process.env.PORT || port, () => {
            console.log(`Server running on http://localhost:${process.env.PORT || port}`);
        });
    }
});

export default app;