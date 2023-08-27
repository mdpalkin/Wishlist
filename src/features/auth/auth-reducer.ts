import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { authAPI, LoginParamsType } from "features/auth/authApi"
import { createAsyncAppThunk, handleServerAppError, handleServerNetworkError } from "common/utils"
import { ResultCodes } from "common/enums"


const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  }
})


// Thunks
export const loginTC = createAsyncAppThunk(
  "auth/login",
  async (data: LoginParamsType, { dispatch }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await authAPI.login(data)
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch)
    }
  }
)

export const logoutTC = createAsyncAppThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await authAPI.logout()
      if (res.data.resultCode === ResultCodes.OK) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (error) {
      handleServerNetworkError(error as Error, dispatch)
    }
  }
)


export const authReducer = authSlice.reducer
export const authActions = authSlice.actions
