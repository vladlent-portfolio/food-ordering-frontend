import { ComponentFixture, TestBed } from "@angular/core/testing"

import { DishesPageComponent } from "./dishes.component"
import { Category, Dish } from "../../../models/models"
import { DishService } from "../../../services/dish.service"
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { AdminCardComponent } from "../../components/card/card.component"
import { By } from "@angular/platform-browser"
import { of } from "rxjs"
import {
  DishDialogComponent,
  DishDialogData,
} from "../../components/dialogs/dish/dish-dialog.component"
import { ConfirmDialogComponent } from "../../../components/dialogs/confirm/confirm.component"
import { CategoryService } from "../../../services/category.service"
import { MatSelectModule } from "@angular/material/select"
import { MatOption } from "@angular/material/core"
import { MockStore, provideMockStore } from "@ngrx/store/testing"

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("DishesComponent", () => {
  let component: DishesPageComponent
  let fixture: ComponentFixture<DishesPageComponent>
  let nativeEl: HTMLElement
  let dishes: Dish[]
  let categories: Category[]
  let dishServiceSpy: jasmine.SpyObj<DishService>
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>
  let dialog: MatDialog
  let dialogRef: MatDialogRef<TestDialogComponent>
  let dialogOpen: jasmine.Spy<MatDialog["open"]>
  let store: MockStore<any>

  beforeEach(() => {
    categories = [
      { id: 1, title: "Salads", removable: false, image: "/categories/1.png" },
      { id: 3, title: "Pizza", removable: true, image: "/categories/3.jpg" },
    ]
    dishes = [
      {
        id: 2,
        title: "Crunchy Cashew Salad",
        price: 3.22,
        image: "/dishes/2.png",
        removable: true,
        category_id: 1,
        category: categories[0],
      },
      {
        id: 1,
        title: "Margherita",
        price: 4.2,
        image: "/dishes/1.png",
        removable: false,
        category_id: 3,
        category: categories[1],
      },
    ]
    dishServiceSpy = jasmine.createSpyObj("DishService", [
      "getAll",
      "remove",
      "updateImage",
    ])
    categoryServiceSpy = jasmine.createSpyObj("CategoryService", ["getAll"])

    dishServiceSpy.getAll.and.returnValue(of(dishes))
    categoryServiceSpy.getAll.and.returnValue(of(categories))

    TestBed.configureTestingModule({
      declarations: [DishesPageComponent, TestDialogComponent, AdminCardComponent],
      imports: [MatDialogModule, MatIconModule, NoopAnimationsModule, MatSelectModule],
      providers: [
        { provide: DishService, useValue: dishServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        provideMockStore(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DishesPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement

    dialog = TestBed.inject(MatDialog)
    store = TestBed.inject(MockStore)
    dialogRef = dialog.open(TestDialogComponent)
    dialogOpen = spyOn(dialog, "open").and.returnValue(dialogRef)
  })

  afterEach(() => {
    dialogRef.close()
  })

  it("should call getDishes in ngOnInit", () => {
    const spy = spyOn(component, "getDishes").and.callThrough()
    expect(spy).not.toHaveBeenCalled()
    component.dishes$.subscribe(d => expect(d).toEqual(dishes))
    component.ngOnInit()
    expect(dishServiceSpy.getAll).toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()
  })

  it("should call getCategories in ngOnInit", () => {
    const spy = spyOn(component, "getCategories").and.callThrough()
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(categoryServiceSpy.getAll).toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()
    expect(component.categories).toEqual(categories)
  })

  it("should pass acceptedImageTypes to admin-card component", () => {
    const tests: any[] = [
      ["image/png"],
      ["image/png", "image/webp"],
      null,
      ["image/png", "image/webp", "image/jpg"],
    ]

    component.ngOnInit()
    detectChanges()
    const cards = queryCardsComponents()

    for (const test of tests) {
      component.acceptedImageTypes = test
      detectChanges()

      for (const card of cards) {
        expect(card.acceptedImageTypes).toEqual(test)
      }
    }
  })

  describe("dishes cards", () => {
    beforeEach(() => {
      fixture.detectChanges()
      component.ngOnInit()
    })

    it("should render a card for each dish", () => {
      const cards = queryCardsComponents()
      expect(cards.length).toEqual(
        dishes.length,
        `expected to render ${dishes.length} cards`,
      )
      {
        cards.forEach((card, i) => {
          const dish = dishes[i]
          expect(card.title).toBe(dish.title)
          expect(card.subtitle).toBeUndefined()
          expect(card.subtitleTemplate).toBeDefined(
            "expected card to use custom subtitle template",
          )
          expect(card.removable).toBe(dish.removable)
          expect(card.imageSrc).toBe(dish.image)
        })
      }
    })

    it("should have custom subtitle with price and category", () => {
      const subtitles = nativeEl.querySelectorAll("[data-test='dish-subtitle']")
      expect(subtitles.length).toBe(dishes.length)
      subtitles.forEach((subtitle, i) => {
        const dish = dishes[i]
        expect(subtitle.textContent).toContain(dish.price)
        expect(subtitle.textContent).toContain(dish.category.title)
      })
    })
  })

  it("should open dishes dialog in edit mode", () => {
    const openDialog = spyOn(component, "openDialog")
    fixture.detectChanges()
    component.ngOnInit()
    const cards = queryCardsComponents()

    cards.forEach((card, i) => {
      const dish = dishes[i]
      card.edit.emit()
      expect(openDialog).toHaveBeenCalledWith({ mode: "edit", dish, categories })
    })
  })

  describe("categories filter", () => {
    let filters: { id: number; title: string }[]

    beforeEach(() => {
      filters = [...categories, { id: 0, title: "All" }]
    })

    it("should be populated with categories", () => {
      fixture.detectChanges()
      const options = queryCategoriesOptions()

      expect(options.length).toBe(filters.length)

      for (const opt of options) {
        const filter = filters.find(f => opt.value === f.id)
        if (expect(filter).toBeDefined()) {
          expect(opt.viewValue).toBe(filter!.title)
        }
      }
    })

    it("should filter dishes by selected category", () => {
      fixture.detectChanges()
      component.ngOnInit()
      expect(queryCardsComponents().length).toBe(dishes.length)

      for (const dish of dishes) {
        component.categoriesFilter.setValue(dish.category_id)
        fixture.detectChanges()
        const filteredDishes = dishes.filter(d => d.category_id === dish.category_id)
        expect(queryCardsComponents().length).toBe(filteredDishes.length)
      }
    })

    it("should preserve filter on dishes update", () => {
      const category = categories[1]
      const newDishes = [
        ...dishes,
        {
          id: 3,
          title: "4 Cheese",
          category_id: category.id,
          category,
          removable: true,
        } as Dish,
      ]

      dishServiceSpy.getAll.and.returnValue(of(newDishes))
      fixture.detectChanges()

      component.categoriesFilter.setValue(category.id)
      fixture.detectChanges()
      component.getDishes()
      fixture.detectChanges()
      expect(queryCardsComponents().length).toBe(
        newDishes.filter(d => d.category_id === category.id).length,
      )
    })

    it("should have initial value of 0", () => {
      expect(component.categoriesFilter.value).toBe(0)
    })

    it("should be disabled if categories are falsy", () => {
      expect(component.categoriesFilter.disabled).toBeTrue()
    })

    it("should be enabled if categories are truthy", () => {
      fixture.detectChanges()
      expect(component.categoriesFilter.disabled).toBeFalse()
    })
  })

  describe("getDishes()", () => {
    it("should call getAll from DishService and update component's state", () => {
      component.getDishes()
      expect(dishServiceSpy.getAll).toHaveBeenCalled()
    })
  })

  describe("getCategories()", () => {
    it("should call getAll from CategoryService and update component's state", () => {
      component.getCategories()
      expect(categoryServiceSpy.getAll).toHaveBeenCalled()
      fixture.detectChanges()
      expect(component.categories).toEqual(categories)
    })
  })

  describe("openDialog()", () => {
    let dialogOptions: DishDialogData[]

    beforeEach(() => {
      dialogOptions = [
        { mode: "create", categories },
        { mode: "edit", categories, dish: dishes[0] },
      ]
    })

    it("should call dialog open with provided options and default settings", () => {
      for (const opt of dialogOptions) {
        component.openDialog(opt)
        expect(dialogOpen).toHaveBeenCalledWith(DishDialogComponent, {
          data: opt,
        })
      }
    })

    it("should change dialog width on mobile", () => {
      store.setState({ isSmallScreen: true })
      for (const opt of dialogOptions) {
        component.openDialog(opt)
        expect(dialogOpen).toHaveBeenCalledWith(DishDialogComponent, {
          data: opt,
          minWidth: "95vw",
          maxWidth: "95vw",
        })
      }
    })

    describe("after closed", () => {
      beforeEach(() => {
        fixture.detectChanges()
      })

      it("should update dishes if dialog was closed with 'true'", async () => {
        const getDishes = spyOn(component, "getDishes")

        for (const opt of dialogOptions) {
          component.openDialog(opt)
          dialogRef.close(true)
          fixture.detectChanges()
          await fixture.whenStable()
          expect(getDishes).toHaveBeenCalledTimes(1)
        }
      })

      it("should not update categories if dialog was close with 'false'", async () => {
        const getAll = spyOn(component, "getDishes")

        for (const opt of dialogOptions) {
          component.openDialog(opt)
          dialogRef.close(false)
          fixture.detectChanges()
          await fixture.whenStable()
        }

        expect(getAll).not.toHaveBeenCalled()
      })
    })
  })

  describe("create()", () => {
    it("should call dialog open", () => {
      fixture.detectChanges()
      const spy = spyOn(component, "openDialog")
      queryAddBtn().click()
      expect(spy).toHaveBeenCalledOnceWith({ mode: "create", categories })
    })
  })

  describe("remove()", () => {
    it("should be called on click", () => {
      const remove = spyOn(component, "remove")
      fixture.detectChanges()
      component.ngOnInit()
      const cards = queryCardsComponents()
      cards.forEach((card, i) => {
        card.remove.emit()
        expect(remove).toHaveBeenCalledWith(dishes[i])
      })
    })

    it("should call dialog open", () => {
      const dish = { ...dishes[0], removable: true }
      component.remove(dish)
      if (expect(dialogOpen).toHaveBeenCalled()) {
        const args = dialogOpen.calls.mostRecent().args
        expect(args[0]).toBe(ConfirmDialogComponent)
        // @ts-ignore
        expect(args[1].data.content).toBeDefined()
      }
    })

    it("should call service's remove method", async () => {
      const dish = { ...dishes[0], removable: true }
      dishServiceSpy.remove.and.returnValue(of(dish))

      component.remove(dish)
      dialogRef.close(true)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(dishServiceSpy.remove).toHaveBeenCalledOnceWith(dish.id)
    })

    it("should not call dialog open if dish isn't removable", () => {
      const dish = { ...dishes[0], removable: false }
      component.remove(dish)
      expect(dialogOpen).not.toHaveBeenCalled()
    })

    it("should refresh dishes on success", async () => {
      const dish = { ...dishes[0], removable: true }
      dishServiceSpy.remove.and.returnValue(of(dish))

      fixture.detectChanges()
      const getAll = spyOn(component, "getDishes")

      component.remove(dish)
      dialogRef.close(true)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(getAll).toHaveBeenCalled()
    })

    it("should not refresh dishes on cancel", async () => {
      const dish = { ...dishes[0], removable: true }
      fixture.detectChanges()
      const getAll = spyOn(component, "getDishes")

      component.remove(dish)
      dialogRef.close(false)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(getAll).not.toHaveBeenCalled()
    })
  })

  describe("updateImage()", () => {
    it("should be called by cards upload", () => {
      fixture.detectChanges()
      component.ngOnInit()
      const updateImage = spyOn(component, "updateImage")
      const file = new File([new Blob()], "file")

      queryCardsComponents().forEach((card, i) => {
        card.upload.emit(file)
        expect(updateImage).toHaveBeenCalledWith(dishes[i].id, file)
      })
    })

    it("should call service's updateImage", () => {
      fixture.detectChanges()
      dishServiceSpy.updateImage.and.returnValue(of("123"))
      component.updateImage(5, image)
      expect(dishServiceSpy.updateImage).toHaveBeenCalledWith(5, image)
    })
  })

  function detectChanges() {
    fixture.detectChanges()
    component.cdRef.detectChanges()
  }

  function queryCardsComponents(): AdminCardComponent[] {
    return fixture.debugElement
      .queryAll(By.directive(AdminCardComponent))
      .map(de => de.componentInstance)
  }

  function queryAddBtn() {
    return nativeEl.querySelector("[data-test='add-dish-btn']") as HTMLButtonElement
  }

  function queryCategorySelect() {
    return nativeEl.querySelector("[data-test='category-select']") as HTMLElement
  }

  function queryCategoriesOptions(): MatOption[] {
    const select = queryCategorySelect()
    select.click()
    fixture.detectChanges()
    return fixture.debugElement
      .queryAll(By.directive(MatOption))
      .map(de => de.componentInstance)
  }
})
@Component({
  template: "",
})
class TestDialogComponent {}
