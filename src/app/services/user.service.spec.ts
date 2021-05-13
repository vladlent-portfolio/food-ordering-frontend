import { TestBed } from "@angular/core/testing"

import { UserService } from "./user.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { User } from "../models/models"
import { environment } from "../../environments/environment"

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

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
    service = TestBed.inject(UserService)
    controller = TestBed.inject(HttpTestingController)
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
      // expect(request.headers.get("Content-Type")).toContain("application/json")
      expect(request.body).toEqual({ email: user.email, password })

      req.flush(user)
    })
  })

  describe("signUp()", () => {
    it("should send email and password and return User", () => {
      const password = "superpass123"

      service.signUp(user.email, password).subscribe(resp => expect(resp).toEqual(user))

      const req = controller.expectOne(`${baseURL}/signup`)
      const { request } = req

      expect(request.method).toBe("POST")
      // expect(request.headers.get("Content-Type")).toContain("application/json")
      expect(request.body).toEqual({ email: user.email, password })

      req.flush(user)
    })
  })

  describe("me()", () => {
    it("should return user info", () => {
      service.me().subscribe(resp => expect(resp).toEqual(user))

      const req = controller.expectOne(`${baseURL}/me`)
      expect(req.request.method).toBe("GET")

      req.flush(user)
    })
  })

  describe("signOut()", () => {
    it("should sign out the user", () => {
      service.signOut().subscribe()

      const req = controller.expectOne(`${baseURL}/logout`)
      expect(req.request.method).toBe("GET")

      req.flush({})
    })
  })
})
