import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadTodos } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          process.env.REACT_APP_FIRE_BASE_URL + 'todos.json' + query
        )
          .then(response => response.json())
          .then(responseData => {
            const loadedTodos = [];
            for (const key in responseData) {
              loadedTodos.push({
                id: key,
                title: responseData[key].title,
                description: responseData[key].description,
                checked: responseData[key].checked
              });
            }
            onLoadTodos(loadedTodos);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadTodos, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
