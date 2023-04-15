const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://karimzeed3:bSZtiV3tr979W86t@test.fjvjkhg.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Set up the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define the Todo model schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

const Todo = mongoose.model('Todo', todoSchema);

// Define the routes for CRUD operations
app.post('/todo', async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description
        });
        await todo.save();
        res.status(200).send(todo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating todo');
    }
});

app.get('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send(todo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving todo');
    }
});

app.put('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
        }, { new: true });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send(todo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating todo');
    }
});

app.delete('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send(todo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting todo');
    }
});

app.get('/todo', async (req, res) => {
    try {
        const todo = await Todo.find({});
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send(todo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving todo');
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
