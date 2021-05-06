import { TestBed } from "@angular/core/testing"

import { CategoryService } from "./category.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { Category } from "../models/models"
import { environment } from "../../environments/environment"

let testCategories: Category[]

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

      const req = httpController.expectOne(`${environment.apiURL}/categories`)
      expect(req.request.method).toBe("GET")
      req.flush(testCategories)
    })
  })
})
