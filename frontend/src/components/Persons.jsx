const Persons = ({ persons, filter, handleDelete }) => {
  return (
    <div>
      <ul>
        {persons
          .filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map((person) => (
            <li key={person.name}>
              {person.name} {person.number}{" "}
              <button onClick={() => handleDelete(person.id, person.name)}>
                delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Persons;
