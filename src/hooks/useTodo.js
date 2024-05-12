import { useEffect, useReducer } from "react";
import { todoReducer } from "../todoreducer";
import axios from "axios";

export const useTodo = () => {
  const URL = "http://localhost:8080/api/v1/task";

  const initialState = [];

  const init = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  };

  const [todos, dispatch] = useReducer(todoReducer, initialState, init);

  const todosCount = todos.length;
  const pendingTodosCount = todos.filter((todo) => !todo.done).length;

  const fetchTodo = async () => {
    try {
      const response = await axios.get(URL);
      localStorage.setItem("todos", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [todos]); // Empty dependency array to run effect only once when component mounts

  const handleNewTodo = (todo) => {
    const action = {
      type: "Add Todo",
      payload: todo,
    };

    axios.post(URL, action.payload); // Add new todo into database
    dispatch(action); // Add todo to local array and show this in execution time
  };

  const handleDeleteTodo = (id) => {
    const action = {
      type: "Delete Todo",
      payload: id,
    };
    axios.delete(URL + "/" + id);
    dispatch(action);
  };

  const handleCompleteTodo = (id, todo) => {
    const action = {
      type: "Complete Todo",
      payload: id,
    };
    
    const todoToUpdate = todo
    todoToUpdate.done = !todoToUpdate.done // Update to insert in database
    
    axios.put(URL + "/" + id, todo);
    todoToUpdate.done = !todoToUpdate.done // Update to upload local status

    dispatch(action);
  };

  const handleUpdateTodo = (id, description) => {
    const action = {
      type: "Update Todo",
      payload: {
        id,
        description,
      },
    };

    dispatch(action);
  };

  return {
    todos,
    todosCount,
    pendingTodosCount,
    handleNewTodo,
    handleDeleteTodo,
    handleCompleteTodo,
    handleUpdateTodo,
  };
};
