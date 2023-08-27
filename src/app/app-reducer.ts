import { authActions } from "features/auth/auth-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authAPI } from "features/auth/authApi"
import { createAsyncAppThunk, handleServerAppError, handleServerNetworkError } from "common/utils"

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isInitialized = action.payload.isInitialized
      })
  }
})


export const initializeApp = createAsyncAppThunk("app/initializeApp",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
    const res = await authAPI.me()

      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
      return { isInitialized: true }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }

  })

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = { initializeApp }
export type appInitialState = ReturnType<typeof slice.getInitialState>

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
