import { TestBed } from "@angular/core/testing"

import { OrderService } from "./order.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { environment } from "../../environments/environment"
import { OrderStatuses } from "../models/models"

const getURL = (param?: number | string) => {
  const baseURL = `${environment.apiURL}/orders`
  return param ? `${baseURL}/${param}` : baseURL
}

describe("OrderService", () => {
  let service: OrderService
  let httpController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })

    service = TestBed.inject(OrderService)
    httpController = TestBed.inject(HttpTestingController)
  })

  describe("getAll()", () => {
    it("should get orders", () => {
      const expected = ["burger", "pizza"] as any
      service.getAll().subscribe(resp => expect(resp).toEqual(expected))

      const req = httpController.expectOne(getURL())
      const { request } = req

      expect(request.method).toBe("GET")
      expect(request.withCredentials).toBeTrue()

      req.flush(expected)
    })
  })

  describe("create()", () => {
    it("should create order", () => {
      const expected = ["burger", "pizza"] as any
      const dishes = [
        { id: 3, quantity: 2 },
        { id: 1, quantity: 1 },
      ]

      service.create(dishes).subscribe(resp => expect(resp).toEqual(expected))

      const req = httpController.expectOne(getURL())
      const { request } = req

      expect(request.method).toBe("POST")
      expect(request.withCredentials).toBeTrue()
      expect(request.body).toEqual({ items: dishes })

      req.flush(expected)
    })
  })

  describe("changeStatus()", () => {
    it("should cancel the order", () => {
      const id = 1

      for (const status of OrderStatuses) {
        service.changeStatus(id, status).subscribe()
      }

      const reqs = httpController.match(req => req.url === getURL(id))

      reqs.forEach((req, i) => {
        const { request } = req

        expect(request.method).toBe("PATCH")
        expect(request.params.get("status")).toBe(OrderStatuses[i] as any)
        expect(request.withCredentials).toBeTrue()
        expect(request.body).toBeNull()
        req.flush(null)
      })
    })
  })
})
