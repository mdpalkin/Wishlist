import { AppRootStateType } from "app/store"

export const selectIsLoginIn = (state: AppRootStateType) => state.auth.isLoggedIn