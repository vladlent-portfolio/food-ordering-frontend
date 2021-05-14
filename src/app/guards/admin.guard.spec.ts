import { TestBed } from "@angular/core/testing"

import { AdminGuard } from "./admin.guard"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { User } from "../models/models"
import { Route } from "@angular/router"

describe("AdminGuard", () => {
  let guard: AdminGuard
  let store: MockStore<{ user: User }>
  let route: Route
  let user: User

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideMockStore({ initialState: { user: null } })],
    })
    guard = TestBed.inject(AdminGuard)
    store = TestBed.inject(MockStore)
    route = { path: "admin" }

    user = {
      id: 123,
      email: "mail@example.com",
      created_at: new Date().toISOString(),
      is_admin: false,
    }
  })

  it("should return false if user is not authorized", () => {
    guard.canLoad(route).subscribe(val => expect(val).toBeFalse())
  })

  it("should return false if user is not admin", () => {
    user.is_admin = false
    store.setState({ user })
    guard.canLoad(route).subscribe(val => expect(val).toBeFalse())
  })

  it("should return true if user is admin", () => {
    user.is_admin = true
    store.setState({ user })
    guard.canLoad(route).subscribe(val => expect(val).toBeTrue())
  })
})
