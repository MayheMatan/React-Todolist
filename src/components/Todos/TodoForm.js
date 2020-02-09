import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './TodoForm.css';

const TodoForm = React.memo(props => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  console.log('RENDERING INGREDIENT FORM');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddTodo({ title: enteredTitle, description: enteredDescription, checked: false});
  };

  return (
    <section className="todo-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={enteredDescription}
              onChange={event => {
                setEnteredDescription(event.target.value);
              }}
            />
          </div>
          <div className="todo-form__actions">
            <button type="submit">Add Todo</button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default TodoForm;
