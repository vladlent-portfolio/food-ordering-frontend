import { ComponentFixture, TestBed } from "@angular/core/testing"

import { AdminNavComponent } from "./nav.component"
import { MatListModule } from "@angular/material/list"
import { RouterTestingModule } from "@angular/router/testing"

describe("NavComponent", () => {
  let component: AdminNavComponent
  let fixture: ComponentFixture<AdminNavComponent>
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatListModule],
      declarations: [AdminNavComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    fixture.detectChanges()
  })

  it("should render navigation links from routing pages", async () => {
    fixture.detectChanges()
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
