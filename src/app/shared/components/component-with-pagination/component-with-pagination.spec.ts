import { ComponentWithPagination } from "./component-with-pagination"
import { PageEvent } from "@angular/material/paginator"

describe("ComponentWithPagination", () => {
  let component: TestComponent

  beforeEach(() => {
    component = new TestComponent()
  })

  describe("updatePagination()", () => {
    it("should update component's pagination and call getAll()", () => {
      const events: PageEvent[] = [
        { pageIndex: 3, pageSize: 12, length: 345 },
        { pageIndex: 0, pageSize: 23, length: 123 },
        { pageIndex: 12, pageSize: 30, length: 1337 },
      ]

      for (const event of events) {
        component.updatePagination(event)

        const { pageIndex, pageSize, length } = event
        const { page, limit, total } = component.pagination
        expect(page).toBe(pageIndex)
        expect(limit).toBe(pageSize)
        expect(total).toBe(length)
      }
    })
  })
})

class TestComponent extends ComponentWithPagination {}
