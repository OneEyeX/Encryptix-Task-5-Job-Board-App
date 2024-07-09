import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import xss from 'xss-clean';
import dbConnection from './dbConfig/dbConnection.js';
import errorMiddleware from './middlewares/errorsMiddleware.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// MongoDB Connection
dbConnection();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('dev'));

// Routes
app.use(router);

// Error Middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
