import { ActionReducerMap, createReducer, on } from "@ngrx/store"
import {
  addDishToCart,
  clearCart,
  deleteUserInfo,
  loadEnd,
  loadStart,
  setDishQuantity,
  replaceCart,
  setUserInfo,
  setIsSmallScreen,
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
  isSmallScreen: boolean
  user: User | null
  cart: Cart
}

export const initialState: AppState = {
  openRequests: 0,
  isSmallScreen: false,
  user: null,
  cart: {},
}

// This reducer counts the total amount of currently open requests.
export const requestsReducer = createReducer(
  initialState.openRequests,
  on(loadStart, req => req + 1),
  on(loadEnd, req => req - 1),
)

export const screenSizeReducer = createReducer(
  initialState.isSmallScreen,
  on(setIsSmallScreen, (_, { isSmallScreen }) => isSmallScreen),
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
  on(setDishQuantity, (state, { id, quantity }) => {
    if (!state[id]) {
      return state
    }

    if (quantity <= 0) {
      // Removes cart item with provided  id
      const { [id]: _, ...newState } = state
      return newState
    }

    return { ...state, [id]: { ...state[id], quantity: quantity } }
  }),
  on(replaceCart, (_, { cart }) => cart),
  on(clearCart, () => ({})),
)

export const AppState: ActionReducerMap<AppState> = {
  openRequests: requestsReducer,
  isSmallScreen: screenSizeReducer,
  user: userReducer,
  cart: cartReducer,
}
