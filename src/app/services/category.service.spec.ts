import { TestBed } from "@angular/core/testing"
import { CategoryService } from "./category.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { Category } from "../models/models"
import { environment } from "../../environments/environment"

let testCategories: Category[]
const getURL = (param?: number | string) => {
  const baseURL = `${environment.apiURL}/categories`
  return param ? `${baseURL}/${param}` : baseURL
}

describe("CategoryService", () => {
  let service: CategoryService
  let httpController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
    service = TestBed.inject(CategoryService)
    httpController = TestBed.inject(HttpTestingController)

    testCategories = [
      { id: 1, image: "/images/1.png", removable: false, title: "Pizza" },
      { id: 2, image: "/images/2.png", removable: true, title: "Burgers" },
    ]
  })

  afterEach(() => {
    httpController.verify()
  })

  describe("getAll()", () => {
    it("should get an array of categories from API", () => {
      service.getAll().subscribe(categories => expect(categories).toEqual(testCategories))

      const req = httpController.expectOne(getURL())
      expect(req.request.method).toBe("GET")
      req.flush(testCategories)
    })
  })

  describe("create()", () => {
    it("should create category using provided title", () => {
      const title = "Sushi"
      const response: Category = {
        id: 1,
        title,
        removable: true,
      }
      service.create(title).subscribe(data => expect(data).toEqual(response))

      const req = httpController.expectOne(getURL())
      const { request } = req
      expect(request.method).toBe("POST")
      expect(request.withCredentials).toBeTrue()
      expect(request.body).toEqual(
        { title, removable: true },
        "expected new category to be removable",
      )
      req.flush(response)
    })
  })

  describe("updateImage()", () => {
    it("should send image using form-data", () => {
      const id = 3
      const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
      const response = getURL("static/categories/3.png")
      service.updateImage(id, image).subscribe(url => expect(url).toBe(response))

      const req = httpController.expectOne(getURL(id) + "/upload")
      const { request } = req
      expect(request.method).toBe("PATCH")
      expect(request.headers.get("Content-Type")).toBeNull()
      expect(request.withCredentials).toBeTrue()

      expect(request.body instanceof FormData).toBeTrue()
      expect(request.body.get("image")).toEqual(image)

      req.flush(response)
    })
  })

  describe("update()", () => {
    it("should update category", () => {
      const cat: Category = {
        id: 1337,
        removable: false,
        title: "Salads",
        image: "/some-image.jpeg",
      }
      service.update(cat).subscribe(res => expect(res).toEqual(cat))

      const req = httpController.expectOne(getURL(cat.id))
      const { request } = req

      expect(request.method).toBe("PUT")
      expect(request.withCredentials).toBeTrue()
      expect(request.body).toEqual(cat)

      req.flush(cat)
    })
  })

  describe("remove()", () => {
    it("should delete category", () => {
      const cat = testCategories[0]
      service.remove(1).subscribe(res => expect(res).toEqual(cat))

      const req = httpController.expectOne(getURL(1))
      const { request } = req

      expect(request.method).toBe("DELETE")
      expect(request.withCredentials).toBeTrue()

      req.flush(cat)
    })
  })
})
