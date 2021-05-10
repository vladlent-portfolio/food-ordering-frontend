import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CategoryDialogComponent } from "./category-dialog.component"
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { ImageUploadComponent } from "../../image-upload/image-upload.component"
import { Component } from "@angular/core"

describe("CategoryDialogComponent", () => {
  let component: CategoryDialogComponent
  let fixture: ComponentFixture<CategoryDialogComponent>
  let nativeEl: HTMLElement
  let dialogRef: jasmine.SpyObj<MatDialogRef<CategoryDialogComponent>>

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj("MatDialogRef", ["close"])

    TestBed.configureTestingModule({
      declarations: [CategoryDialogComponent, ImageUploadComponent, TestHostComponent],
      imports: [MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should call setTitle on init", () => {
    const spy = spyOn(component, "setTitle")
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it("should close the dialog", () => {
    const btn = queryCloseBtn()
    expect(btn).not.toBeNull()
    btn.click()
    expect(dialogRef.close).toHaveBeenCalled()
  })

  describe("setTitle()", () => {
    it("should change title based on mode", () => {
      component.data.mode = "create"
      component.setTitle()
      fixture.detectChanges()
      expect(queryTitle()?.textContent).toContain("Create New Category")

      component.data.mode = "edit"
      component.setTitle()
      fixture.detectChanges()
      expect(queryTitle()?.textContent).toContain("Edit Category")
    })
  })

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }

  function queryCloseBtn() {
    return nativeEl.querySelector(".close-btn") as HTMLButtonElement
  }
})

@Component({
  template: "",
})
class TestHostComponent {
  constructor(public dialog: MatDialog) {}

  open(config?: MatDialogConfig) {
    return this.dialog.open(CategoryDialogComponent)
  }
}
