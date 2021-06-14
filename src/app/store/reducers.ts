import { ActionReducerMap, createReducer, on } from "@ngrx/store"
import {
  addDishToCart,
  clearCart,
  deleteUserInfo,
  loadEnd,
  loadStart,
  removeDishFromCart,
  replaceCart,
  setUserInfo,
} from "./actions"
import { Dish, User } from "../models/models"

export type CartItem = {
  dish: Dish
  quantity: number
}
export type Cart = {
  [dishID: number]: CartItem
}

export interface AppState {
  openRequests: number
  user: User | null
  cart: Cart
}

export const initialState: AppState = {
  openRequests: 0,
  user: null,
  cart: {},
}

// This reducer counts the total amount of currently open requests.
export const requestsReducer = createReducer(
  initialState.openRequests,
  on(loadStart, req => req + 1),
  on(loadEnd, req => req - 1),
)

export const userReducer = createReducer(
  initialState.user,
  on(setUserInfo, (_, { user }) => user),
  on(deleteUserInfo, () => null),
)

export const cartReducer = createReducer(
  initialState.cart,
  on(addDishToCart, (state, { dish }) => ({
    ...state,
    [dish.id]: { dish, quantity: dish.id in state ? state[dish.id].quantity + 1 : 1 },
  })),
  on(removeDishFromCart, (state, { dish, amount }) => {
    if (!state[dish.id]) {
      return state
    }

    const { quantity } = state[dish.id]

    if (amount >= quantity) {
      const { [dish.id]: _, ...newState } = state
      return newState
    }

    return { ...state, [dish.id]: { dish, quantity: quantity - amount } }
  }),
  on(replaceCart, (_, { cart }) => cart),
  on(clearCart, () => ({})),
)

export const AppState: ActionReducerMap<AppState> = {
  openRequests: requestsReducer,
  user: userReducer,
  cart: cartReducer,
}
