import { BaseResponseType } from "common/types"
import { instance } from "common/api/api"

export const todolistApi = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", {
      title: title,
    })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<BaseResponseType>(`todo-lists/${id}`, {
      title: title,
    })
  }
}

// types

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
