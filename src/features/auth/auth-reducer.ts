import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { authAPI, LoginParamsType } from "features/auth/authApi"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { ResultCodes } from "common/enums"
import { Dispatch } from "redux"


const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
})


// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (arg: LoginParamsType, thunkAPI) => {

    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await authAPI.login(arg)
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        dispatch(appActions.setAppStatus({ status: "failed" }))
        return rejectWithValue(res.data)
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch as Dispatch)
      return rejectWithValue(null)
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {

    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await authAPI.logout()
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { isLoggedIn: false }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch as Dispatch)
      return rejectWithValue(null)
    }
  }
)

const initializeApp = createAsyncThunk<{
  isLoggedIn: boolean
}, undefined>("auth/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true }
    } else {
      // handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch as Dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }))
  }
})

export const authReducer = authSlice.reducer
// export const authActions = authSlice.actions
export const authThunk = { login, logout, initializeApp }
