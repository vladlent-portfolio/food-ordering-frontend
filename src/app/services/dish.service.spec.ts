import { TestBed } from "@angular/core/testing"

import { DishService } from "./dish.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { environment } from "../../environments/environment"
import { Dish } from "../models/models"
import { DishCreateDTO } from "../models/dtos"

const getURL = (param?: number | string) => {
  const baseURL = `${environment.apiURL}/dishes`
  return param ? `${baseURL}/${param}` : baseURL
}

describe("DishService", () => {
  let service: DishService
  let httpController: HttpTestingController
  let dishes: Dish[]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(DishService)
    httpController = TestBed.inject(HttpTestingController)

    dishes = [
      {
        id: 2,
        title: "Crunchy Cashew Salad",
        price: 3.22,
        image: "/dishes/2.png",
        removable: true,
        category_id: 1,
        category: {
          id: 1,
          title: "Salads",
          removable: false,
          image: "/categories/1.png",
        },
      },
      {
        id: 1,
        title: "Margherita",
        price: 4.2,
        image: "/dishes/1.png",
        removable: false,
        category_id: 3,
        category: {
          id: 3,
          title: "Pizza",
          removable: true,
          image: "/categories/3.jpg",
        },
      },
    ]
  })

  afterEach(() => {
    httpController.verify()
  })

  describe("getAll()", () => {
    it("should request all dishes", () => {
      service.getAll().subscribe(res => expect(res).toEqual(dishes))

      const req = httpController.expectOne(getURL())
      expect(req.request.method).toBe("GET")

      req.flush(dishes)
    })

    it("should add cid query if category id is provided", () => {
      const cid = 3
      const expected = dishes.slice(1)
      service.getAll(cid).subscribe(res => expect(res).toEqual(expected))

      const req = httpController.match(r => r.url === getURL())[0]
      const { request } = req

      expect(request.method).toBe("GET")
      expect(request.params.get("cid")).toBe(cid.toString())

      req.flush(expected)
    })
  })

  describe("create()", () => {
    it("should create dish and return it", () => {
      const expected = dishes[0]
      const dto: DishCreateDTO = {
        title: "4 Cheese",
        price: 4.69,
        category_id: 3,
      }
      service.create(dto).subscribe(res => expect(res).toEqual(expected))

      const req = httpController.expectOne(getURL())
      const { request } = req

      expect(request.method).toBe("POST")
      expect(request.body).toEqual({ ...dto, removable: true })
      expect(request.withCredentials).toBeTrue()

      req.flush(expected)
    })
  })

  describe("update()", () => {
    it("should update dish and return it", () => {
      const dish = dishes[0]
      service.update(dish).subscribe(res => expect(res).toEqual(dish))

      const req = httpController.expectOne(getURL(dish.id))
      const { request } = req

      expect(request.method).toBe("PUT")
      expect(request.body).toEqual(dish)
      expect(request.withCredentials).toBeTrue()

      req.flush(dish)
    })
  })

  describe("updateImage()", () => {
    it("should send image using form-data", () => {
      const id = 3
      const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
      const response = getURL("static/dishes/3.png")
      service.updateImage(id, image).subscribe(url => expect(url).toBe(response))

      const req = httpController.expectOne(getURL(id) + "/upload")
      const { request } = req
      expect(request.method).toBe("PATCH")
      expect(request.headers.get("Content-Type")).toBeNull()
      expect(request.responseType).toBe("text")
      expect(request.withCredentials).toBeTrue()

      expect(request.body instanceof FormData).toBeTrue()
      expect(request.body.get("image")).toEqual(image)

      req.flush(response)
    })
  })

  describe("remove()", () => {
    it("should delete dish", () => {
      const dish = dishes[0]
      service.remove(dish.id).subscribe(res => expect(res).toEqual(dish))

      const req = httpController.expectOne(getURL(dish.id))
      const { request } = req

      expect(request.method).toBe("DELETE")
      expect(request.withCredentials).toBeTrue()

      req.flush(dish)
    })
  })
})
