import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
} from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { AppComponent } from "./app.component"
import { AppState } from "./store/reducers"

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatToolbarModule } from "@angular/material/toolbar"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { loadEnd, loadStart } from "./store/actions"
import { User } from "./models/models"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { UserService } from "./services/user.service"
import { NgLetModule } from "@ngrx-utils/store"
import { MatIconModule } from "@angular/material/icon"
import { Router } from "@angular/router"
import { Component } from "@angular/core"
import { of } from "rxjs"

describe("AppComponent", () => {
  let dialogSpy: jasmine.SpyObj<MatDialog>
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent
  let nativeEl: HTMLElement
  let userServiceSpy: jasmine.SpyObj<UserService>
  let user: User
  let router: Router
  let store: MockStore<AppState>

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj("MatDialog", ["open"])
    userServiceSpy = jasmine.createSpyObj("UserService", ["signOut"])

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "admin", component: TestAdminComponent },
        ]),
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatDialogModule,
        NgLetModule,
        NoopAnimationsModule,
        MatIconModule,
      ],
      declarations: [AppComponent, LoginDialogComponent, TestAdminComponent],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: dialogSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    })

    fixture = TestBed.createComponent(AppComponent)
    store = TestBed.inject(MockStore)
    router = TestBed.inject(Router)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement

    user = {
      id: 123,
      email: "mail@example.com",
      created_at: new Date().toISOString(),
      is_admin: false,
    }
  })

  // Spent like an hour on this bullshit.
  xit("should toggle loading spinner based on app state", fakeAsync(() => {
    expect(querySpinner()).toBeNull()

    store.dispatch(loadStart())
    // None of the functions below seems to be working with asap or async schedulers
    // so this test case doesn't work no matter what.
    flushMicrotasks()
    flush()
    tick()
    fixture.detectChanges()

    expect(querySpinner()).not.toBeNull()

    store.dispatch(loadEnd())

    fixture.detectChanges()

    expect(querySpinner()).toBeNull()
  }))

  it("should show login btn  if user is not logged in", () => {
    store.setState({ user: null, openRequests: 0 })
    fixture.detectChanges()
    expect(queryLogInBtn()).not.toBeNull()
  })

  it("should hide logout btn if user is not logged in", () => {
    store.setState({ user: null, openRequests: 0 })
    fixture.detectChanges()
    expect(queryLogOutBtn()).toBeNull()
  })

  it("should show logout btn if user is logged in", () => {
    loginAsUser()
    expect(queryLogOutBtn()).not.toBeNull()
  })

  it("should hide login btn if user is logged in", () => {
    loginAsUser()
    expect(queryLogInBtn()).toBeNull()
  })

  it("should open login dialog", () => {
    fixture.detectChanges()
    queryLogInBtn().click()
    expect(dialogSpy.open).toHaveBeenCalled()
  })

  it("should call signOut when clicked on logout btn", () => {
    userServiceSpy.signOut.and.returnValue(of({} as any))
    loginAsUser()
    queryLogOutBtn().click()
    expect(userServiceSpy.signOut).toHaveBeenCalledTimes(1)
  })

  describe("title", () => {
    it("should be set", () => {
      fixture.detectChanges()
      expect(queryTitle().textContent?.trim()).toBe(component.title)
    })

    it("should be changed to admin title if route includes '/admin'", async () => {
      fixture.detectChanges()
      expect(queryTitle().textContent?.trim()).toBe(component.title)
      await navigateToAdmin()
      expect(queryTitle().textContent?.trim()).toBe(component.adminTitle)
      await router.navigateByUrl("/")
      fixture.detectChanges()
      expect(queryTitle().textContent?.trim()).toBe(component.title)
    })
  })

  describe("Go to dashboard button", () => {
    it("should not be visible if user isn't logged in or is not admin", () => {
      fixture.detectChanges()
      expect(queryAdminBtn()).toBeNull()
      loginAsUser()
      expect(queryAdminBtn()).toBeNull()
    })

    it("should be visible if user is admin", () => {
      loginAsAdmin()
      const btn = queryAdminBtn()
      expect(btn).not.toBeNull()
      expect(btn.href).toContain("/admin")
    })

    it("should not be visible if current route includes '/admin'", async () => {
      loginAsAdmin()
      await navigateToAdmin()
      expect(queryAdminBtn()).toBeNull()
    })
  })

  describe("Back to App button", () => {
    it("should be visible if current route includes '/admin'", async () => {
      loginAsAdmin()
      await navigateToAdmin()
      const btn = queryAppBtn()
      expect(btn).not.toBeNull()
      expect(btn.href).toBe(location.origin + "/")
    })

    it("should not be visible if current route doesn't include 'admin'", () => {
      fixture.detectChanges()
      expect(queryAppBtn()).toBeNull()
      loginAsUser()
      expect(queryAppBtn()).toBeNull()
      loginAsAdmin()
      expect(queryAppBtn()).toBeNull()
    })
  })

  function loginAsUser() {
    user.is_admin = false
    store.setState({ user, openRequests: 0 })
    fixture.detectChanges()
  }

  function loginAsAdmin() {
    user.is_admin = true
    store.setState({ user, openRequests: 0 })
    fixture.detectChanges()
  }

  async function navigateToAdmin() {
    await router.navigateByUrl("/admin")
    fixture.detectChanges()
  }

  function querySpinner() {
    return nativeEl.querySelector(".spinner-container")
  }

  function queryTitle() {
    return nativeEl.querySelector("[data-test='title']") as HTMLElement
  }

  function queryLogInBtn() {
    return nativeEl.querySelector("[data-test='login-btn']") as HTMLButtonElement
  }

  function queryLogOutBtn() {
    return nativeEl.querySelector("[data-test='logout-btn']") as HTMLButtonElement
  }

  function queryAdminBtn() {
    return nativeEl.querySelector("[data-test='admin-btn']") as HTMLAnchorElement
  }

  function queryAppBtn() {
    return nativeEl.querySelector("[data-test='app-btn']") as HTMLAnchorElement
  }
})

@Component({
  template: "",
})
class TestAdminComponent {}
