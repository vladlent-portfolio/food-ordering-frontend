import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MainPageComponent } from "./main.component"
import { CategoryService } from "../../services/category.service"
import { DishService } from "../../services/dish.service"
import { MatButtonModule } from "@angular/material/button"
import { Category, Dish } from "../../models/models"
import { of } from "rxjs"

describe("MainComponent", () => {
  let component: MainPageComponent
  let fixture: ComponentFixture<MainPageComponent>
  let nativeEl: HTMLElement
  let dishes: Dish[]
  let categories: Category[]
  let dishServiceSpy: jasmine.SpyObj<DishService>
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>

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
    dishServiceSpy = jasmine.createSpyObj("DishService", ["getAll"])
    categoryServiceSpy = jasmine.createSpyObj("CategoryService", ["getAll"])

    dishServiceSpy.getAll.and.returnValue(of(dishes))
    categoryServiceSpy.getAll.and.returnValue(of(categories))

    TestBed.configureTestingModule({
      declarations: [MainPageComponent],
      imports: [MatButtonModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: DishService, useValue: dishServiceSpy },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should fetch categories and dishes on init", () => {
    const getCategories = spyOn(component, "getCategories")
    const getDishes = spyOn(component, "getDishes")

    component.ngOnInit()

    expect(getCategories).toHaveBeenCalledTimes(1)
    expect(getDishes).toHaveBeenCalledTimes(1)
  })

  describe("categories cards", () => {
    it("should render a card for each category", () => {
      fixture.detectChanges()

      const cards = queryCategoriesCards()
      expect(cards.length).toBe(categories.length)

      categories.forEach((c, i) => {
        const card = cards[i]
        expect(card.textContent).toContain(c.title)

        const img = card.querySelector("img")
        expect(img).not.toBeNull()
        expect(img?.src).toContain(c.image)
        expect(img?.alt).toContain(c.title)
      })
    })
  })

  describe("dishes cards", () => {
    it("should render a card for each dish", () => {
      fixture.detectChanges()

      const cards = queryDishesCards()
      expect(cards.length).toBe(dishes.length)

      dishes.forEach((d, i) => {
        const card = cards[i]
        expect(card.textContent).toContain(d.title)
        expect(card.textContent).toContain(d.price)

        const img = card.querySelector("img")
        expect(img?.src).toContain(d.image)
        expect(img?.alt).toContain(d.title)

        expect(queryAddBtn(card)).not.toBeNull()
      })
    })
  })

  describe("getCategories()", () => {
    it("should fetch categories and update components state", () => {
      component.getCategories()
      expect(categoryServiceSpy.getAll).toHaveBeenCalledTimes(1)
      expect(component.categories).toEqual(categories)
    })
  })

  describe("getDishes()", () => {
    it("should fetch dishes and update components state", () => {
      component.getDishes()
      expect(dishServiceSpy.getAll).toHaveBeenCalledTimes(1)
      expect(component.dishes).toEqual(dishes)
    })
  })

  function queryCategoriesCards() {
    return nativeEl.querySelectorAll("[data-test='category-card']")
  }

  function queryDishesCards(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='dish-card']")
  }

  function queryAddBtn(dishCard: HTMLElement) {
    return dishCard.querySelector("[data-test='add-to-card-btn']")
  }
})
