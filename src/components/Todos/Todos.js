import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const todoReducer = (currentTodos, action) => {
  switch (action.type) {
    case 'SET':
      return action.todos;
    case 'ADD':
      return [...currentTodos, action.todo];
    case 'DELETE':
      return currentTodos.filter(todo => todo.id !== action.id);
    case 'TOGGLE_CHECK': {
      return currentTodos.map(todo => {
        if(todo.id === action.todo.id) {
          return {...todo, checked: !todo.checked}
        }
        return todo;
      })
    }
    default:
      throw new Error('Should not get there!');
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
};

const Todos = () => {
  const [userTodos, dispatch] = useReducer(todoReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userTodos);
  }, [userTodos]);

  const filteredTodosHandler = useCallback(filteredTodos => {
    dispatch({ type: 'SET', todos: filteredTodos });
  }, []);

  const addTodoHandler = useCallback(todo => {
    dispatchHttp({ type: 'SEND' });
    fetch(process.env.REACT_APP_FIRE_BASE_URL + `todos.json`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        return response.json();
      })
      .then(responseData => {
        console.log(responseData)
        dispatch({
          type: 'ADD',
          todo: { id: responseData.name, ...todo, checked: false }
        });
      });
  }, []);

  const removeTodoHandler = useCallback(todoId => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      process.env.REACT_APP_FIRE_BASE_URL + `todos/${todoId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'DELETE', id: todoId });
      })
      .catch(error => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  }, []);

  const CheckTodoHandler = useCallback(todo => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      process.env.REACT_APP_FIRE_BASE_URL + `todos/${todo.id}.json`,
      {
        method: 'PUT',
        body: JSON.stringify(todo),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        return response.json();
      })
      .then(responseData => {
        dispatch({
          type: 'TOGGLE_CHECK',
          todo: { 
            ...responseData
          }
        });
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const todoList = useMemo(() => {
    return (
      <TodoList
        todos={userTodos}
        onRemoveItem={removeTodoHandler}
        onCheckItem={CheckTodoHandler}
      />
    );
  }, [userTodos, removeTodoHandler, CheckTodoHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <TodoForm
        onAddTodo={addTodoHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadTodos={filteredTodosHandler} />
        {todoList}
      </section>
    </div>
  );
};

export default Todos;
