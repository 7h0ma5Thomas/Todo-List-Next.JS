import { v4 as uuidv4 } from "uuid";

export default function Inputs({ onNewTodo }) {
	const handleSubmit = (e) => {
		e.preventDefault()
		const newTodo = {
			id: uuidv4(),
			name: e.target.name.value,
			content: e.target.content.value,
			completed: false
		}
		onNewTodo(newTodo)
	}

	return (
		<form
			className="flex flex-col gap-2 w-full" 
			onSubmit={handleSubmit}
			>
			<input
        		name="name"
				className="input"
				type="text"
				placeholder=" Nouvelle todo"
			/>
			<input
        		name="content"
				className="input"
				type="text"
				placeholder=" Description de la todo"
			/>
			<input
				className="button"
				type="submit"
				value="Ajouter"
			/>
		</form>
	);
}
