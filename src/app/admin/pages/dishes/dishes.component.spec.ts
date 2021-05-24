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
} from "../../components/dialogs/dish-dialog/dish-dialog.component"
import { ConfirmDialogComponent } from "../../../components/dialogs/confirm/confirm.component"
import { CategoryService } from "../../../services/category.service"

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
      imports: [MatDialogModule, MatIconModule, NoopAnimationsModule],
      providers: [
        { provide: DishService, useValue: dishServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DishesPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement

    dialog = TestBed.inject(MatDialog)
    dialogRef = dialog.open(TestDialogComponent)
    dialogOpen = spyOn(dialog, "open").and.returnValue(dialogRef)
  })

  afterEach(() => {
    dialogRef.close()
  })

  it("should call getDishes in ngOnInit", () => {
    const spy = spyOn(component, "getDishes").and.callThrough()
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(dishServiceSpy.getAll).toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()
    expect(component.dishes).toEqual(dishes)
  })

  it("should call getCategories in ngOnInit", () => {
    const spy = spyOn(component, "getCategories").and.callThrough()
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(categoryServiceSpy.getAll).toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()
    expect(component.categories).toEqual(categories)
  })

  it("should render dishes cards", async () => {
    component.dishes = dishes
    fixture.detectChanges()

    const cards = queryCardsComponents()
    if (
      expect(cards.length).toBe(
        dishes.length,
        `expected to render ${dishes.length} cards`,
      )
    ) {
      cards.forEach((card, i) => {
        const dish = dishes[i]
        expect(card.title).toBe(dish.title)
        expect(card.subtitle).toBe(dish.category.title)
        expect(card.removable).toBe(dish.removable)
        expect(card.imageSrc).toBe(dish.image)
      })
    }
  })

  it("should open dishes dialog in edit mode", () => {
    const openDialog = spyOn(component, "openDialog")
    fixture.detectChanges()
    const cards = queryCardsComponents()

    cards.forEach((card, i) => {
      const dish = dishes[i]
      card.edit.emit()
      expect(openDialog).toHaveBeenCalledWith({ mode: "edit", dish, categories })
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
      const updateImage = spyOn(component, "updateImage")
      const file = new File([new Blob()], "file")

      queryCardsComponents().forEach((card, i) => {
        card.upload.emit(file)
        expect(updateImage).toHaveBeenCalledWith(dishes[i].id, file)
      })
    })

    it("should call service's updateImage", () => {
      dishServiceSpy.updateImage.and.returnValue(of("123"))
      component.updateImage(5, image)
      expect(dishServiceSpy.updateImage).toHaveBeenCalledWith(5, image)
    })
  })

  function queryCardsComponents(): AdminCardComponent[] {
    return fixture.debugElement
      .queryAll(By.directive(AdminCardComponent))
      .map(de => de.componentInstance)
  }

  function queryAddBtn() {
    return nativeEl.querySelector("[data-test='add-dish-btn']") as HTMLButtonElement
  }
})
@Component({
  template: "",
})
class TestDialogComponent {}
