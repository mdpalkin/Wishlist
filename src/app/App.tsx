import React, { useCallback, useEffect } from "react"
import "./App.css"
import { TodolistsList } from "features/TodolistsList/TodolistsList"
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar"
import { useDispatch, useSelector } from "react-redux"
import { AppRootStateType } from "./store"
import { RequestStatusType } from "./app-reducer"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "features/auth/Login"
import { authThunk, logout } from "features/auth/auth-reducer"
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography
} from "@mui/material"
import { Menu } from "@mui/icons-material"
import { tasksAction } from "features/TodolistsList/Todolist/tasks-reducer/tasks-reducer"
import { selectIsInitialized, selectStatus } from "app/app-selectors"

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const status = useSelector<AppRootStateType, RequestStatusType>(selectStatus)
  const isInitialized = useSelector<AppRootStateType, boolean>(selectIsInitialized)
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)
  const dispatch = useDispatch<any>()

  useEffect(() => {
    dispatch(authThunk.initializeApp())
  }, [])

  const logoutHandler = useCallback(() => {
    dispatch(logout())
      .then(() => dispatch(tasksAction.clearData()))
      .catch(() => console.error("Lose connection"))
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    )
  }
  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={demo} />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
