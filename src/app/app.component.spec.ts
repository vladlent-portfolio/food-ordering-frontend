import { ComponentFixture, TestBed } from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { AppComponent } from "./app.component"
import { AppStoreModule } from "./store/app-store.module"
import { AppState } from "./store/reducers"
import { Store } from "@ngrx/store"
import { loadEnd, loadStart } from "./store/actions"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent
  let nativeEl: HTMLElement
  let store: Store<AppState>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppStoreModule, MatProgressSpinnerModule],
      declarations: [AppComponent],
    })

    fixture = TestBed.createComponent(AppComponent)
    store = TestBed.inject(Store)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should toggle loading spinner based on app state", () => {
    expect(querySpinner()).toBeNull()

    store.dispatch(loadStart())
    fixture.detectChanges()
    expect(querySpinner()).not.toBeNull()

    store.dispatch(loadEnd())
    fixture.detectChanges()
    expect(querySpinner()).toBeNull()
  })

  function querySpinner() {
    return nativeEl.querySelector(".spinner-container")
  }
})
