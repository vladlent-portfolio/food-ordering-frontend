import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CustomersPageComponent } from "./customers.component"
import { MatTableModule } from "@angular/material/table"
import { UserService } from "../../../services/user.service"
import { User } from "../../../models/models"
import { of } from "rxjs"
import { MatIconModule } from "@angular/material/icon"
import { formatDate } from "@angular/common"

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

    userServiceSpy.getAll.and.returnValue(of(users))

    TestBed.configureTestingModule({
      imports: [MatTableModule, MatIconModule],
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
      fixture.detectChanges()
      expect(queryTable()).not.toBeNull()
    })

    it("should have a row for each user", () => {
      fixture.detectChanges()
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

  describe("getAll()", () => {
    it("should request all users and update components state", () => {
      component.getAll()
      expect(userServiceSpy.getAll).toHaveBeenCalledTimes(1)
      expect(component.users).toEqual(users)
    })
  })

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
})
