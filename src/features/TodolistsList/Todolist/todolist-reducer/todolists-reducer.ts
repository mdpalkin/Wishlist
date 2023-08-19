import { ResultCodes, todolistsAPI, TodolistType } from "api/todolists-api"
import { Dispatch } from "redux"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { AppThunk } from "app/store"
import { appActions, RequestStatusType } from "app/app-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { tasksAction } from "features/TodolistsList/Todolist/tasks-reducer/tasks-reducer"

const slice = createSlice({
  name: "todolists",
  initialState: {
    todolists: [] as Array<TodolistDomainType>,
  },
  reducers: {
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.todolists.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.todolists.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) state.todolists.splice(index, 1)
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.todolists.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state.todolists[index].title = action.payload.title
    },
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>,
    ) => {
      const index = state.todolists.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state.todolists[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>,
    ) => {
      const todolist = state.todolists.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    },
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      return action.payload.todolists.forEach((todo) => {
        state.todolists.push({ ...todo, entityStatus: "idle", filter: "all" })
      })
    },
  },
  extraReducers: (builder) =>
    builder.addCase(tasksAction.clearData, (state, action) => {
      state.todolists = []
    }),
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistsActions.setTodolists({ todolists: res.data }))
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    dispatch(
      todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }),
    )
    todolistsAPI
      .deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === ResultCodes.OK) {
          dispatch(todolistsActions.removeTodolist({ id: todolistId }))
          dispatch(appActions.setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
          dispatch(
            todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "idle" }),
          )
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
        dispatch(
          todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "idle" }),
        )
      })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    todolistsAPI
      .createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === ResultCodes.OK) {
          dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
          dispatch(appActions.setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    todolistsAPI
      .updateTodolist(id, title)
      .then((res) => {
        if (res.data.resultCode === ResultCodes.OK) {
          dispatch(todolistsActions.changeTodolistTitle({ id, title }))
          dispatch(appActions.setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}

// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch
