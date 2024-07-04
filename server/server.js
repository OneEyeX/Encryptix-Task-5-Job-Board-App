import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import xss from 'xss-clean';
import dbConnection from './dbConfig/dbConnection.js';

dotenv.config()

const app = express();

const PORT = process.env.PORT || 8800;

// MONGODB Connection
dbConnection();

// middleware
app.use(cors());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.listen(PORT, () => {
    console.log(`Dev server is listening on port ${PORT}`);
}); 