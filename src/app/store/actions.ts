import { createAction, props } from "@ngrx/store"
import { User } from "../models/models"

export const loadStart = createAction("[App] HTTP Loading Start")
export const loadEnd = createAction("[App] HTTP Loading End")

export const setUserInfo = createAction("[User] Set User Info", props<{ user: User }>())
export const deleteUserInfo = createAction("[User] Clear User Info")
