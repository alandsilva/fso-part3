const express = require('express');
const app = express();
app.use(express.json());

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

app.get('/info/', (request, response) => {
  response.send(`<p>Phonebook has infor for ${phonebook.length} people</p>
                 <p>${new Date()} </p>`);
});

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});
app.post('/api/persons', (request, response) => {
  let person = request.body;
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  if (phonebook.find((p) => p.name == person.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }
  person.id = Math.floor(Math.random() * 1000000);
  phonebook = phonebook.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
