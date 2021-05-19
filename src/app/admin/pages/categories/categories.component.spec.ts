import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of, throwError } from "rxjs"
import { By } from "@angular/platform-browser"
import { CategoriesPageComponent } from "./categories.component"
import { Category } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { AdminCardComponent } from "../../components/card/card.component"
import { ImageUploadError } from "../../components/image-upload/image-upload.component"
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from "../../components/dialogs/category-dialog/category-dialog.component"
import { MatIconModule } from "@angular/material/icon"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { ConfirmDialogComponent } from "../../../components/dialogs/confirm/confirm.component"

let testCategories: Category[]

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("CategoriesComponent", () => {
  let component: CategoriesPageComponent
  let fixture: ComponentFixture<CategoriesPageComponent>
  let nativeEl: HTMLElement
  let serviceSpy: jasmine.SpyObj<CategoryService>
  let dialog: MatDialog
  let dialogRef: MatDialogRef<TestDialogComponent>
  let dialogOpen: jasmine.Spy<MatDialog["open"]>

  beforeEach(() => {
    testCategories = [
      { id: 1, image: "/images/1.png", removable: false, title: "Pizza" },
      { id: 2, image: "/images/2.png", removable: true, title: "Burgers" },
    ]

    serviceSpy = jasmine.createSpyObj("CategoryService", ["getAll", "updateImage"])
    serviceSpy.getAll.and.returnValue(of(testCategories))

    TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent, AdminCardComponent],
      imports: [MatDialogModule, MatIconModule, NoopAnimationsModule],
      providers: [{ provide: CategoryService, useValue: serviceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPageComponent)
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
      const dialogOptions: CategoryDialogData[] = [
        { mode: "create" },
        { mode: "edit", category: testCategories[0] },
      ]

      dialogOptions.forEach(opt => {
        component.openDialog(opt)
        expect(dialogOpen).toHaveBeenCalledWith(CategoryDialogComponent, {
          data: opt,
          disableClose: true,
        })
      })
    })

    describe("afterClosed", () => {
      beforeEach(() => {
        fixture.detectChanges()
      })

      // TODO: Fix this tests
      it("should update categories if dialog was closed with 'true'", async () => {
        const getAll = spyOn(component, "getAll")
        dialogRef.close(true)
        await fixture.whenStable()
        fixture.detectChanges()
        expect(getAll).toHaveBeenCalled()
      })

      it("should not update categories if dialog was close with 'false'", () => {
        const getAll = spyOn(component, "getAll")
        dialogRef.close(false)
        fixture.detectChanges()
        expect(getAll).not.toHaveBeenCalled()
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

  describe("remove()", () => {
    it("should be called on click", () => {
      const remove = spyOn(component, "remove")
      fixture.detectChanges()
      const cards = queryCardsComponents()
      cards.forEach((card, i) => {
        card.remove.emit()
        expect(remove).toHaveBeenCalledWith(testCategories[i])
      })
    })

    it("should call dialog open", () => {
      const category = { ...testCategories[0], removable: true }
      component.remove(category)
      if (expect(dialogOpen).toHaveBeenCalled()) {
        const args = dialogOpen.calls.mostRecent().args
        expect(args[0]).toBe(ConfirmDialogComponent)
        // @ts-ignore
        expect(args[1].data.content).toBeDefined()
      }
    })

    it("should not call dialog open if category isn't removable", () => {
      const category = { ...testCategories[0], removable: false }
      component.remove(category)
      expect(dialogOpen).not.toHaveBeenCalled()
    })

    it("should refresh categories on confirm", () => {
      const category = { ...testCategories[0], removable: true }
      fixture.detectChanges()
      const getAll = spyOn(component, "getAll")
      component.remove(category)
      dialogRef.close(true)
      expect(getAll).toHaveBeenCalled()
    })

    it("should not refresh categories on cancel", () => {
      const getAll = spyOn(component, "getAll")
      fixture.detectChanges()
      const category = { ...testCategories[0], removable: true }
      component.remove(category)
      dialogRef.close(false)
      expect(getAll).not.toHaveBeenCalled()
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

@Component({
  template: "",
})
class TestDialogComponent {}
