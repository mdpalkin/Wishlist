import { tasksReducer } from "features/TodolistsList/Todolist/tasks-reducer/tasks-reducer"
import { todolistsReducer } from "features/TodolistsList/Todolist/todolist-reducer/todolists-reducer"
import { AnyAction, applyMiddleware, combineReducers, createStore } from "redux"
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk"
import { appReducer } from "./app-reducer"
import { authReducer } from "features/Login/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния

// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AnyAction
>

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
