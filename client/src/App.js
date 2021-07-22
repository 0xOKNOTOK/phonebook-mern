import React, { useState, useEffect } from 'react';
import './App.css';
import personsService from './services/persons';
import Notification from './components/Notification';

function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        personsService.getAllPeople().then((personsReturned) => {
            setPersons(personsReturned);
        });
    }, []);

    const onSuccess = (personObject, success) => {
        setSuccessMessage(success);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 5000);
    };

    const onFail = (error) => {
        setErrorMessage(error);
        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
        personsService.getAllPeople().then((personsReturned) => {
            setPersons(personsReturned);
        });
    };

    const validData = () => {
        const existingPerson = persons.find(
            (person) => person.name === newName
        );
        if (existingPerson) {
            const result = window.confirm(
                `${newName} is already in your phonebook, would you like to update the number?`
            );
            if (result) {
                const personObject = {
                    name: newName,
                    number: newNumber,
                    id: existingPerson.id,
                };
                personsService
                    .updatePersons(existingPerson.id, personObject)
                    .then((returnedPersonObject) => {
                        setPersons(
                            persons.map((n) =>
                                n.name === newName ? returnedPersonObject : n
                            )
                        );
                        const success = `${personObject.name} was updated in your phonebook!`;
                        onSuccess(returnedPersonObject, success);
                    })
                    .catch((error) => {
                        const fail = `User was already deleted from the database`;
                        onFail(fail);
                    });
            }
            return false;
        }

        return true;
    };

    const addNewPerson = (e) => {
        e.preventDefault();
        if (validData()) {
            const personObject = {
                name: newName,
                number: newNumber,
                id: Math.floor(Math.random() * 500),
            };
            personsService
                .addNewPersons(personObject)
                .then((returnedPersonObject) => {
                    setPersons(persons.concat(returnedPersonObject));
                    setNewName('');
                    setNewNumber('');
                    const success = `${personObject.name} was added to your phonebook!`;
                    onSuccess(personObject, success);
                });
        } else {
            return false;
        }
    };

    const handleNoteChange = (e) => {
        setNewName(e.target.value);
    };

    const handleNumberChange = (e) => {
        setNewNumber(e.target.value);
    };

    const handleDeleteBtn = ({ id, name }) => {
        if (window.confirm(`Do you wish to delete ${name}?`)) {
            personsService
                .deletePerson(id)
                .then((personObject) => {
                    const newPersonList = persons.filter(
                        (persons) => id !== persons.id
                    );
                    const success = `${name} was deleted from your phonebook!`;
                    onSuccess(personObject, success);
                    setPersons(newPersonList);
                })
                .catch((error) => {
                    onFail(error);
                });
        }
    };

    return (
        <div className="App">
            <h2>Phonebook</h2>
            <Notification
                message={errorMessage}
                errorType="notification-fail"
            />
            <Notification
                message={successMessage}
                errorType="notification-success"
            />
            <form onSubmit={addNewPerson}>
                <div>
                    <h3>
                        name:
                        <input value={newName} onChange={handleNoteChange} />
                    </h3>
                    <h3>
                        number:
                        <input
                            value={newNumber}
                            onChange={handleNumberChange}
                        />
                    </h3>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {persons.map((people) => (
                <div>
                    <h5>{people.name}</h5>
                    <p>{people.number}</p>
                    <button
                        onClick={() => handleDeleteBtn(people)}
                        type="submit"
                    >
                        Delete Contact
                    </button>
                </div>
            ))}
        </div>
    );
}

export default App;
