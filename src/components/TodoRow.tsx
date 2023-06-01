import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { Todo } from "@/Lib/todos";

type TodoRowProps = {
	todo: Todo;
	onDeleteTodo: () => void;
	onChange: () => void;
	onShow: () => void;

}

export default function TodoRow({ todo, onDeleteTodo, onChange, onShow } : TodoRowProps) {
	return (
		<div className="todo">
			<div className="todoContent">
				<h3 className={todo.completed ? 'completed' : ''}>{todo.name}</h3>
				<p>{todo.content}</p>
			</div>
			
			<div className="iconsContainer">
                <input
					type="checkbox"
					defaultChecked={todo.completed}
					onChange={onChange}
					className="check"
				/>
				<div className="flex flex-col h-full justify-around">
				<HiOutlineTrash
					color="red"
					onClick={onDeleteTodo}
					cursor= 'pointer'
				/>
				< FiEdit 
					color="green" 
					onClick={onShow}
					cursor= 'pointer'
				/>
				</div>
				
			</div>
		</div>
	);
}

