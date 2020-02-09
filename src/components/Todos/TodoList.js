import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons'

import './TodoList.css';

const todoList = props => {
  console.log('RENDERING INGREDIENTLIST');
  library.add(faTrash, faCheck, faUndo);
  return (
    <section className="todo-list">
      <h2>Loaded Todos</h2>
      <ul>
        {props.todos.map(todo => (
          <li className={todo.checked ? "checked" : "un-checked"} key={todo.id}>
            <span>{todo.title}</span>
            <span>{todo.description}</span>
            <span>
              <span onClick={props.onCheckItem.bind(this, todo)}>
                <FontAwesomeIcon
                style={{"cursor": "pointer", "color": "#ff2058", "marginRight": "5px"}} 
                icon={todo.checked ? "undo" : "check"} /></span>
                <span onClick={props.onRemoveItem.bind(this, todo.id)}>
                <FontAwesomeIcon
                style={{"cursor": "pointer", "color": "#ff2058"}} 
                icon="trash" /></span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default todoList;
