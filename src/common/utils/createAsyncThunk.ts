import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppDispatch, AppRootStateType } from "app/store"
import { ThunkDispatch } from "redux-thunk"
import { Dispatch } from "redux"

export const createAsyncAppThunk =  createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null
}>()