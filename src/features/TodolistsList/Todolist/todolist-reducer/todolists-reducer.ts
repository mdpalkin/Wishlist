import { Dispatch } from "redux"
import { AppDispatch } from "app/store"
import { appActions, RequestStatusType } from "app/app-reducer"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { tasksAction } from "features/TodolistsList/Todolist/tasks-reducer/tasks-reducer"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { ResultCodes } from "common/enums"
import { todolistApi, TodolistType, UpdateTodolistArg } from "features/TodolistsList/todolistsApi"


const slice = createSlice({
  name: "todolists",
  initialState: {
    todolists: [] as Array<TodolistDomainType>
  },
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) => {
      const index = state.todolists.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state.todolists[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>
    ) => {
      const todolist = state.todolists.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    }
  },
  extraReducers: builder =>
    builder
      .addCase(tasksAction.clearData, (state) => {
        state.todolists = []
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        console.log(action.payload)
        return action.payload.todolists.forEach((todo) => {
          state.todolists.push({ ...todo, entityStatus: "idle", filter: "all" })
        })
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.todolists.findIndex((tl) => tl.id === action.payload.id)
        if (index !== -1) state.todolists.splice(index, 1)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.todolists.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.todolists.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) state.todolists[index].title = action.payload.title
      })
})

// thunks

export const fetchTodolists = createAsyncThunk("todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistApi.getTodolists()
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { todolists: res.data }
    } catch (e) {
      handleServerNetworkError(e, (dispatch as AppDispatch))
      return rejectWithValue(null)
    }
  })


export const removeTodolist = createAsyncThunk("todolists/removeTodolists",
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistApi.deleteTodolist(todolistId)
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { id: todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "idle" }))
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch as Dispatch)
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "idle" }))
      return rejectWithValue(null)
    }
  })

export const addTodolist = createAsyncThunk("todolists/addTodolist",
  async (title: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistApi.createTodolist(title)
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { todolist: res.data.data.item  }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch as Dispatch)
      return rejectWithValue(null)
    }
  })

export const changeTodolistTitle = createAsyncThunk("todolists/changeTodolistTitle",
  async (arg: UpdateTodolistArg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistApi.updateTodolist(arg)
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { id: arg.id, title: arg.title  }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch as Dispatch)
      return rejectWithValue(null)
    }
  })

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }


// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
