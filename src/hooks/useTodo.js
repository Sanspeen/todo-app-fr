import { useEffect, useReducer } from "react";
import { todoReducer } from "../todoreducer";
import axios from "axios";
import Swal from 'sweetalert2'

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

  const handleNewTodo = async(todo) => {
    const action = {
      type: "Add Todo",
      payload: todo,
    };

    await axios.post(URL, action.payload).then(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tu tarea se guardo exitosamente!",
        showConfirmButton: false,
        timer: 2500
      });
      dispatch(action); // Add todo to local array and show this in execution time
    }).catch(() => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo guardar la tarea, intenta mas tarde"
      });
    }); // Add new todo into database
  };

  const handleDeleteTodo = (id) => {
    Swal.fire({
      title: "Estas seguro que deseas eliminar la tarea?",
      text: "No podras revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarla!"
    }).then((result) => {
      if (result.isConfirmed) {
        
        const action = {
          type: "Delete Todo",
          payload: id,
        };
        
        dispatch(action);
        axios.delete(URL + "/" + id);
        
        Swal.fire({
          title: "Eliminada!",
          text: "Tu tarea no volverá :)",
          icon: "success"
        });
      }
    });
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

  const handleUpdateTodo = (id, description, todo) => {
    const action = {
      type: "Update Todo",
      payload: {
        id,
        description,
      },
    };
    axios.put(URL + "/" + id, todo)
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
