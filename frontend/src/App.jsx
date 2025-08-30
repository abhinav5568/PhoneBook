import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import contacts from "./services/contacts";
import Notification from "./components/Notification";
import Error from "./components/Error";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    contacts.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  const handleSubmit = (event) => {
    // prevents default re rendering behaviour of react
    event.preventDefault();

    // checking if the user exists already
    let exists = false;
    let contact = null; // stores the previously existing contact to make updates if user wants to update number
    for (let person of persons) {
      if (person.name === newName) {
        exists = true;
        contact = person;
        break;
      }
    }
    // if contact exists then prompt the user to update the number,
    if (exists) {
      if (
        confirm(
          `${newName} is already added to the phonebook, replace the old number with new one?`
        )
      ) {
        const changedContact = { ...contact, number: number };
        contacts
          .update(changedContact, contact.id)
          .then((newPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === newPerson.id ? newPerson : person
              )
            );
            setNewName("");
            setNumber("");
            
            // Update notification
            setMessage(`Updated ${contact.name}'s number`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            // when server returns 404,
            setError(
              `Information of ${newName} has already been removed from the server.`
            );
            setPersons(persons.filter((person) => person.id != contact.id));
            setTimeout(() => {
              setError(null);
            }, 5000);
          });
      }
      return;
    }

    // if contact doesnt exist before then create a new user
    const newUser = {
      name: `${newName}`,
      number: number,
    };
    contacts.create(newUser).then((newPerson) => {

      setPersons(newPerson);
      setNewName("");
      setNumber("");
      console.log(newPerson)
      // Added notification
      setMessage(`Added ${newUser.name}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);

    });
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Do you want to delete ${name}`)) {
      contacts.deletion(id).then((deletedContact) => {
        setPersons(persons.filter((person) => person.id != deletedContact.id));

        // Deletion notification
        setMessage(`Deleted ${name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);

      });
    } else {
      return;
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Error error={error} />
      <Notification message={message} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h1>Add a new</h1>
      <Form
        handleNumberChange={handleNumberChange}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        number={number}
        newName={newName}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
