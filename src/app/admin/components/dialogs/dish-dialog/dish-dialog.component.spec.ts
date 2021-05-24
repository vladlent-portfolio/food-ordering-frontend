import { ComponentFixture, TestBed } from "@angular/core/testing"
import { DishDialogComponent, DishDialogData } from "./dish-dialog.component"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { MatInputModule } from "@angular/material/input"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { DishService } from "../../../../services/dish.service"
import { Category, Dish } from "../../../../models/models"
import { of, throwError } from "rxjs"
import { DishCreateDTO } from "../../../../models/dtos"
import { By } from "@angular/platform-browser"
import { MatOption } from "@angular/material/core"
import { MatSelectModule } from "@angular/material/select"

describe("DishDialogComponent", () => {
  let component: DishDialogComponent
  let fixture: ComponentFixture<DishDialogComponent>
  let nativeEl: HTMLElement
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DishDialogComponent>>
  let serviceSpy: jasmine.SpyObj<DishService>
  let data: DishDialogData

  let dish: Dish
  let dto: DishCreateDTO
  let categories: Category[]

  beforeEach(() => {
    categories = [
      { id: 1, title: "Salads", removable: false, image: "/categories/1.png" },
      { id: 3, title: "Pizza", removable: true, image: "/categories/3.jpg" },
    ]
    data = { mode: "create", categories }
    dish = {
      id: 2,
      title: "Crunchy Cashew Salad",
      price: 3.22,
      image: "/dishes/2.png",
      removable: true,
      category_id: 1,
      category: categories[0],
    }
    dto = { title: "Margherita", price: 4.2, category_id: 3 }
    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])
    serviceSpy = jasmine.createSpyObj("CategoryService", ["create", "update"])

    TestBed.configureTestingModule({
      declarations: [DishDialogComponent],
      imports: [
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: DishService, useValue: serviceSpy },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DishDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should call setTitle on init", () => {
    fixture.detectChanges()
    const spy = spyOn(component, "setTitle")
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it("should toggle title error", () => {
    updateTitleControl("Pizza")
    component.titleError = "error"
    fixture.detectChanges()
    const el = queryTitleError()
    expect(el).not.toBeNull()
    expect(el?.textContent).toContain(component.titleError)
    component.titleError = undefined
    fixture.detectChanges()
    expect(queryTitleError()).toBeNull()
  })

  describe("price control", () => {
    it("should show error message if price is negative", () => {
      fixture.detectChanges()
      updatePriceControl(-1)
      fixture.detectChanges()
      const el = queryPriceError()
      expect(el).not.toBeNull()
      expect(el?.textContent).toContain("Price can't be negative")
      updatePriceControl(1)
      fixture.detectChanges()
      expect(queryPriceError()).toBeNull()
    })
  })

  describe("categories control", () => {
    it("should be populated", () => {
      fixture.detectChanges()
      const select = nativeEl.querySelector("mat-select") as HTMLElement
      if (expect(select).not.toBeNull()) {
        select.click()
        fixture.detectChanges()
        const options: MatOption[] = fixture.debugElement
          .queryAll(By.directive(MatOption))
          .map(de => de.componentInstance)

        expect(options.length).toBe(categories.length)

        options.forEach((o, i) => {
          const category = categories[i]
          expect(o.value).toBe(category.id)
          expect(o.viewValue.trim()).toBe(category.title)
        })
      }
    })
  })

  describe("Submit button", () => {
    it("should be of type submit", () => {
      fixture.detectChanges()
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
      fixture.detectChanges()
      updateForm(dto.title, dto.price, dto.category_id)
      fixture.detectChanges()
      querySubmitBtn().click()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeTrue()
    })

    it("should be re-enabled if request is unsuccessful", () => {
      serviceSpy.create.and.returnValue(
        throwError({ status: 409, statusText: "Conflict" }),
      )

      fixture.detectChanges()
      updateForm(dto.title, dto.price, dto.category_id)
      fixture.detectChanges()
      querySubmitBtn().click()
      fixture.detectChanges()
      expect(querySubmitBtn().disabled).toBeFalse()
    })

    it("should change it's label based on mode", () => {
      data.mode = "create"
      fixture.detectChanges()
      expect(querySubmitBtn().textContent).toContain("Create")
      Object.assign(data, { mode: "edit", dish, categories })
      fixture.detectChanges()
      expect(querySubmitBtn().textContent).toContain("Confirm")
    })
  })

  describe("Cancel button", () => {
    it("should close the dialog", () => {
      fixture.detectChanges()
      const btn = queryCancelBtn()
      expect(btn).not.toBeNull()
      btn.click()
      expect(dialogRefSpy.close).toHaveBeenCalledWith(false)
    })

    it("should be of type button", () => {
      fixture.detectChanges()
      expect(queryCancelBtn().type).toBe("button")
    })
  })

  describe("setTitle()", () => {
    it("should change title based on mode", () => {
      data.mode = "create"
      fixture.detectChanges()
      component.setTitle()
      fixture.detectChanges()
      expect(queryTitle()?.textContent).toContain("Create New Dish")

      data.mode = "edit"
      fixture.detectChanges()
      component.setTitle()
      fixture.detectChanges()
      expect(queryTitle()?.textContent).toContain("Edit Dish")
    })
  })

  describe("submit()", () => {
    it("should close the dialog on successful request", () => {
      serviceSpy.create.and.returnValue(of(dish))
      fixture.detectChanges()
      updateForm(dto.title, dto.price, dto.category_id)
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true)
    })

    it("should not close the dialog on error", () => {
      serviceSpy.create.and.returnValue(
        throwError({ status: 403, statusText: "Forbidden" }),
      )

      fixture.detectChanges()
      updateForm(dto.title, dto.price, dto.category_id)
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(dialogRefSpy.close).not.toHaveBeenCalled()
    })

    it("should return early if form is invalid", () => {
      updateForm("", -5, 3)
      fixture.detectChanges()
      component.submit()
      expect(component.isLoading).toBeFalse()
      expect(serviceSpy.create).not.toHaveBeenCalled()
      expect(serviceSpy.update).not.toHaveBeenCalled()
    })

    it("should trim title", () => {
      serviceSpy.create.and.returnValue(of(dish))
      serviceSpy.update.and.returnValue(of(dish))
      const titles = ["  4 Cheese", "4 Cheese  ", "  4 Cheese  "]
      const modes: DishDialogData["mode"][] = ["create", "edit"]

      fixture.detectChanges()

      modes.forEach(mode => {
        component.data.mode = mode
        fixture.detectChanges()

        titles.forEach(title => {
          updateForm(title, dto.price, dto.category_id)
          fixture.detectChanges()
          querySubmitBtn().click()
          expect(serviceSpy.create.calls.mostRecent().args[0].title).toBe("4 Cheese")
        })
      })
    })

    it("should update title error on 409", async () => {
      serviceSpy.create.and.returnValue(throwError({ status: 409 }))

      updateForm(dto.title, dto.price, dto.category_id)
      fixture.detectChanges()
      component.submit()
      fixture.detectChanges()

      const error = queryTitleError()

      if (expect(error).not.toBeNull()) {
        expect(error.textContent).toContain(
          `Dish with name '${dto.title}' already exists`,
        )
      }
    })
  })

  describe("create mode", () => {
    it("should create dish", () => {
      serviceSpy.create.and.returnValue(of(dish))

      fixture.detectChanges()
      updateForm(dto.title, dto.price, dto.category_id)
      fixture.detectChanges()
      querySubmitBtn().click()

      expect(serviceSpy.create).toHaveBeenCalledWith(dto)
      expect(serviceSpy.update).not.toHaveBeenCalled()
    })
  })

  describe("edit mode", () => {
    beforeEach(() => {
      Object.assign(data, { mode: "edit", categories, dish })
    })

    it("should call update from dish service with correct values", () => {
      serviceSpy.update.and.returnValue(of({} as any))
      const title = "4 Cheese"
      const price = 4.69
      const category_id = 5

      fixture.detectChanges()
      updateForm(title, price, category_id)
      fixture.detectChanges()
      querySubmitBtn().click()
      expect(serviceSpy.create).not.toHaveBeenCalled()
      expect(serviceSpy.update).toHaveBeenCalledWith({
        ...dish,
        title,
        price,
        category_id,
      })
    })
  })

  function updateTitleControl(value: string) {
    updateControl("title", value)
  }

  function updatePriceControl(value: number) {
    updateControl("price", value)
  }

  function updateForm(title: string, price: number, id: number) {
    component.formGroup.patchValue({ title, price, category_id: id })
    component.formGroup.markAllAsTouched()
    component.formGroup.markAsDirty()
  }

  function updateControl(controlName: string, value: any) {
    const control = component.formGroup.get(controlName) as FormControl
    control.setValue(value)
    control.markAsTouched()
    control.markAsDirty()
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

  function queryPriceError() {
    return nativeEl.querySelector("[data-test='price-error']") as HTMLElement
  }
})
