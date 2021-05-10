import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CategoryDialogComponent } from "./category-dialog.component"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"

describe("CategoryDialogComponent", () => {
  let component: CategoryDialogComponent
  let fixture: ComponentFixture<CategoryDialogComponent>
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should change title based on mode", () => {
    component.data.mode = "create"
    fixture.detectChanges()
    expect(queryTitle()?.textContent).toContain("Create new category")

    component.data.mode = "edit"
    fixture.detectChanges()
    expect(queryTitle()?.textContent).toContain("Edit category")
  })

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }
})
