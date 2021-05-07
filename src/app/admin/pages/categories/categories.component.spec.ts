import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs"
import { By } from "@angular/platform-browser"
import { CategoriesPageComponent } from "./categories.component"
import { Category } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { AdminCardComponent } from "../../components/card/card.component"
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"

let testCategories: Category[]

describe("CategoriesComponent", () => {
  let component: CategoriesPageComponent
  let fixture: ComponentFixture<CategoriesPageComponent>
  let nativeEl: HTMLElement
  let serviceSpy: jasmine.SpyObj<CategoryService>

  beforeEach(() => {
    testCategories = [
      { id: 1, image: "/images/1.png", removable: false, title: "Pizza" },
      { id: 2, image: "/images/2.png", removable: true, title: "Burgers" },
    ]

    serviceSpy = jasmine.createSpyObj("CategoryService", ["getAll"])

    TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent, AdminCardComponent],
      providers: [{ provide: CategoryService, useValue: serviceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should call getAll in ngOnInit", () => {
    const spy = spyOn(component, "getAll")
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  describe("getAll()", () => {
    it("should call getAll from CategoryService and update component's state", () => {
      const categories$ = of(testCategories)
      serviceSpy.getAll.and.returnValue(categories$)
      component.getAll()
      expect(serviceSpy.getAll).toHaveBeenCalled()

      component.categories$?.subscribe(categories => {
        expect(categories).toEqual(testCategories)
      })
      fixture.detectChanges()

      const cards: AdminCardComponent[] = fixture.debugElement
        .queryAll(By.directive(AdminCardComponent))
        .map(de => de.componentInstance)
      if (
        expect(cards.length).toBe(
          testCategories.length,
          `expected to render ${testCategories.length} cards`,
        )
      ) {
        cards.forEach((card, i) => {
          const category = testCategories[i]
          expect(card.title).toBe(category.title)
          expect(card.subtitle).toBeUndefined()
          expect(card.removable).toBe(category.removable)
          expect(card.imageSrc).toBe(category.image)
        })
      }
    })
  })
})
