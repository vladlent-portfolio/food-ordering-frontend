import { TestBed } from "@angular/core/testing"

import { UserService } from "./user.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { User } from "../models/models"
import { environment } from "../../environments/environment"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { AppState } from "../store/reducers"
import { deleteUserInfo, setUserInfo } from "../store/actions"

const baseURL = `${environment.apiURL}/users`
const user: User = {
  id: 56,
  created_at: new Date().toISOString(),
  email: "example_user@mail.com",
  is_admin: false,
}

describe("UserService", () => {
  let service: UserService
  let controller: HttpTestingController
  let store: MockStore<AppState>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore()],
    })
    service = TestBed.inject(UserService)
    controller = TestBed.inject(HttpTestingController)
    store = TestBed.inject(MockStore)
  })

  afterEach(() => {
    controller.verify()
  })

  describe("signIn()", () => {
    it("should send email and password and return User", () => {
      const password = "superpass123"

      service.signIn(user.email, password).subscribe(resp => expect(resp).toEqual(user))

      const req = controller.expectOne(`${baseURL}/signin`)
      const { request } = req

      expect(request.method).toBe("POST")
      expect(request.body).toEqual({ email: user.email, password })
      expect(request.withCredentials).toBeTrue()

      req.flush(user)
    })

    it("should update store with returned user on successful request", () => {
      const spy = spyOn(store, "dispatch")
      service.signIn(user.email, "123").subscribe(() => {
        expect(spy).toHaveBeenCalledWith(setUserInfo({ user }))
      })

      const req = controller.expectOne(`${baseURL}/signin`)
      req.flush(user)
    })

    it("should not update store on error", () => {
      const spy = spyOn(store, "dispatch")
      service.signIn(user.email, "123").subscribe({
        error: () => {
          expect(spy).not.toHaveBeenCalled()
        },
      })

      const req = controller.expectOne(`${baseURL}/signin`)
      req.flush("404 Error", { status: 404, statusText: "Not Found" })
    })
  })

  describe("signUp()", () => {
    it("should send email and password and return User", () => {
      const password = "superpass123"

      service.signUp(user.email, password).subscribe(resp => expect(resp).toEqual(user))

      const req = controller.expectOne(`${baseURL}/signup`)
      const { request } = req

      expect(request.method).toBe("POST")
      expect(request.withCredentials).toBeTrue()
      expect(request.body).toEqual({ email: user.email, password })

      req.flush(user)
    })

    it("should update store with returned user on successful request", () => {
      const spy = spyOn(store, "dispatch")
      service.signUp(user.email, "123").subscribe(() => {
        expect(spy).toHaveBeenCalledWith(setUserInfo({ user }))
      })

      const req = controller.expectOne(`${baseURL}/signup`)
      req.flush(user)
    })

    it("should not update store on error", () => {
      const spy = spyOn(store, "dispatch")
      service.signUp(user.email, "123").subscribe({ error: () => {} })

      const req = controller.expectOne(`${baseURL}/signup`)
      req.flush("404 Error", { status: 404, statusText: "Not Found" })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe("me()", () => {
    it("should return user info", () => {
      service.me().subscribe(resp => expect(resp).toEqual(user))

      const req = controller.expectOne(`${baseURL}/me`)
      expect(req.request.method).toBe("GET")
      expect(req.request.withCredentials).toBeTrue()

      req.flush(user)
    })
    it("should update store with returned user on successful request", () => {
      const spy = spyOn(store, "dispatch")
      service.me().subscribe()

      const req = controller.expectOne(`${baseURL}/me`)
      req.flush(user)
      expect(spy).toHaveBeenCalledWith(setUserInfo({ user }))
    })

    it("should not update store on error", () => {
      const spy = spyOn(store, "dispatch")
      service.me().subscribe({ error: () => {} })

      const req = controller.expectOne(`${baseURL}/me`)
      req.flush("404 Error", { status: 404, statusText: "Not Found" })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe("signOut()", () => {
    it("should sign out the user", () => {
      service.signOut().subscribe()

      const req = controller.expectOne(`${baseURL}/logout`)
      expect(req.request.method).toBe("GET")

      req.flush({})
    })

    it("should remove user info from store on success", () => {
      const spy = spyOn(store, "dispatch")
      service.signOut().subscribe()

      const req = controller.expectOne(`${baseURL}/logout`)
      req.flush({})
      expect(spy).toHaveBeenCalledWith(deleteUserInfo())
    })

    it("should remove user info from store on error", () => {
      const spy = spyOn(store, "dispatch")
      service.signOut().subscribe({ error: () => {} })

      const req = controller.expectOne(`${baseURL}/logout`)
      req.flush("500", { status: 500, statusText: "Internal Server Error" })
      expect(spy).toHaveBeenCalledWith(deleteUserInfo())
    })
  })
})
