import { Action, createReducer, on } from "@ngrx/store"
import { loadEnd, loadStart } from "./actions"

export interface AppState {
  openRequests: number
}

export const initialState: AppState = {
  openRequests: 0,
}

// This reducer counts the total amount of currently open requests.
const _requestsReducer = createReducer(
  initialState.openRequests,
  on(loadStart, req => req + 1),
  on(loadEnd, req => req - 1),
)

export function requestsReducer(state: number | undefined, action: Action) {
  return _requestsReducer(state, action)
}
