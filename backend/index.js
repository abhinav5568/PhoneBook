const express = require("express");
const app = express();
var morgan = require('morgan');

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json());

app.use(express.static('dist'));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/info", (req, res) => {
  const now = new Date().toUTCString();
  const page = `
    <p>Phonebook has info for ${persons.length} people </p>
    <p>${now}</p>
`;
  res.send(page);
});


app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find((person) => person.id === id)
    if(person){
        res.json(person);
    }else{
        res.status(404).json({msg: "Contact not found"});
    };
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id != id);
    res.status(204).json(persons);
})

app.post("/api/persons", (req, res) => {
    const {name, number} = req.body;
    console.log(req.body)

    // basic error checks, for missing name or number
    if(name.length == 0){
        res.status(401).json({error: "Name is missing"});
    }
    if(number.length == 0){
        res.status(404).json({error: "Number is missing"});
    }
    
    //check if a name already exists, and warn if it exists
    let isDuplicate = false;
    for (let index = 0; index < persons.length; index++) {
        const person = persons[index];
        if(person.name.toLocaleLowerCase() === name.toLocaleLowerCase()){
            isDuplicate = true;
            break;
        }
    }
    if(isDuplicate){
        res.status(404).json({error: "Name must be unique"});
    }
    // Generate a random integer ID between 1 and 1000
    const random = Math.floor(Math.random() * 1000) + 1;
    const newUser = {
        id: random, 
        name, 
        number
    }
    persons = persons.concat(newUser);
    res.status(204).send(persons);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Application live at PORT:${PORT}`);
});
