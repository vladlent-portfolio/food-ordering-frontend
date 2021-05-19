import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of, throwError } from "rxjs"
import { By } from "@angular/platform-browser"
import { CategoriesPageComponent } from "./categories.component"
import { Category } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { AdminCardComponent } from "../../components/card/card.component"
import { ImageUploadError } from "../../components/image-upload/image-upload.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from "../../components/dialogs/category-dialog/category-dialog.component"
import { MatIconModule } from "@angular/material/icon"

let testCategories: Category[]

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("CategoriesComponent", () => {
  let component: CategoriesPageComponent
  let fixture: ComponentFixture<CategoriesPageComponent>
  let nativeEl: HTMLElement
  let serviceSpy: jasmine.SpyObj<CategoryService>
  let dialog: MatDialog

  beforeEach(() => {
    testCategories = [
      { id: 1, image: "/images/1.png", removable: false, title: "Pizza" },
      { id: 2, image: "/images/2.png", removable: true, title: "Burgers" },
    ]

    serviceSpy = jasmine.createSpyObj("CategoryService", ["getAll", "updateImage"])

    TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent, AdminCardComponent],
      imports: [MatDialogModule, MatIconModule],
      providers: [{ provide: CategoryService, useValue: serviceSpy }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    dialog = TestBed.inject(MatDialog)
  })

  it("should call getAll in ngOnInit", () => {
    const spy = spyOn(component, "getAll")
    expect(spy).not.toHaveBeenCalled()
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it("should open category dialog in edit mode", () => {
    serviceSpy.getAll.and.returnValue(of(testCategories))
    const openDialog = spyOn(component, "openDialog")
    fixture.detectChanges()
    const cards = queryCardsComponents()

    cards.forEach((card, i) => {
      const category = testCategories[i]
      card.edit.emit()
      expect(openDialog).toHaveBeenCalledWith({ mode: "edit", category })
    })
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

      const cards = queryCardsComponents()
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

  describe("openDialog()", () => {
    it("should call dialog open with provided options and default settings", () => {
      const open = spyOn(dialog, "open")
      const dialogOptions: CategoryDialogData[] = [
        { mode: "create" },
        { mode: "edit", category: testCategories[0] },
      ]

      dialogOptions.forEach(opt => {
        component.openDialog(opt)
        expect(open).toHaveBeenCalledWith(CategoryDialogComponent, {
          data: opt,
          disableClose: true,
        })
      })
    })
  })

  describe("create()", () => {
    it("should call dialog open", () => {
      const spy = spyOn(component, "openDialog")
      queryAddBtn().click()
      expect(spy).toHaveBeenCalledWith({ mode: "create" })
    })
  })

  describe("updateImage()", () => {
    const errorHandleTest = async (
      status: number,
      error: NonNullable<CategoriesPageComponent["uploadError"]>,
    ) => {
      serviceSpy.updateImage.and.returnValue(throwError({ status }))
      component.updateImage(5, image).subscribe({ error: () => {} })
      fixture.detectChanges()
      expect(component.uploadError).toEqual(error)
    }

    it("should call service's updateImage", () => {
      serviceSpy.updateImage.and.returnValue(of("123"))
      component.updateImage(5, image).subscribe()
      expect(serviceSpy.updateImage).toHaveBeenCalledWith(5, image)
    })

    it("should handle 413 error", () => errorHandleTest(413, ImageUploadError.Size))

    it("should handle 415 error", () => errorHandleTest(415, ImageUploadError.Type))

    it("should have default error msg", () =>
      errorHandleTest(438, "Unexpected error. Please try again later."))
  })
  //
  // it("should bind uploadError to image-upload component", () => {
  //   const msg = "error msg"
  //   component.uploadError = msg
  //   fixture.detectChanges()
  //   const upload: AdminCardComponent = fixture.debugElement.query(
  //     By.directive(AdminCardComponent),
  //   ).componentInstance
  //   expect(upload).toBeDefined()
  //   expect(upload.error).toEqual(msg)
  // })

  function queryCardsComponents(): AdminCardComponent[] {
    return fixture.debugElement
      .queryAll(By.directive(AdminCardComponent))
      .map(de => de.componentInstance)
  }

  function queryAddBtn() {
    return nativeEl.querySelector("[data-test='add-category-btn']") as HTMLButtonElement
  }
})
