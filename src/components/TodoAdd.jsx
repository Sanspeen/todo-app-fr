import React from 'react';
import { useForm } from '../hooks/useForm';
import Swal from 'sweetalert2'

export const TodoAdd = ({ handleNewTodo }) => {
	const { description, onInputChange, onResetForm } = useForm({
		description: '',
	});
	
	const onFormSubmit = e => {
		e.preventDefault();
		console.log(description);
		if (description.length < 1){
			Swal.fire({
				icon: "error",
				title: "Necesitas una tarea!",
				text: "Ingresa minimo ingresar texto para saber que haras :)",
			  });
			return;
		} 
		let newTodo = {
			id: new Date().getTime(),
			description: description,
			done: false,
		};
		handleNewTodo(newTodo);
		onResetForm();
	};

	return (
		<form onSubmit={onFormSubmit}>
			<input
				type='text'
				className='input-add'
				name='description'
				value={description}
				onChange={onInputChange}
				placeholder='¿Qué hay que hacer?'
			/>

			<button className='btn-add' type='submit'>
				Agregar
			</button>
		</form>
	);
};
