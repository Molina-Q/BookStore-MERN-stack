import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from './models/bookModels.js';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

// me permet de récup des données en json
app.use(express.json());

// CORS Policy (security protocols) / npm i cors
// Option 1 : 
app.use(cors());

// Option 2 :
// app.use(
//     cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//     })
// );

// Route
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To MERN Stack Tutorial')
});

// this make it so every Route that start with /books will be handled by booksRoute
app.use('/books', booksRoute);

// ma bdd
mongoose 
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database')
    
        app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error)
    });

    // 16:31 //