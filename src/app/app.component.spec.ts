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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatToolbarModule } from "@angular/material/toolbar"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { replaceCart, setIsSmallScreen } from "./store/actions"
import { User } from "./models/models"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { UserService } from "./services/user.service"
import { NgLetModule } from "@ngrx-utils/store"
import { MatIconModule } from "@angular/material/icon"
import { Router } from "@angular/router"
import { Component } from "@angular/core"
import { of } from "rxjs"
import { MatBadgeModule } from "@angular/material/badge"
import { CartDialogComponent } from "./components/dialogs/cart/cart.component"
import { BreakpointObserver } from "@angular/cdk/layout"

describe("AppComponent", () => {
  let dialogSpy: jasmine.SpyObj<MatDialog>
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent
  let nativeEl: HTMLElement
  let userServiceSpy: jasmine.SpyObj<UserService>
  let user: User
  let router: Router
  let store: MockStore
  let bpSpy: jasmine.SpyObj<BreakpointObserver>

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj("MatDialog", ["open"])
    userServiceSpy = jasmine.createSpyObj("UserService", ["me", "signOut"])
    bpSpy = jasmine.createSpyObj("BreakpointObserver", ["observe"])

    userServiceSpy.me.and.returnValue(of(user))
    bpSpy.observe.and.returnValue(of({ matches: false, breakpoints: {} }))

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "admin", component: TestComponent },
          { path: "about", component: TestComponent },
        ]),
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatDialogModule,
        NgLetModule,
        NoopAnimationsModule,
        MatIconModule,
        MatBadgeModule,
      ],
      declarations: [AppComponent, LoginDialogComponent, TestComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: BreakpointObserver, useValue: bpSpy },
        provideMockStore({ initialState: { cart: {} } }),
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
    localStorage.clear()
  })

  xit("should toggle loading spinner based on app state", fakeAsync(() => {
    expect(querySpinner()).toBeNull()

    store.setState({ openRequests: 1, cart: {} })
    // None of the functions below seems to be working with asap or async schedulers
    // so this test case doesn't work no matter what.
    fixture.detectChanges()
    flushMicrotasks()
    flush()
    tick()
    fixture.detectChanges()
    expect(querySpinner()).not.toBeNull()

    store.setState({ openRequests: 0, cart: {} })

    fixture.detectChanges()
    expect(querySpinner()).toBeNull()
  }))

  it("should check if user is already authorized on init", () => {
    component.ngOnInit()
    expect(userServiceSpy.me).toHaveBeenCalledTimes(1)
  })

  it("should call restoreCart on init", () => {
    const restoreCart = spyOn(component, "restoreCart")
    component.ngOnInit()
    expect(restoreCart).toHaveBeenCalledTimes(1)
  })

  it("should call setupObserver on init", () => {
    const setupObserver = spyOn(component, "setupObserver")
    component.ngOnInit()
    expect(setupObserver).toHaveBeenCalledTimes(1)
  })

  it("should call observeScreenSize on init", () => {
    const observeScreenSize = spyOn(component, "observeScreenSize")
    component.ngOnInit()
    expect(observeScreenSize).toHaveBeenCalledTimes(1)
  })

  it("should show login btn  if user is not logged in", () => {
    store.setState({ user: null, openRequests: 0, cart: {} })
    fixture.detectChanges()
    expect(queryLogInBtn()).not.toBeNull()
  })

  it("should hide logout btn if user is not logged in", () => {
    store.setState({ user: null, openRequests: 0, cart: {} })
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

  describe("sign in button", () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it("should exist", () => {
      const btn = queryLogInBtn()
      expect(btn).not.toBeNull()
      expect(btn.getAttribute("aria-label")).toBe(
        "Sign In",
        "expected sign in button to have valid aria-label",
      )
    })

    it("should open login dialog", () => {
      queryLogInBtn().click()
      expect(dialogSpy.open).toHaveBeenCalled()
    })
  })

  describe("home link", () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it("should exist", async () => {
      const when = (condition: string) => `expected to find a home link if ${condition}`
      expect(queryHomeLink()).not.toBeNull(when("user isn't authorized"))
      expect(queryHomeLink().getAttribute("href")).toBe("/")
      loginAsUser()
      expect(queryHomeLink()).not.toBeNull(when("user is authorized"))
      expect(queryHomeLink().getAttribute("href")).toBe("/")
      loginAsAdmin()
      expect(queryHomeLink()).not.toBeNull(when("user is authorized as admin"))
      expect(queryHomeLink().getAttribute("href")).toBe("/")
      await navigateToAdmin()
      expect(queryHomeLink()).not.toBeNull(when("user is at admin dashboard route"))
      expect(queryHomeLink().getAttribute("href")).toBe("/")
    })

    it("should contain title element", () => {
      expect(queryHomeLink().contains(queryTitle())).toBeTrue()
    })
  })

  describe("title", () => {
    it("should be set", () => {
      fixture.detectChanges()
      expect(queryTitle().textContent?.trim()).toBe(component.title)
    })
  })

  describe("shopping cart", () => {
    it("should be visible if user isn't logged in", () => {
      fixture.detectChanges()
      expect(queryCart()).not.toBeNull()
    })

    it("should be visible if user is logged in", () => {
      loginAsUser()
      expect(queryCart()).not.toBeNull()
      expect(queryCart().getAttribute("aria-label")).toBe("Open shopping cart")
    })

    it("should be visible if user is admin", () => {
      loginAsAdmin()
      expect(queryCart()).not.toBeNull()
      expect(queryCart().getAttribute("aria-label")).toBe("Open shopping cart")
    })

    it("should be hidden on dashboard", async () => {
      fixture.detectChanges()
      await navigateToAdmin()
      expect(queryCart()).toBeNull()
    })

    describe("open cart", () => {
      it("should open cart dialog on click", () => {
        fixture.detectChanges()
        queryCart().click()
        expect(dialogSpy.open).toHaveBeenCalledOnceWith(CartDialogComponent, {
          minWidth: undefined,
        })
      })

      it("should open cart with updated minWidth on small screen", () => {
        store.setState({ cart: {}, isSmallScreen: true })
        fixture.detectChanges()
        queryCart().click()
        expect(dialogSpy.open).toHaveBeenCalledOnceWith(CartDialogComponent, {
          minWidth: "95vw",
        })
      })
    })

    describe("total quantity badge", () => {
      it("should have a badge with the total quantity of all items in the cart", () => {
        store.setState({ cart: { 1: { quantity: 2 }, 2: { quantity: 4 } } })
        fixture.detectChanges()
        const badge = queryCartBadge()
        expect(badge).not.toBeNull()
        expect(badge.textContent?.trim()).toBe("6")

        store.setState({
          cart: { 1: { quantity: 2 }, 2: { quantity: 4 }, 5: { quantity: 10 } },
        })
        fixture.detectChanges()
        expect(badge.textContent?.trim()).toBe("16")
      })

      it("should be hidden if cart is empty", () => {
        store.setState({ cart: {} })
        fixture.detectChanges()
        expect(queryCart().classList.contains("mat-badge-hidden")).toBeTrue()
      })
    })
  })

  describe("navigation", () => {
    it("should have active link if route matches", async () => {
      await loginAsAdmin()
      const links = document.querySelectorAll(".nav__link") as NodeListOf<
        HTMLAnchorElement
      >

      for (const link of links) {
        await router.navigateByUrl(new URL(link.href).pathname)
        fixture.detectChanges()
        expect(link.classList.contains("nav__link--active")).toBeTrue()

        for (const l of links) {
          if (l != link) {
            expect(l.classList.contains("nav__link--active")).toBeFalse()
          }
        }
      }
    })

    describe("Dashboard button", () => {
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
        expect(btn.textContent).toMatch(/dashboard/i)
      })
    })

    describe("Home button", () => {
      it("should be visible if current route includes '/admin'", async () => {
        loginAsAdmin()
        await navigateToAdmin()
        const btn = queryAppBtn()
        expect(btn).not.toBeNull()
        expect(btn.href).toBe(location.origin + "/")
        expect(btn.textContent).toMatch(/home/i)
      })
    })
  })

  describe("logout", () => {
    it("should exist", () => {
      loginAsUser()
      const btn = queryLogOutBtn()
      expect(btn).not.toBeNull()
      expect(btn.getAttribute("aria-label")).toBe(
        "Sign Out",
        "expected sign out button to have valid aria-label",
      )
    })

    it("should call signOut when clicked on logout btn", () => {
      userServiceSpy.signOut.and.returnValue(of())
      loginAsUser()
      queryLogOutBtn().click()
      expect(userServiceSpy.signOut).toHaveBeenCalledTimes(1)
    })

    it("should redirect to the app if user is on admin page", async () => {
      userServiceSpy.signOut.and.returnValue(of())
      loginAsAdmin()
      await navigateToAdmin()
      queryLogOutBtn().click()
      await fixture.whenStable()
      expect(router.url).toBe("/")
    })
  })

  describe("footer", () => {
    it("should have a 'made by' block", () => {
      const el = queryMadeBy()
      expect(el).not.toBeNull("expected footer to have a made by block")
      expect(el.textContent).toContain(
        "Vladlen Tereshchenko",
        "expected made by block to contain authors name",
      )
    })

    it("should have social links block", () => {
      const socials = querySocials()
      expect(socials).not.toBeNull()

      const links = [
        {
          selector: '[data-test="footer-author-email-link"]',
          failMsg: "expected footer to have a link to author's Email",
          href: "mailto:vladlent.dev@gmail.com",
          label: "Gmail",
        },
        {
          selector: "[data-test='footer-author-github-link']",
          failMsg: "expected footer to have a link to author's GitHub",
          href: "https://github.com/vladlent",
          label: "GitHub",
        },
        {
          selector: "[data-test='footer-author-linkedin-link']",
          failMsg: "expected footer to have a link to author's LinkedIn",
          href: "https://linkedin.com/in/vladlent",
          label: "LinkedIn",
        },
        {
          selector: "[data-test='footer-author-hackerrank-link']",
          failMsg: "expected footer to have a link to author's HackerRank",
          href: "https://hackerrank.com/vladlent",
          label: "HackerRank",
        },
      ]

      for (const link of links) {
        const github = socials.querySelector(link.selector) as HTMLAnchorElement
        expect(github).not.toBeNull(link.failMsg)
        expect(github.href).toBe(link.href)
        expect(github.target).toBe("_blank")
        expect(github.textContent).toContain(link.label)
      }
    })

    it("should have 'project repositories' block", () => {
      const repos = nativeEl.querySelector("[data-test='footer-repositories']")
      expect(repos).not.toBeNull()

      const title = repos?.querySelector("[data-test='footer-repositories-title']")
      expect(title).not.toBeNull()
      expect(title?.textContent).toContain("Project Repositories")

      const frontLink = repos?.querySelector(
        "[data-test='footer-repositories-frontend']",
      ) as HTMLAnchorElement
      expect(frontLink).not.toBeNull()
      expect(frontLink.href).toBe(
        "https://github.com/vladlent-portfolio/food-ordering-frontend",
      )
      expect(frontLink.target).toBe("_blank")
      expect(frontLink.textContent).toContain("FrontEnd")

      const backLink = repos?.querySelector(
        "[data-test='footer-repositories-backend']",
      ) as HTMLAnchorElement
      expect(backLink).not.toBeNull()
      expect(backLink.href).toBe(
        "https://github.com/vladlent-portfolio/food-ordering-backend",
      )
      expect(backLink.target).toBe("_blank")
      expect(backLink.textContent).toContain("BackEnd")
    })

    it("should have attribution block", () => {
      const attrib = nativeEl.querySelector("[data-test='footer-attribution']")
      expect(attrib).not.toBeNull()
    })
  })

  describe("scroll to top button", () => {
    let btn: HTMLElement

    beforeEach(() => {
      component.hideGoTopBtn = false
      fixture.detectChanges()
      btn = queryUpBtn()
    })

    it("should exist", () => {
      expect(btn).not.toBeNull()
      expect(btn.getAttribute("aria-label")).toBe("Scroll to top")
    })

    it("should call 'scrollTop'", () => {
      const scrollTop = spyOn(component, "scrollTop")
      btn.click()
      expect(scrollTop).toHaveBeenCalledTimes(1)
    })

    it("should be hidden if hideTopBtn set to true", () => {
      component.hideGoTopBtn = true
      fixture.detectChanges()
      expect(queryUpBtn()).toBeNull()
    })
  })

  describe("observeScreenSize()", () => {
    it("should dispatch action when screen size changes", () => {
      const dispatch = spyOn(store, "dispatch")

      bpSpy.observe.and.returnValues(
        of({ matches: true, breakpoints: {} }, { matches: false, breakpoints: {} }),
      )

      fixture.detectChanges()

      expect(dispatch).toHaveBeenCalledWith(setIsSmallScreen({ isSmallScreen: true }))
      expect(dispatch).toHaveBeenCalledWith(setIsSmallScreen({ isSmallScreen: false }))
    })
  })

  describe("restoreCart()", () => {
    it("should replace the cart in store if local storage isn't empty", () => {
      const dispatch = spyOn(store, "dispatch")
      const cart = { 1: { quantity: 2 }, 2: { quantity: 4 } } as any
      localStorage.setItem("cart", JSON.stringify(cart))

      component.restoreCart()
      expect(dispatch).toHaveBeenCalledWith(replaceCart({ cart }))
    })

    it("should call replace cart if local storage is empty", () => {
      const dispatch = spyOn(store, "dispatch")
      localStorage.clear()
      component.restoreCart()
      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  describe("saveCart()", () => {
    it("should save user cart locally before page refresh/close", () => {
      const cart = { 1: { quantity: 2 }, 2: { quantity: 4 } }
      store.setState({ cart })

      component.saveCart()

      const stored = localStorage.getItem("cart") as string
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored)).toEqual(cart)
    })
  })

  describe("setupObserver()", () => {
    it("should assign observer to goTopBtnObserver", () => {
      component.setupObserver()
      const observer = component.goTopBtnObserver
      expect(observer).toBeInstanceOf(IntersectionObserver)
    })

    it("should set hideGoTopBtn to false", (done: DoneFn) => {
      component.setupObserver()
      expect(component.hideGoTopBtn).toBeTrue()
      document.body.style.height = "1000px"
      window.scrollTo({ top: 500 })
      setTimeout(() => {
        expect(component.hideGoTopBtn).toBeFalse()
        done()
      }, 100)
    })
  })

  describe("scrollTop()", () => {
    it("should scroll window to top", () => {
      const scrollTo = spyOn(window, "scrollTo")
      component.scrollTop()
      // @ts-ignore
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
    })
  })

  function loginAsUser() {
    user.is_admin = false
    store.setState({ user, openRequests: 0, cart: {} })
    fixture.detectChanges()
  }

  function loginAsAdmin() {
    user.is_admin = true
    store.setState({ user, openRequests: 0, cart: {} })
    fixture.detectChanges()
  }

  async function navigateToAdmin() {
    await router.navigateByUrl("/admin")
    fixture.detectChanges()
  }

  function querySpinner() {
    return nativeEl.querySelector("#loading-spinner")
  }

  function queryHomeLink() {
    return nativeEl.querySelector("[data-test='home-link']") as HTMLAnchorElement
  }

  function queryTitle() {
    return nativeEl.querySelector("[data-test='title']") as HTMLElement
  }

  function queryCart() {
    return nativeEl.querySelector("[data-test='cart']") as HTMLElement
  }

  function queryCartBadge() {
    return queryCart().querySelector(".mat-badge-active") as HTMLElement
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

  function queryMadeBy() {
    return nativeEl.querySelector("[data-test='footer-made-by']") as HTMLElement
  }

  function querySocials() {
    return nativeEl.querySelector("[data-test='footer-socials']") as HTMLElement
  }

  function queryUpBtn() {
    return nativeEl.querySelector("[data-test='up-btn']") as HTMLElement
  }
})

@Component({
  template: "",
})
class TestComponent {}
