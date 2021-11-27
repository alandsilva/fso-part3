import React, { useState, useEffect } from 'react';
import './index.css';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Notification from './Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error');

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    // Check if name already exists
    if (persons.find((person) => person.name === newPerson.name)) {
      updatePerson(newPerson);
    } else {
      personService.create(newPerson).then((response) => {
        updateMessage(`Added ${newPerson.name}`, 'success');
        setPersons(persons.concat(response.data));
      });
    }
    setNewName('');
    setNewNumber('');
  };
  const updatePerson = (newPerson) => {
    if (
      window.confirm(
        `${newPerson.name} is already added to phonebook. Replace the old number with a new one?`
      )
    ) {
      const person = persons.find((person) => person.name === newPerson.name);
      const changedPerson = { ...person, number: newPerson.number };
      personService
        .update(person.id, changedPerson)
        .then((response) => {
          updateMessage(`Updated ${newPerson.name}`, 'success');
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : response.data))
          );
        })
        .catch(() => {
          updateMessage(
            `Information of ${newPerson.name} has already been removed from server`,
            'error'
          );
        });
    }
  };

  const removePerson = (personToRemove) => {
    if (window.confirm(`Delete ${personToRemove.name} ?`)) {
      personService
        .remove(personToRemove.id)
        .then(() => {
          updateMessage(`Deleted ${personToRemove.name}`, 'success');
          setPersons(
            persons.filter((person) => person.id !== personToRemove.id)
          );
        })
        .catch(() => {
          updateMessage(
            `${personToRemove.name} was already removed from server`,
            'error'
          );
        });
    }
  };

  const updateMessage = (message, type) => {
    setMessageType(type);
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const namesToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons namesToShow={namesToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
