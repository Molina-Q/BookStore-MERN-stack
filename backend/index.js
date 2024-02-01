import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from './models/bookModels.js';

const app = express();

// me permet de récup des données en json
app.use(express.json());

// mon url
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To MERN Stack Tutorial')
});

// ma creation de livre en async, METHOD Post
app.post('/books', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            })
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear
        };

        const book = await Book.create(newBook);
      
        return response.status(201).send(book);
    } catch (error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

// METHOD Get
// get all books in the db
app.get('/books', async (request, response) => {
    try {
        // va contenir tous les objets Book 
        const books = await Book.find({});
        // si il en reçoit un non null return un status valide et return sous format json le nb de book et leurs data
        return response.status(200).json({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });

    }
});

// get all books in the db
app.get('/books/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const book = await Book.findById(id);

        // si il en reçoit un non null return un status valide et return sous format json le nb de book et leurs data
        return response.status(200).json(book)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });

    }
});

// Route for update
app.put('/books/:id', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            })
        }

        // the needed id
        const { id } = request.params;

        // the result of the query
        const result = await Book.findByIdAndUpdate(id, request.body);

        if(!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book updated successfuly' });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for delete
app.delete('/books/:id', async (request, response) => {
    try {
      const { id } = request.params;

      const result = await Book.findByIdAndDelete(id);

      if(!result) {
        return response.status(404).json({ message: 'Book not found' });
      } 

      return response.status(200).send({ message: 'Book deleted successfuly' });


    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }

});
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