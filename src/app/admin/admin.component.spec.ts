import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AdminPageComponent } from "./admin.component"
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { By } from "@angular/platform-browser"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { NgLetModule } from "@ngrx-utils/store"
import { RouterTestingModule } from "@angular/router/testing"
import { Component, Input } from "@angular/core"

describe("AdminComponent", () => {
  // let component: AdminPageComponent
  let fixture: ComponentFixture<AdminPageComponent>
  let nativeEl: HTMLElement
  let store: MockStore<any>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPageComponent, TestAdminNavComponent],
      imports: [MatSidenavModule, NoopAnimationsModule, NgLetModule, RouterTestingModule],
      providers: [provideMockStore()],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageComponent)
    store = TestBed.inject(MockStore)

    // component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  describe("sidenav", () => {
    it("should have mat-drawer be open by default", () => {
      fixture.detectChanges()
      expect(queryDrawer().opened).toBeTrue()
    })

    it("should show desktop-admin-nav", () => {
      fixture.detectChanges()
      expect(queryDesktopAdminNav()).not.toBeNull()
      expect(queryMobileAdminNav()).toBeNull()
      expect(queryAdminNavs().map(nav => nav.mobile)).toEqual([false])
    })
  })

  describe("small screen", () => {
    beforeEach(() => {
      store.setState({ isSmallScreen: true })
    })

    it("should mat-drawer closed on small screen", () => {
      fixture.detectChanges()
      expect(queryDrawer().opened).toBeFalse()
    })

    it("should show mobile-admin-nav", () => {
      fixture.detectChanges()
      expect(queryMobileAdminNav()).not.toBeNull()
      expect(queryAdminNavs().map(nav => nav.mobile)).toEqual([false, true])
    })
  })

  function queryDrawer() {
    return fixture.debugElement.query(By.directive(MatDrawer))
      .componentInstance as MatDrawer
  }

  function queryAdminNavs() {
    return fixture.debugElement
      .queryAll(By.directive(TestAdminNavComponent))
      .map(de => de.componentInstance) as TestAdminNavComponent[]
  }

  function queryDesktopAdminNav() {
    return nativeEl.querySelector("[data-test='desktop-admin-nav']") as HTMLElement
  }

  function queryMobileAdminNav() {
    return nativeEl.querySelector("[data-test='mobile-admin-nav']") as HTMLElement
  }
})
@Component({
  selector: "app-admin-nav",
  template: "",
})
class TestAdminNavComponent {
  @Input() mobile = false
}
