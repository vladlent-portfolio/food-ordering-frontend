import { ComponentFixture, TestBed } from "@angular/core/testing"
import { CategoryDialogComponent, CategoryDialogData } from "./category-dialog.component"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { CategoryService } from "../../../../services/category.service"
import { of, throwError } from "rxjs"
import { Category } from "../../../../models/models"

const title = "Burgers"
const category: Category = {
  id: 2,
  title,
  removable: true,
  image: "/image.png",
}

describe("CategoryDialogComponent", () => {
  let component: CategoryDialogComponent
  let fixture: ComponentFixture<CategoryDialogComponent>
  let nativeEl: HTMLElement
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryDialogComponent>>
  let serviceSpy: jasmine.SpyObj<CategoryService>
  let data: CategoryDialogData

  beforeEach(() => {
    data = { mode: "create" }
    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])
    serviceSpy = jasmine.createSpyObj("CategoryService", ["create", "update"])

    serviceSpy.create.and.returnValue(of({} as Category))

    TestBed.configureTestingModule({
      declarations: [CategoryDialogComponent],
      imports: [
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: CategoryService, useValue: serviceSpy },
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

  it("should toggle title's error msg ", () => {
    testErrorToggle("titleError", queryTitleError)
  })

  describe("Submit button", () => {
    it("should be of type submit", () => {
      expect(querySubmitBtn().type).toBe("submit")
    })

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
      updateTitleControl("Fish")
      fixture.detectChanges()
      querySubmitBtn().click()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeTrue()
    })

    it("should be re-enabled if request is unsuccessful", () => {
      serviceSpy.create.and.returnValue(
        throwError({ status: 409, statusText: "Conflict" }),
      )
      updateTitleControl("Fish")
      fixture.detectChanges()
      querySubmitBtn().click()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeFalse()
    })

    it("should change it's label based on mode", () => {
      data.mode = "create"
      fixture.detectChanges()
      expect(querySubmitBtn().textContent).toContain("Create")
      Object.assign(data, { mode: "edit", category })
      fixture.detectChanges()
      expect(querySubmitBtn().textContent).toContain("Confirm")
    })
  })

  describe("Cancel button", () => {
    it("should close the dialog", () => {
      const btn = queryCancelBtn()
      expect(btn).not.toBeNull()
      btn.click()
      expect(dialogRefSpy.close).toHaveBeenCalledWith(false)
    })

    it("should be of type button", () => {
      expect(queryCancelBtn().type).toBe("button")
    })
  })

  describe("setTitle()", () => {
    it("should change title based on mode", () => {
      data.mode = "create"
      component.setTitle()
      fixture.detectChanges()
      expect(queryTitle()?.textContent).toContain("Create New Category")

      data.mode = "edit"
      component.setTitle()
      fixture.detectChanges()
      expect(queryTitle()?.textContent).toContain("Edit Category")
    })
  })

  describe("submit()", () => {
    it("should close the dialog on successful request", () => {
      updateTitleControl(title)
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true)
    })

    it("should not close the dialog on error", () => {
      serviceSpy.create.and.returnValue(
        throwError({ status: 403, statusText: "Forbidden" }),
      )
      updateTitleControl(title)
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(dialogRefSpy.close).not.toHaveBeenCalled()
    })

    it("should return early if form is invalid", () => {
      updateTitleControl("")
      fixture.detectChanges()
      component.submit()
      expect(component.isLoading).toBeFalse()
      expect(serviceSpy.create).not.toHaveBeenCalled()
      expect(serviceSpy.update).not.toHaveBeenCalled()
    })

    it("should update title error on 409", () => {
      serviceSpy.create.and.returnValue(throwError({ status: 409 }))
      updateTitleControl("Pizza")
      fixture.detectChanges()
      component.submit()
      fixture.detectChanges()
      expect(queryTitleError()).not.toBeNull()
      expect(queryTitleError().textContent).toContain(
        "Category with name 'Pizza' already exists",
      )
    })
  })

  describe("create mode", () => {
    it("should create category", () => {
      serviceSpy.create.and.returnValue(of(category))

      updateTitleControl(title)
      fixture.detectChanges()
      querySubmitBtn().click()

      expect(serviceSpy.create).toHaveBeenCalledWith(title)
      expect(serviceSpy.update).not.toHaveBeenCalled()
    })

    it("should trim title", () => {
      serviceSpy.create.and.returnValue(of(category))
      const titles = ["  Pizza", "Pizza  ", "  Pizza  "]

      titles.forEach(title => {
        updateTitleControl(title)
        fixture.detectChanges()
        querySubmitBtn().click()
        expect(serviceSpy.create).toHaveBeenCalledWith(title.trim())
      })
    })
  })

  describe("edit mode", () => {
    beforeEach(() => {
      Object.assign(data, { mode: "edit", category })
    })

    it("should call update from category service with correct values", () => {
      serviceSpy.update.and.returnValue(of({} as any))

      const newTitle = "Seafood"
      updateTitleControl(newTitle)
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(serviceSpy.create).not.toHaveBeenCalled()
      expect(serviceSpy.update).toHaveBeenCalledWith({ ...category, title: newTitle })
    })
  })

  function testErrorToggle(
    prop: keyof CategoryDialogComponent & "titleError",
    queryFn: () => HTMLElement,
  ) {
    updateTitleControl("Pizza")
    component[prop] = "error"
    fixture.detectChanges()
    const el = queryFn()
    expect(el).not.toBeNull()
    expect(el?.textContent).toContain(component[prop])
    component[prop] = undefined
    fixture.detectChanges()
    expect(queryFn()).toBeNull()
  }

  function updateTitleControl(value: string) {
    component.titleControl.setValue(value)
    component.titleControl.markAsDirty()
    component.titleControl.markAsTouched()
  }

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }

  function queryCancelBtn() {
    return nativeEl.querySelector("[data-test='cancel-btn']") as HTMLButtonElement
  }

  function querySubmitBtn() {
    return nativeEl.querySelector("[data-test='submit-btn']") as HTMLButtonElement
  }

  function queryTitleError() {
    return nativeEl.querySelector("[data-test='title-error']") as HTMLElement
  }
})
