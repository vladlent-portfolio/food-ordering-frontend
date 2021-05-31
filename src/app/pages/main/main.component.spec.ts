import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MainPageComponent } from "./main.component"
import { CategoryService } from "../../services/category.service"
import { DishService } from "../../services/dish.service"
import { MatButtonModule } from "@angular/material/button"
import { Category, Dish } from "../../models/models"
import { of } from "rxjs"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { addDishToCart } from "../../store/actions"

describe("MainComponent", () => {
  let component: MainPageComponent
  let fixture: ComponentFixture<MainPageComponent>
  let nativeEl: HTMLElement
  let dishes: Dish[]
  let categories: Category[]
  let dishServiceSpy: jasmine.SpyObj<DishService>
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>
  let store: MockStore

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
        provideMockStore(),
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    store = TestBed.inject(MockStore)
  })

  it("should fetch categories and dishes on init", () => {
    const getInitData = spyOn(component, "getInitData")
    component.ngOnInit()
    expect(getInitData).toHaveBeenCalledTimes(1)
  })

  describe("categories", () => {
    it("should have a caption", () => {
      const caption = nativeEl.querySelector("[data-test='categories-caption']")
      expect(caption).not.toBeNull()
      expect(caption?.textContent).toContain("Categories")
    })

    it("should render a card for each category", async () => {
      await component.ngOnInit()

      forEachCategoryCard((card, index) => {
        const c = categories[index]
        expect(card.textContent).toContain(c.title)

        const img = card.querySelector("img")
        expect(img).not.toBeNull()
        expect(img?.src).toContain(c.image)
        expect(img?.alt).toContain(c.title)
      })
    })

    it("should set aria-pressed to 'true' on currently selected category", async () => {
      await component.ngOnInit()

      for (const category of categories) {
        component.selectedCategoryID = category.id
        detectChanges()

        forEachCategoryCard(card => {
          const expected = card.textContent?.trim() === category.title
          expect(card.getAttribute("aria-pressed")).toBe(expected.toString())
        })
      }
    })

    it("should set selectedCategory on card click", async () => {
      await component.ngOnInit()

      forEachCategoryCard((card, i) => {
        card.click()
        expect(component.selectedCategoryID).toBe(categories[i].id)
      })
    })
  })

  describe("dishes", () => {
    it("should have a caption", async () => {
      await component.ngOnInit()
      const caption = nativeEl.querySelector("[data-test='dishes-caption']")
      expect(caption).not.toBeNull()
      expect(caption?.textContent).toContain("Dishes")
    })

    it("should render a card for each filtered dish", async () => {
      await component.ngOnInit()

      for (const category of categories) {
        component.selectedCategoryID = category.id
        detectChanges()

        const cards = queryDishesCards()
        expect(cards.length).toBe(component.filteredDishes.length)

        component.filteredDishes.forEach((d, i) => {
          const card = cards[i]
          expect(card.textContent).toContain(d.title)
          expect(card.textContent).toContain(d.price)

          const img = card.querySelector("img")
          expect(img?.src).toContain(d.image)
          expect(img?.alt).toContain(d.title)

          expect(queryAddBtn(card)).not.toBeNull()
        })
      }
    })

    it("should be hidden if category isn't selected", async () => {
      await component.ngOnInit()
      component.selectedCategoryID = undefined
      detectChanges()
      expect(nativeEl.querySelector("[data-test='dishes']")).toBeNull()
    })

    it("should call addToCart on 'add' btn click", async () => {
      const addToCart = spyOn(component, "addToCart")
      await component.ngOnInit()
      component.filteredDishes = dishes
      detectChanges()

      const cards = queryDishesCards()
      expect(cards.length).toBe(dishes.length)

      dishes.forEach((d, i) => {
        const card = cards[i]
        queryAddBtn(card).click()
        expect(addToCart).toHaveBeenCalledWith(d)
      })
    })
  })

  describe("selectedCategory", () => {
    it("should update selectedCategory", () => {
      for (const c of categories) {
        component.selectedCategoryID = c.id
        expect(component.selectedCategoryID).toBe(c.id)
      }
    })

    it("should update filteredDishes with dishes filtered by provided category id", async () => {
      await component.ngOnInit()
      const filterDishes = spyOn(component, "filterDishes")

      for (const category of categories) {
        component.selectedCategoryID = category.id
        expect(filterDishes).toHaveBeenCalledWith(category.id)
        expect(component.filteredDishes).toEqual(component.filterDishes(category.id))
      }
    })

    it("should not call filterDishes if provided id is undefined", () => {
      const filterDishes = spyOn(component, "filterDishes")
      component.selectedCategoryID = undefined
      expect(filterDishes).not.toHaveBeenCalled()
    })
  })

  describe("getInitData", () => {
    it("should call getCategories before calling getDishes", async () => {
      const getCategories = spyOn(component, "getCategories")
      const getDishes = spyOn(component, "getDishes")

      await component.ngOnInit()

      expect(getCategories).toHaveBeenCalledBefore(getDishes)
      expect(getCategories).toHaveBeenCalledTimes(1)
      expect(getDishes).toHaveBeenCalledTimes(1)
    })
  })

  describe("getCategories()", () => {
    it("should fetch categories and update components state", async () => {
      await component.getCategories()
      expect(categoryServiceSpy.getAll).toHaveBeenCalledTimes(1)
      expect(component.categories).toEqual(categories)
    })

    it("should set first category in array as selected category", async () => {
      await component.getCategories()
      expect(component.selectedCategoryID).toBe(categories[0].id)
    })
  })

  describe("getDishes()", () => {
    it("should fetch dishes and update components state", async () => {
      await component.getDishes()
      expect(dishServiceSpy.getAll).toHaveBeenCalledTimes(1)
      expect(component.dishes).toEqual(dishes)
    })

    it("should update filteredDishes if category is selected", async () => {
      const categoryID = categories[0].id
      component.selectedCategoryID = categoryID
      await component.getDishes()
      expect(component.filteredDishes).toEqual(component.filterDishes(categoryID))
    })

    it("should not update filteredDishes if category isn't selected", async () => {
      const initial = component.filteredDishes

      spyOn(component, "getCategories").and.callFake(async () => {
        component.selectedCategoryID = undefined
      })

      await component.getDishes()
      expect(component.filteredDishes).toBe(initial)
    })
  })

  describe("filterDishes()", () => {
    it("should filter dishes by provided category id and return them", async () => {
      await component.ngOnInit()

      for (const category of categories) {
        const expected = dishes.filter(d => d.category_id === category.id)
        expect(component.filterDishes(category.id)).toEqual(expected)
      }
    })
  })

  describe("addToCart()", () => {
    it("should add dish to cart", () => {
      const action = spyOn(store, "dispatch")
      for (const dish of dishes) {
        component.addToCart(dish)
        expect(action).toHaveBeenCalledWith(addDishToCart({ dish }))
      }
    })
  })

  function detectChanges() {
    fixture.detectChanges()
    component.cdRef.detectChanges()
  }

  function queryCategoriesCards(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='category-card']")
  }

  function queryDishesCards(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='dish-card']")
  }

  function queryAddBtn(dishCard: HTMLElement) {
    return dishCard.querySelector("[data-test='add-to-card-btn']") as HTMLElement
  }

  function forEachCategoryCard(fn: (card: HTMLElement, index: number) => void) {
    const cards = queryCategoriesCards()
    expect(cards.length).toBe(categories.length)
    cards.forEach(fn)
  }
})
