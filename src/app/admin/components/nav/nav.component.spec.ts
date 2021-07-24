import { ComponentFixture, TestBed } from "@angular/core/testing"

import { AdminNavComponent } from "./nav.component"
import { MatListModule } from "@angular/material/list"
import { RouterTestingModule } from "@angular/router/testing"
import { Component } from "@angular/core"
import { By } from "@angular/platform-browser"
import { MatIconModule } from "@angular/material/icon"

describe("NavComponent", () => {
  let component: AdminNavComponent
  let hostComponent: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatListModule, MatIconModule],
      declarations: [AdminNavComponent, TestHostComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(By.directive(AdminNavComponent))
      .componentInstance
    nativeEl = fixture.nativeElement
    fixture.detectChanges()
  })

  describe("not mobile", () => {
    beforeEach(() => {
      hostComponent.mobile = false
      fixture.detectChanges()
    })

    it("should render desktop nav list", () => {
      expect(queryDesktopNavList()).not.toBeNull()
      expect(queryMobileNavList()).toBeNull()
    })

    it("should render navigation links from routing pages", () => {
      const links = Array.from(nativeEl.querySelectorAll("a"))
      const pages = component.links
      expect(links).toHaveSize(pages.length)

      links.forEach(a => {
        const page = pages.find(page => a.href.includes(page.path as string))
        expect(page).toBeDefined(`expected ${a.href} to contain some actual path`)

        if (page) {
          expect(a.textContent).toContain(
            page.data.title,
            "expected link to contain proper page title",
          )
        }
      })
    })
  })

  describe("on mobile", () => {
    beforeEach(() => {
      hostComponent.mobile = true
      fixture.detectChanges()
    })

    it("should render mobile nav list", () => {
      expect(queryDesktopNavList()).toBeNull()
      expect(queryMobileNavList()).not.toBeNull()
    })

    it("should have a link with icon for each page", () => {
      const links = Array.from(nativeEl.querySelectorAll("a"))
      const pages = component.links
      expect(links).toHaveSize(pages.length)

      links.forEach(a => {
        const page = pages.find(page => a.href.includes(page.path as string))
        expect(page).toBeDefined(`expected ${a.href} to contain some actual path`)

        if (page) {
          expect(a.textContent).toContain(
            page.data.title,
            "expected link to contain proper page title",
          )

          const icon = a.querySelector("mat-icon")
          expect(icon).not.toBeNull("expected mobile link to have an icon")
          expect(icon?.textContent).toContain(page.data.icon)
        }
      })
    })
  })

  function queryDesktopNavList() {
    return nativeEl.querySelector("[data-test='desktop-nav-list']") as HTMLElement
  }

  function queryMobileNavList() {
    return nativeEl.querySelector("[data-test='mobile-nav-list']") as HTMLElement
  }
})

@Component({
  template: "<app-admin-nav [mobile]='mobile'></app-admin-nav>",
})
class TestHostComponent {
  mobile = false
}
