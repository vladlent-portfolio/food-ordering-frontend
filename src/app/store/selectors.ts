import { createSelector } from "@ngrx/store"
import { AppState } from "./reducers"

export const selectIsLoading = createSelector(
  (state: AppState) => state.openRequests,
  openRequests => openRequests != 0,
)
