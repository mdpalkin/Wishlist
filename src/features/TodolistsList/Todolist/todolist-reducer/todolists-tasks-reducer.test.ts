import { TodolistDomainType, todolistsActions, todolistsReducer } from "features/TodolistsList/Todolist/todolist-reducer/todolists-reducer"
import { tasksReducer, TasksStateType } from "features/TodolistsList/Todolist/tasks-reducer/tasks-reducer"
import { TodolistType } from "features/todolistsApi"

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState = {
    todolists: [] as TodolistDomainType[],
  }

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  }

  const action = todolistsActions.addTodolist({ todolist })

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState.todolists[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
