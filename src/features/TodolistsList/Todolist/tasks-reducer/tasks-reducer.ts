import { Dispatch } from "redux"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { appActions } from "app/app-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { todolistsActions } from "features/TodolistsList/Todolist/todolist-reducer/todolists-reducer"
import { createAsyncAppThunk } from "common/utils/createAsyncThunk"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { todolistApi } from "features/todolistsApi"
import { ResultCodes, TaskPriorities, TaskStatuses } from "common/enums"
import { AddTaskArg, tasksApi, TaskType, UpdateTaskModelType } from "features/tasksApi"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todoId: string; taskId: string }>) => {
      const tasks = state[action.payload.todoId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    },
    clearData: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = []
        delete state[key]
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId].push(...action.payload.tasks)
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId]
        tasks.unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        debugger
        const tasksForTodolist = state[action.payload.todolistId]
        const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId)
        if (index !== -1) {
          tasksForTodolist[index] = { ...tasksForTodolist[index], ...action.payload.model }
        }
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
  }
})

// thunks
const fetchTasks =
  createAsyncAppThunk("tasks/fetchTasks",
    async (todolistId: string, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI
      try {
        dispatch(appActions.setAppStatus({ status: "loading" }))
        const res = await tasksApi.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        // dispatch(tasksAction.setTasks({ todoId: todolistId, tasks }))
        return { tasks, todolistId }
      } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
      }
    })

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  tasksApi
    .deleteTask(todolistId, taskId)
    .then((res) => {
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(tasksAction.removeTask({ todoId: todolistId, taskId }))
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

const addTask =
  createAsyncAppThunk("tasks/addTask", async (arg: AddTaskArg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await tasksApi.createTask(arg)
      if (res.data.resultCode === ResultCodes.OK) {
        const task = res.data.data.item
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { task }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  })


export const updateTask =
  createAsyncAppThunk<any, { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }>
  ("tasks/updateTask", async (arg, thunkAPI) => {
    const { dispatch, getState, rejectWithValue } = thunkAPI

    dispatch(appActions.setAppStatus({ status: "loading" }))

    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state")
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel
    }

    try {
      const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel)
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { todolistId: arg.todolistId, taskId: arg.taskId, model: arg.domainModel }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }

  })

export const tasksReducer = slice.reducer
export const tasksAction = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask }


// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
