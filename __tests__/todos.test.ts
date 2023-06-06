import { useTodos, Todo } from "@/Lib/todos"
import { renderHook, act } from "@testing-library/react"

const firstTodo: Todo = {
    user_id: "fdfsdfdsfdsf",
    id: "fdfsdfdsfdsf",
    name: "first todo",
    content: "first todo content",
    completed: false
}

describe("useTodos on start", () => {
    it("returns empty todos when start with no arguments", () => {
        const { result } = renderHook(useTodos)
        expect(result.current.todos).toEqual([])
    })
    it("returns with correct todos when start with arguments", () => {
        const newTodos: Todo[] = [
            firstTodo
        ]
        const { result } = renderHook(() => useTodos(newTodos))
        expect(result.current.todos).toEqual(newTodos)
    })
})


describe("addTodo", () => {
    it("returns todos with one todo when addTodo is called", () => {
        const { result } = renderHook(() => useTodos())
        act(() => {
            result.current.addTodo(firstTodo)
        })
        expect(result.current.todos).toEqual([firstTodo])
    })
})

describe("CheckTodo", () => {
    it("returns todos with updated completed todo when checkTodo is called", () => {
        const todoToUpdate = { ...firstTodo}
        const { result } = renderHook(() => useTodos([todoToUpdate]))
        act(() => {
            result.current.checkTodo(result.current.todos[0].id)
        })
        expect(result.current.todos).toEqual([todoToUpdate])
    })
})

describe("updateTodo", () => {
    it("returns todos with updated todo when updateTodo is called", () => {
        const todoToUpdate = { ...firstTodo}
        const { result } = renderHook(() => useTodos([todoToUpdate]))
        const updatedTodo = {
            ...todoToUpdate,
            name: "updated todo",
        }
        act(() => {
            result.current.updateTodo(updatedTodo)
        })
        expect(result.current.todos).toEqual([updatedTodo])
    })
})

describe("deleteTodo", () => {
    it("returns todos with deleted todo when deleteTodo is called", () => {
        const todoToDelete = { ...firstTodo}
        const { result } = renderHook(() => useTodos([todoToDelete]))
        act(() => {
            result.current.deleteTodo(result.current.todos[0].id)
        })
        console.log(result.current.todos)
        expect(result.current.todos).toEqual([])
    })
})

    