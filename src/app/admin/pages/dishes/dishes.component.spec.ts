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

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("DishesComponent", () => {
  let component: DishesPageComponent
  let fixture: ComponentFixture<DishesPageComponent>
  let nativeEl: HTMLElement
  let dishes: Dish[]
  let categories: Category[]
  let serviceSpy: jasmine.SpyObj<DishService>
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
    serviceSpy = jasmine.createSpyObj("DishService", ["getAll", "remove", "updateImage"])

    TestBed.configureTestingModule({
      declarations: [DishesPageComponent, TestDialogComponent],
      imports: [MatDialogModule, MatIconModule, NoopAnimationsModule],
      providers: [{ provide: DishService, useValue: serviceSpy }],
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

  it("should call getAll in ngOnInit", () => {
    const spy = spyOn(component, "getAll")
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it("should open category dialog in edit mode", () => {
    const openDialog = spyOn(component, "openDialog")
    fixture.detectChanges()
    const cards = queryCardsComponents()

    cards.forEach((card, i) => {
      const dish = dishes[i]
      card.edit.emit()
      expect(openDialog).toHaveBeenCalledWith({ mode: "edit", dish, categories })
    })
  })

  describe("getAll()", () => {
    it("should call getAll from DishService and update component's state", () => {
      serviceSpy.getAll.and.returnValue(of(dishes))
      component.getAll()
      expect(serviceSpy.getAll).toHaveBeenCalled()

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
