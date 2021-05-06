import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { of } from "rxjs"
import { By } from "@angular/platform-browser"
import { CategoriesPageComponent } from "./categories.component"
import { Category } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { AdminCardComponent } from "../../components/card/card.component"

let testCategories: Category[]

describe("CategoriesComponent", () => {
  let component: CategoriesPageComponent
  let fixture: ComponentFixture<CategoriesPageComponent>
  let serviceSpy: jasmine.SpyObj<CategoryService>
  let nativeEl: HTMLElement

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj("CategoryService", ["getAll"])
    TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent, AdminCardComponent],
      providers: [{ provide: CategoryService, useValue: serviceSpy }],
    })

    testCategories = [
      { id: 1, image: "/images/1.png", removable: false, title: "Pizza" },
      { id: 2, image: "/images/2.png", removable: true, title: "Burgers" },
    ]
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    fixture.detectChanges()
  })

  it("should call getAll in ngOnInit", () => {
    const spy = spyOn(component, "getAll")
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  describe("getAll()", () => {
    it("should call getAll from CategoryService and update component's state", fakeAsync(() => {
      const categories$ = of(testCategories)
      const getAllSpy = serviceSpy.getAll.and.returnValue(categories$)
      expect(getAllSpy).not.toHaveBeenCalled()
      component.getAll()
      expect(serviceSpy.getAll).toHaveBeenCalled()

      tick()

      expect(component.categories$).toEqual(categories$)
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
    }))
  })
})
