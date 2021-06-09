import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CustomersPageComponent } from "./customers.component"
import { MatTableModule } from "@angular/material/table"
import { UserService } from "../../../services/user.service"
import { Pagination, User } from "../../../models/models"
import { of } from "rxjs"
import { MatIconModule } from "@angular/material/icon"
import { formatDate } from "@angular/common"
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator"
import { By } from "@angular/platform-browser"
import { ComponentWithPagination } from "../../../shared/components/component-with-pagination/component-with-pagination"
import { PaginationDTO } from "../../../models/dtos"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"

function userFactory(): (email: string, is_admin: boolean) => User {
  let id = 0
  return (email: string, is_admin: boolean) => ({
    id: ++id,
    created_at: new Date().toISOString(),
    email,
    is_admin,
  })
}

const createUser = userFactory()
describe("CustomersComponent", () => {
  let component: CustomersPageComponent
  let fixture: ComponentFixture<CustomersPageComponent>
  let nativeEl: HTMLElement
  let userServiceSpy: jasmine.SpyObj<UserService>
  let users: User[]

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj("UserService", ["getAll"])

    users = [
      createUser("admin@mail.com", true),
      createUser("user@mail.com", false),
      createUser("user2@mail.com", false),
      createUser("user3@mail.com", false),
    ]

    userServiceSpy.getAll.and.returnValue(of({ users, pagination: {} } as any))

    TestBed.configureTestingModule({
      imports: [MatTableModule, MatIconModule, MatPaginatorModule, NoopAnimationsModule],
      declarations: [CustomersPageComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should call getAll() on init", () => {
    const getAll = spyOn(component, "getAll")
    component.ngOnInit()
    expect(getAll).toHaveBeenCalledTimes(1)
  })

  describe("users table", () => {
    it("should render a table of users", () => {
      detectChanges()
      expect(queryTable()).not.toBeNull()
    })

    it("should have a row for each user", () => {
      detectChanges()
      const rows = queryRows()
      expect(rows).not.toBeNull()
      expect(rows.length).toBe(users.length)

      rows.forEach((row, i) => {
        const user = users[i]

        expect(queryIDCell(row).textContent?.trim()).toBe(user.id.toString())
        expect(queryEmailCell(row).textContent?.trim()).toBe(user.email)

        const date = queryDateCell(row).textContent?.trim()
        expect(date).toBe(
          formatDate(user.created_at, "medium", "en"),
          "expected cell to have formatted date",
        )

        const icon = queryRoleCell(row).querySelector("mat-icon")?.textContent?.trim()
        expect(icon).toBe(
          user.is_admin ? "check" : "clear",
          "expected cell to have appropriate icon",
        )
      })
    })
  })

  describe("pagination", () => {
    let paginator: MatPaginator

    beforeEach(() => {
      paginator = queryPaginator()
    })

    it("should exist", () => {
      expect(paginator).not.toBeNull()
    })

    it("should have first and last buttons", () => {
      expect(paginator.showFirstLastButtons).toBeTrue()
    })

    it("should change current page", () => {
      detectChanges()
      expect(paginator.pageIndex).toBe(component.pagination.page)
      const pages = [1, 2, 5, 7, 69]
      for (const page of pages) {
        component.pagination.page = page
        detectChanges()
        expect(paginator.pageIndex).toBe(component.pagination.page)
      }
    })

    it("should change current limit", () => {
      detectChanges()
      expect(paginator.pageSize).toBe(component.pagination.limit)
      const limits = [10, 25, 50, 75, 100, 200]
      for (const limit of limits) {
        component.pagination.limit = limit
        detectChanges()
        expect(paginator.pageSize).toBe(limit)
      }
    })

    it("should change current amount of rows", () => {
      detectChanges()
      expect(paginator.length).toBe(component.pagination.total)
      const totals = [10, 32, 43, 123, 3456, 687967]
      for (const total of totals) {
        component.pagination.total = total
        detectChanges()
        expect(paginator.length).toBe(total)
      }
    })

    it("should bind limitOptions", () => {
      detectChanges()
      expect(paginator.pageSizeOptions).toEqual(component.pagination.limitOptions)
      const options = [
        [1, 2, 3, 5],
        [23, 45, 787, 12],
        [34, 67, 8],
        [10, 100, 1000],
      ]

      for (const option of options) {
        component.pagination.limitOptions = option
        detectChanges()
        expect(paginator.pageSizeOptions).toEqual(component.pagination.limitOptions)
      }
    })

    it("should call updatePagination()", () => {
      const spy = spyOn(component, "updatePagination")
      const events: PageEvent[] = [
        { pageIndex: 3, pageSize: 12, length: 345 },
        { pageIndex: 0, pageSize: 23, length: 123 },
        { pageIndex: 12, pageSize: 30, length: 1337 },
      ]

      for (const event of events) {
        paginator.page.emit(event)
        expect(spy).toHaveBeenCalledWith(event)
      }
    })
  })

  describe("getAll()", () => {
    it("should request all users and update components state", () => {
      component.getAll()
      expect(userServiceSpy.getAll).toHaveBeenCalledTimes(1)
      expect(component.users).toEqual(users)
    })

    it("should update pagination options on response", () => {
      const dtos: PaginationDTO[] = [
        { page: 3, limit: 12, total: 345 },
        { page: 0, limit: 23, total: 123 },
        { page: 12, limit: 30, total: 1337 },
      ]
      const { limitOptions: oldLimitOptions } = component.pagination

      for (const dto of dtos) {
        userServiceSpy.getAll.and.returnValue(of({ users, pagination: dto }))
        component.getAll()
        const { page, limit, total, limitOptions } = component.pagination
        expect(page).toEqual(dto.page)
        expect(limit).toEqual(dto.limit)
        expect(total).toEqual(dto.total)
        expect(limitOptions).toEqual(oldLimitOptions)
      }
    })

    it("should call service's getAll() with Pagination from component", () => {
      const paginations: Pagination[] = [
        { page: 3, limit: 12 },
        { page: 0, limit: 23 },
        { page: 12, limit: 30 },
      ]

      for (const pagination of paginations) {
        component.pagination = { ...component.pagination, ...pagination }
        component.getAll()
        expect(userServiceSpy.getAll).toHaveBeenCalledWith(pagination)
      }
    })
  })

  describe("updatePagination()", () => {
    it("should call super's updatePagination and getAll()", () => {
      const getAll = spyOn(component, "getAll")
      const updatePagination = spyOn(
        ComponentWithPagination.prototype,
        "updatePagination",
      )
      const events: PageEvent[] = [
        { pageIndex: 3, pageSize: 12, length: 345 },
        { pageIndex: 0, pageSize: 23, length: 123 },
        { pageIndex: 12, pageSize: 30, length: 1337 },
      ]

      for (const event of events) {
        component.updatePagination(event)
        expect(updatePagination).toHaveBeenCalledWith(event)
      }

      expect(getAll).toHaveBeenCalledTimes(events.length)
    })
  })

  function detectChanges() {
    fixture.detectChanges()
    component.cdRef.detectChanges()
  }

  function queryTable() {
    return nativeEl.querySelector("[data-test='users-table']") as HTMLElement
  }

  // function queryHeader() {
  //   return nativeEl.querySelector("[data-test='users-table-header']") as HTMLElement
  // }

  function queryIDCell(row: HTMLElement) {
    return row.querySelector("[data-test='users-table-id']") as HTMLElement
  }

  function queryEmailCell(row: HTMLElement) {
    return row.querySelector("[data-test='users-table-email']") as HTMLElement
  }

  function queryDateCell(row: HTMLElement) {
    return row.querySelector("[data-test='users-table-date']") as HTMLElement
  }

  function queryRoleCell(row: HTMLElement) {
    return row.querySelector("[data-test='users-table-role']") as HTMLElement
  }

  function queryRows(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='users-table-row']")
  }

  function queryPaginator(): MatPaginator {
    return fixture.debugElement.query(By.directive(MatPaginator)).componentInstance
  }
})
