import { useState } from "react";
export type Todo = {
    id: string,
    user_id: string,
    name: string,
    content: string,
    completed: boolean
}

export const useTodos = (newTodos?: Todo[]) => {
    const [todos, setTodos] = useState(newTodos || [])

    // const initTodos = (todos: Todo[]) => {
    //     setTodos(todos)
    // }

    const addTodo = (todo: Todo) => {
        setTodos([...todos, todo].sort((a, b) => a.name.localeCompare(b.name)))
    }

    const updateTodo = (updatedTodo: Todo) => {
        const newTodos = [
            ...todos
          ]
        const todosIndex = todos.findIndex((todo) => updatedTodo.id === todo.id)
        if (updatedTodo.name === newTodos[todosIndex].name &&
            updatedTodo.content === newTodos[todosIndex].content &&
            updatedTodo.completed === newTodos[todosIndex].completed) {
            console.log("No change")
            return false
        }
        newTodos[todosIndex] = updatedTodo
        setTodos(newTodos)
        return true
    }

    const deleteTodo = (id: string) => {
        const newTodos = [
            ...todos
          ]
        const todosIndex = findIndex(id)
        // Rajout pour être sûr que l'index existe
        if (todosIndex === -1) {
            return
        }
          newTodos.splice(todosIndex, 1)
        setTodos(newTodos)
        
        // filter retourne un nouveau tableau, méthode plus élégante
        // setTodos(todos.filter((todo) => todo.id !== id));
    }

    const checkTodo = (id: string) => {
        const newTodos = [
            ...todos
          ]
          const todosIndex = findIndex(id)
          newTodos[todosIndex].completed = !newTodos[todosIndex].completed
        setTodos(newTodos)
        return newTodos[todosIndex].completed
    }

    const findIndex = (id: string) => {
        return todos.findIndex((todo) => id === todo.id)
    }

    return {
        // initTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        checkTodo,
        todos
    }
}
