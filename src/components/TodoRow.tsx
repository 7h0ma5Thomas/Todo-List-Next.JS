import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";

export default function TodoRow({ todo, onDeleteTodo, onChange, onShow }) {

	return (
		<div className=" bg-white rounded-lg shadow-xl text-slate-500 p-2 m-2 flex justify-between">
			<div className="flex flex-col">
				<p className={todo.completed ? 'completed' : ''}>{todo.name}</p>
				<p>{todo.content}</p>
			</div>
			
			<div className="flex gap-2 items-center">
                <input
					type="checkbox"
					defaultChecked={todo.completed}
					onChange={onChange}
					className="h-5 w-5"
				/>
				<div className="flex flex-col h-full justify-around">
				<HiOutlineTrash
					color="red"
					onClick={onDeleteTodo}
				/>
				< FiEdit 
					color="green" 
					onClick={onShow}
				/>
				</div>
				
			</div>
		</div>
	);
}

