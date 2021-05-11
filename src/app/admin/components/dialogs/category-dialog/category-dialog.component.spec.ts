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
import { ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { By } from "@angular/platform-browser"

describe("CategoryDialogComponent", () => {
  let component: CategoryDialogComponent
  let fixture: ComponentFixture<CategoryDialogComponent>
  let nativeEl: HTMLElement
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryDialogComponent>>

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])

    TestBed.configureTestingModule({
      declarations: [CategoryDialogComponent, ImageUploadComponent, TestHostComponent],
      imports: [
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpy },
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
    expect(dialogRefSpy.close).toHaveBeenCalled()
  })

  it("should listen for upload events on image-upload component", () => {
    const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
    const uploadComponent: ImageUploadComponent = fixture.debugElement.query(
      By.directive(ImageUploadComponent),
    ).componentInstance

    expect(component.newImage).toBeUndefined()

    uploadComponent.upload.emit(image)
    fixture.detectChanges()
    expect(component.newImage).toEqual(image)
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

  describe("submit()", () => {
    const title = "Burgers"
    const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })

    it("should create new category and add image to it if mode is 'create'", () => {})
  })

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }

  function queryCloseBtn() {
    return nativeEl.querySelector(".close-btn") as HTMLButtonElement
  }

  function querySubmitBtn() {
    return nativeEl.querySelector(".submit-btn") as HTMLButtonElement
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
