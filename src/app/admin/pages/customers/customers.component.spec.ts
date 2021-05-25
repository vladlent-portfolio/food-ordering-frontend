import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CustomersPageComponent } from "./customers.component"
import { MatTableModule } from "@angular/material/table"
import { UserService } from "../../../services/user.service"
import { User } from "../../../models/models"
import { of } from "rxjs"

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
      imports: [MatTableModule],
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

        for (const value of Object.values(user)) {
          expect(row.textContent).toContain(value)
        }
      })
    })

    it("should have a column for each user's property", () => {
      fixture.detectChanges()
      const propsCount = Object.keys(users[0]).length

      expect(queryHeaderCells().length).toBe(propsCount)
      expect(queryCells().length).toBe(propsCount * users.length)
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

  function queryHeaderCells() {
    return nativeEl.querySelectorAll("[data-test='users-table-header-cell']")
  }

  function queryRows() {
    return nativeEl.querySelectorAll("[data-test='users-table-row']")
  }

  function queryCells() {
    return nativeEl.querySelectorAll("[data-test='users-table-cell']")
  }
})
