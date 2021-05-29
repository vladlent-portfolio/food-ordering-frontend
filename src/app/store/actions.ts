import { createAction, props } from "@ngrx/store"
import { Dish, User } from "../models/models"

export const loadStart = createAction("[App] HTTP Loading Start")
export const loadEnd = createAction("[App] HTTP Loading End")

export const setUserInfo = createAction("[User] Set User Info", props<{ user: User }>())
export const deleteUserInfo = createAction("[User] Clear User Info")

export const addDishToCart = createAction(
  "[App] Add Dish to Cart",
  props<{ dish: Dish }>(),
)

export const removeDishFromCart = createAction(
  "[App] Remove Dish From Cart",
  props<{ dish: Dish; amount: number }>(),
)

export const clearCart = createAction("[App] Clear Cart")
