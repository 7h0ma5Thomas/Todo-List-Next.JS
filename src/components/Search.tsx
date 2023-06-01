
type SearchProps = {
	onChange: (searchTodo: string) => void
}

export default function Search({ onChange } : SearchProps) {
	const handleChange = (e) => {
		const searchTodo = e.target.value
		onChange(searchTodo)
	}
  return (
    <form
			className="addTodoContainer"
			>
			<input
        		name="name"
				className="input"
				type="text"
				placeholder="Trier par nom"
				onChange={handleChange}
			/>
	</form>
  )
}
