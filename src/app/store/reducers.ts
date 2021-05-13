import { Action, ActionReducerMap, createReducer, on } from "@ngrx/store"
import { deleteUserInfo, loadEnd, loadStart, setUserInfo } from "./actions"
import { User } from "../models/models"

export interface AppState {
  openRequests: number
  user: User | null
}

export const AppState: ActionReducerMap<AppState> = {
  openRequests: requestsReducer,
  user: userReducer,
}

export const initialState: AppState = {
  openRequests: 0,
  user: null,
}

// This reducer counts the total amount of currently open requests.
const _requestsReducer = createReducer(
  initialState.openRequests,
  on(loadStart, req => req + 1),
  on(loadEnd, req => req - 1),
)

const _userReducer = createReducer(
  initialState.user,
  on(setUserInfo, (_, { user }) => user),
  on(deleteUserInfo, () => null),
)

export function requestsReducer(state: number | undefined, action: Action) {
  return _requestsReducer(state, action)
}

export function userReducer(state: User | null | undefined, action: Action) {
  return _userReducer(state, action)
}
