import { requestsReducer, userReducer } from "./reducers"
import { deleteUserInfo, loadEnd, loadStart, setUserInfo } from "./actions"
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
