import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { TodoUpdate } from './TodoUpdate';

export const TodoItem = ({
	todo,
	handleUpdateTodo,
	handleDeleteTodo,
	handleCompleteTodo,
}) => {


	return (
		<li>
			<span onClick={() => handleCompleteTodo(todo.id, todo)}>
				<label
					className={`container-done ${todo.done ? 'active' : ''}`}
				></label>
			</span>
			<TodoUpdate id="todo-update-component" todo={todo} handleUpdateTodo={handleUpdateTodo} />
			<button
				id = "btn-delete"
				className='btn-delete'
				onClick={() => handleDeleteTodo(todo.id)}
			>
				<FaTrash />
			</button>
		</li>
	);
};
