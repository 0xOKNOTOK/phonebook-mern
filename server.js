const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config({ path: './utils/cfg.env' });
const connectToDatabase = require('./utils/db');
const PORT = process.env.PORT || 5000;
const Person = require('./models/person');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

connectToDatabase();

app.use(cors());
app.use(express.json());

app.use(
    morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            JSON.stringify(req.body),
        ].join(' ');
    })
);

let phonebook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

app.get('/api/persons', (req, res) => {
    Person.find()
        .then((result) => {
            res.status(200).json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            res.status(404).json({
                success: false,
                data: 'Data not found.',
            });
        });
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    Person.findById(id)
        .then((result) => {
            res.status(200).json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            res.status(404).json({
                success: false,
                data: 'Data not found.',
            });
        });
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const person = new Person({
        _id: uuidv4(),
        name: body.name,
        number: body.number,
    });

    if (!person.name || !person.number) {
        res.status(402).json({
            error: 'User must provide name and number.',
        });
    } else {
        person.save().then((person) => {
            res.status(201).json({
                success: true,
                data: person,
            });
        });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = phonebook.filter((person) => person.id === id);
    res.status(204).end();
});

app.get('/info', (req, res) => {
    const numberOfPeople = phonebook.length;
    const currentDate = new Date().toLocaleString('en-gb');
    res.send(
        `Phone book has information for ${numberOfPeople} people.\n ${currentDate} [GMT+0000 BRITISH STANDARD TIME]`
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
