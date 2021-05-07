import { Action, createReducer, on } from "@ngrx/store"
import { loadEnd, loadStart } from "./actions"

const isLoading = false
const reducer = createReducer(
  isLoading,
  on(loadStart, () => true),
  on(loadEnd, () => false),
)

export function loadingReducer(state: boolean | undefined, action: Action) {
  return reducer(state, action)
}
