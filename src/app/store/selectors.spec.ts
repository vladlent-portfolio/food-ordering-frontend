import { selectIsAdmin, selectIsLoading, selectIsLoggedIn } from "./selectors"
import { User } from "../models/models"

describe("selectIsLoading", () => {
  it("should return true if openRequests is not 0", () => {
    expect(selectIsLoading.projector(5)).toBeTrue()
    expect(selectIsLoading.projector(2)).toBeTrue()
    expect(selectIsLoading.projector(322)).toBeTrue()
  })

  it("should return true if openRequests is 0", () => {
    expect(selectIsLoading.projector(0)).toBeFalse()
  })
})

describe("user", () => {
  let user: User

  beforeEach(() => {
    user = {
      id: 123,
      email: "mail@example.com",
      created_at: new Date().toISOString(),
      is_admin: true,
    }
  })

  describe("selectIsLoggedIn", () => {
    it("should return true if User is truthy", () => {
      expect(selectIsLoggedIn.projector(user)).toBeTrue()
    })

    it("should return false if user is falsy", () => {
      expect(selectIsLoggedIn.projector(null)).toBeFalse()
    })
  })

  describe("selectIsAdmin", () => {
    it("should true if user is admin", () => {
      user.is_admin = true
      expect(selectIsAdmin.projector(user)).toBeTrue()
    })
    it("should false if user is not admin", () => {
      user.is_admin = false
      expect(selectIsAdmin.projector(user)).toBeFalse()
    })
    it("should false if user is falsy", () => {
      expect(selectIsAdmin.projector(null)).toBeFalse()
      expect(selectIsAdmin.projector(undefined)).toBeFalse()
    })
  })
})
