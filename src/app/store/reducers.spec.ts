import { cartReducer, requestsReducer, screenSizeReducer, userReducer } from "./reducers"
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
import { User } from "../models/models"

describe("Requests Reducer", () => {
  it("should add one req on loading start", () => {
    expect(requestsReducer(0, loadStart)).toBe(1)
    expect(requestsReducer(10, loadStart)).toBe(11)
    expect(requestsReducer(-5, loadStart)).toBe(-4)
  })

  it("should subtract one req on loading end", () => {
    expect(requestsReducer(-5, loadEnd)).toBe(-6)
    expect(requestsReducer(1, loadEnd)).toBe(0)
    expect(requestsReducer(23, loadEnd)).toBe(22)
  })
})

describe("Screen Size Reducer", () => {
  it("should update screen size", () => {
    for (const bool of [true, false]) {
      expect(
        screenSizeReducer(undefined, setIsSmallScreen({ isSmallScreen: bool })),
      ).toBe(bool)
    }
  })
})

describe("User Reducer", () => {
  const user: User = {
    id: 1,
    email: "example@mail.com",
    created_at: new Date().toISOString(),
    is_admin: true,
  }
  it("should set user info", () => {
    const testUser: User = {
      id: 123,
      email: "mail@example.com",
      created_at: new Date().toISOString(),
      is_admin: false,
    }
    expect(userReducer(null, setUserInfo({ user }))).toEqual(user)
    expect(userReducer(testUser, setUserInfo({ user }))).toEqual(user)
  })

  it("should clear user info", () => {
    expect(userReducer(user, deleteUserInfo())).toBeNull()
    expect(userReducer(null, deleteUserInfo())).toBeNull()
  })
})

describe("Cart Reducer", () => {
  const categories = [
    { id: 1, title: "Salads", removable: false, image: "/categories/1.png" },
    { id: 3, title: "Pizza", removable: true, image: "/categories/3.jpg" },
  ]
  const dishes = [
    {
      id: 2,
      title: "Crunchy Cashew Salad",
      price: 3.22,
      image: "/dishes/2.png",
      removable: true,
      category_id: 1,
      category: categories[0],
    },
    {
      id: 1,
      title: "Margherita",
      price: 4.2,
      image: "/dishes/1.png",
      removable: false,
      category_id: 3,
      category: categories[1],
    },
  ]

  describe("on addDishToCart", () => {
    it("should add items to the cart", () => {
      const expected = dishes.reduce(
        (acc, dish) => ({ ...acc, [dish.id]: { dish, quantity: 1 } }),
        {},
      )

      let state = {}

      for (const dish of dishes) {
        state = cartReducer(state, addDishToCart({ dish }))
      }

      expect(state).toEqual(expected)
    })

    it("should increase quantity if dish already in the cart", () => {
      const expected = {
        [dishes[0].id]: { dish: dishes[0], quantity: 3 },
        [dishes[1].id]: { dish: dishes[1], quantity: 2 },
      }

      let state = {}

      state = cartReducer(state, addDishToCart({ dish: dishes[0] }))
      state = cartReducer(state, addDishToCart({ dish: dishes[0] }))
      state = cartReducer(state, addDishToCart({ dish: dishes[0] }))

      state = cartReducer(state, addDishToCart({ dish: dishes[1] }))
      expect(cartReducer(state, addDishToCart({ dish: dishes[1] }))).toEqual(expected)
    })
  })

  describe("on setDishQuantity", () => {
    it("should set dish quantity", () => {
      let state: any = {
        [dishes[0].id]: { dish: dishes[0], quantity: 5 },
        [dishes[1].id]: { dish: dishes[1], quantity: 2 },
      }

      const expected = {
        [dishes[0].id]: { dish: dishes[0], quantity: 13 },
        [dishes[1].id]: { dish: dishes[1], quantity: 37 },
      }

      state = cartReducer(state, setDishQuantity({ id: dishes[0].id, quantity: 13 }))
      state = cartReducer(state, setDishQuantity({ id: dishes[1].id, quantity: 37 }))

      expect(state).toEqual(expected)
    })

    it("should remove item completely if quantity <= 0", () => {
      let state: any = {
        [dishes[0].id]: { dish: dishes[0], quantity: 5 },
        [dishes[1].id]: { dish: dishes[1], quantity: 2 },
      }

      state = cartReducer(state, setDishQuantity({ id: dishes[1].id, quantity: 0 }))
      expect(state).toEqual({ [dishes[0].id]: { dish: dishes[0], quantity: 5 } })

      expect(
        cartReducer(state, setDishQuantity({ id: dishes[0].id, quantity: -Infinity })),
      ).toEqual({})
    })

    it("should return the same state if provided id isn't in state", () => {
      const state: any = {
        [dishes[0].id]: { dish: dishes[0], quantity: 5 },
      }

      const newState = cartReducer(state, setDishQuantity({ id: 123, quantity: 123 }))

      expect(newState).toBe(state)
    })
  })

  describe("on clearCart", () => {
    it("should assign empty object to cart", () => {
      let state: any = {
        [dishes[0].id]: { dish: dishes[0], quantity: 5 },
        [dishes[1].id]: { dish: dishes[1], quantity: 2 },
      }

      expect(cartReducer(state, clearCart())).toEqual({})
    })
  })

  describe("on replaceCart", () => {
    it("should replace current cart state with provided one", () => {
      const cart1 = {
        [dishes[0].id]: { dish: dishes[0], quantity: 5 },
      }
      const cart2 = {
        [dishes[0].id]: { dish: dishes[0], quantity: 5 },
        [dishes[1].id]: { dish: dishes[1], quantity: 2 },
      }
      const cart3 = {
        [dishes[1].id]: { dish: dishes[1], quantity: 2 },
      }

      let newState = cartReducer({}, replaceCart({ cart: cart1 }))
      expect(newState).toEqual(cart1)

      newState = cartReducer(cart1, replaceCart({ cart: cart2 }))
      expect(newState).toEqual(cart2)

      newState = cartReducer(cart2, replaceCart({ cart: cart3 }))
      expect(newState).toEqual(cart3)

      expect(cartReducer(cart3, replaceCart({ cart: {} }))).toEqual({})
    })
  })
})
