require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Connects to the MongoDB database
mongoose.connect(`mongodb+srv://pierrefraisse90:${process.env.MONGO_URI_PASSWORD}@cluster0.dgitygx.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

// Imports the Todo schema
const Todo = require("./models/Todo.js");

// Gets all the todos with the .find() method
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();

    res.json(todos);
});

// Posts a new todo, adds it and saves it to the list
app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save();

    res.json(todo);
});

// Deletes a given post
app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);
});

// Updates a given post to a complete state
app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    todo.complete = !todo.complete;

    todo.save();

    res.json(todo);
});

if (process.env.NODE_ENV === 'production') {
    //*Set static folder up in production
    app.use(express.static('client/build'));

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });