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
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { By } from "@angular/platform-browser"
import { CategoryService } from "../../../../services/category.service"
import { of, throwError } from "rxjs"
import { Category } from "../../../../models/models"
import { MatIconModule } from "@angular/material/icon"

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("CategoryDialogComponent", () => {
  let component: CategoryDialogComponent
  let fixture: ComponentFixture<CategoryDialogComponent>
  let nativeEl: HTMLElement
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryDialogComponent>>
  let serviceSpy: jasmine.SpyObj<CategoryService>
  let titleControl: FormControl

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])
    serviceSpy = jasmine.createSpyObj("CategoryService", ["create", "updateImage"])

    serviceSpy.create.and.returnValue(of({} as Category))

    TestBed.configureTestingModule({
      declarations: [CategoryDialogComponent, ImageUploadComponent, TestHostComponent],
      imports: [
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatIconModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: CategoryService, useValue: serviceSpy },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    titleControl = component.formGroup.get("title") as FormControl
  })

  it("should call setTitle on init", () => {
    const spy = spyOn(component, "setTitle")
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it("should listen for upload events on image-upload component", () => {
    const uploadComponent: ImageUploadComponent = fixture.debugElement.query(
      By.directive(ImageUploadComponent),
    ).componentInstance

    expect(component.newImage).toBeUndefined()

    uploadComponent.upload.emit(image)
    fixture.detectChanges()
    expect(component.newImage).toEqual(image)
  })

  it("should toggle error msg ", () => {
    component.errorMsg = "error"
    fixture.detectChanges()
    const el = queryError()
    expect(el).not.toBeNull()
    expect(el?.textContent).toContain(component.errorMsg)
    component.errorMsg = undefined
    fixture.detectChanges()
    expect(queryError()).toBeNull()
  })

  describe("Submit button", () => {
    it("should be disabled if form hasn't changed", () => {
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeTrue()
      component.formGroup.markAsDirty()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeFalse()
      component.formGroup.markAsPristine()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeTrue()
    })

    it("should be disabled while request is in progress", () => {
      titleControl.setValue("Fish")
      fixture.detectChanges()
      querySubmitBtn().click()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeTrue()
    })

    it("should be re-enabled if request is unsuccessful", () => {
      serviceSpy.create.and.returnValue(throwError({ status: 409, statusText: "Conflict" }))
      titleControl.setValue("Fish")
      component.formGroup.markAsDirty()
      fixture.detectChanges()
      querySubmitBtn().click()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeFalse()
    })

    it("should be of type submit", () => {
      expect(querySubmitBtn().type).toBe("submit")
    })
  })

  describe("Cancel button", () => {
    it("should close the dialog", () => {
      const btn = queryCancelBtn()
      expect(btn).not.toBeNull()
      btn.click()
      expect(dialogRefSpy.close).toHaveBeenCalled()
    })

    it("should be of type button", () => {
      expect(queryCancelBtn().type).toBe("button")
    })
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
    const category: Category = {
      id: 2,
      title,
      removable: true,
      image: "/image.png",
    }

    it("should close the dialog on successful request", () => {
      titleControl.setValue(title)
      component.formGroup.markAsDirty()
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1)
    })

    it("should not close the dialog on error", () => {
      serviceSpy.create.and.returnValue(throwError({ status: 403, statusText: "Forbidden" }))
      titleControl.setValue(title)
      component.formGroup.markAsDirty()
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(dialogRefSpy.close).not.toHaveBeenCalled()
    })

    describe("create", () => {
      beforeEach(() => {
        component.data.mode = "create"
      })

      it("should create category with image", () => {
        serviceSpy.create.and.returnValue(of(category))

        fixture.detectChanges()
        titleControl.setValue(title)
        component.newImage = image
        component.formGroup.markAsDirty()
        fixture.detectChanges()
        querySubmitBtn().click()

        expect(serviceSpy.create).toHaveBeenCalledBefore(serviceSpy.updateImage)
        expect(serviceSpy.create).toHaveBeenCalledWith(title)
        expect(serviceSpy.updateImage).toHaveBeenCalledWith(category.id, image)
      })

      it("should create category without image", () => {
        serviceSpy.create.and.returnValue(of(category))

        titleControl.setValue(title)
        component.formGroup.markAsDirty()
        fixture.detectChanges()
        querySubmitBtn().click()

        expect(serviceSpy.create).toHaveBeenCalledWith(title)
        expect(serviceSpy.updateImage).not.toHaveBeenCalled()
      })

      it("should trim title", () => {
        serviceSpy.create.and.returnValue(of(category))
        const titles = ["  Pizza", "Pizza  ", "  Pizza  "]

        titles.forEach(title => {
          titleControl.setValue(title)
          component.formGroup.markAsDirty()
          fixture.detectChanges()
          querySubmitBtn().click()
          expect(serviceSpy.create).toHaveBeenCalledWith(title.trim())
        })
      })
    })
  })

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }

  function queryCancelBtn() {
    return nativeEl.querySelector("[data-test='cancel-btn']") as HTMLButtonElement
  }

  function querySubmitBtn() {
    return nativeEl.querySelector("[data-test='submit-btn']") as HTMLButtonElement
  }

  function queryError() {
    return nativeEl.querySelector("[data-test='error-msg']") as HTMLElement
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
