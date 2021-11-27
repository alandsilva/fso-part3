import React from 'react';

const Persons = ({ namesToShow, removePerson }) => {
  return namesToShow.map((person, i) => (
    <p key={i}>
      {person.name} {person.number}{' '}
      <button onClick={() => removePerson(person)}>delete</button>
    </p>
  ));
};

export default Persons;
