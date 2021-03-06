import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs"
import { By } from "@angular/platform-browser"
import { CategoriesPageComponent } from "./categories.component"
import { Category } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { AdminCardComponent } from "../../components/card/card.component"
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from "../../components/dialogs/category/category-dialog.component"
import { MatIconModule } from "@angular/material/icon"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { ConfirmDialogComponent } from "../../../components/dialogs/confirm/confirm.component"

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("CategoriesComponent", () => {
  let component: CategoriesPageComponent
  let fixture: ComponentFixture<CategoriesPageComponent>
  let nativeEl: HTMLElement
  let serviceSpy: jasmine.SpyObj<CategoryService>
  let dialog: MatDialog
  let dialogRef: MatDialogRef<TestDialogComponent>
  let dialogOpen: jasmine.Spy<MatDialog["open"]>
  let testCategories: Category[]

  beforeEach(() => {
    testCategories = [
      { id: 1, image: "/images/1.png", removable: false, title: "Pizza" },
      { id: 2, image: "/images/2.png", removable: true, title: "Burgers" },
    ]

    serviceSpy = jasmine.createSpyObj("CategoryService", [
      "getAll",
      "remove",
      "updateImage",
    ])
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

  it("should render categories cards", () => {
    component.categories = testCategories
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

  describe("getAll()", () => {
    it("should call getAll from CategoryService and update component's state", () => {
      serviceSpy.getAll.and.returnValue(of(testCategories))
      component.getAll()
      expect(serviceSpy.getAll).toHaveBeenCalled()
      expect(component.categories).toEqual(testCategories)
    })
  })

  describe("openDialog()", () => {
    let dialogOptions: CategoryDialogData[]

    beforeEach(() => {
      dialogOptions = [{ mode: "create" }, { mode: "edit", category: testCategories[0] }]
    })

    it("should call dialog open with provided options and default settings", () => {
      for (const opt of dialogOptions) {
        component.openDialog(opt)
        expect(dialogOpen).toHaveBeenCalledWith(CategoryDialogComponent, {
          data: opt,
        })
      }
    })

    describe("after closed", () => {
      it("should update categories if dialog was closed with 'true'", async () => {
        const getAll = spyOn(component, "getAll")

        for (const opt of dialogOptions) {
          component.openDialog(opt)
          dialogRef.close(true)
          detectChanges()
          await fixture.whenStable()
        }
        detectChanges()
        expect(getAll).toHaveBeenCalledTimes(dialogOptions.length)
      })

      it("should not update categories if dialog was close with 'false'", async () => {
        fixture.detectChanges()
        const getAll = spyOn(component, "getAll")

        for (const opt of dialogOptions) {
          component.openDialog(opt)
          dialogRef.close(false)
          detectChanges()
          await fixture.whenStable()
        }
        expect(getAll).not.toHaveBeenCalled()
      })
    })
  })

  describe("create()", () => {
    it("should call dialog open", () => {
      const spy = spyOn(component, "openDialog")
      queryAddBtn().click()
      expect(spy).toHaveBeenCalledOnceWith({ mode: "create" })
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

    it("should call service's remove method", async () => {
      const cat = { ...testCategories[0], removable: true }
      serviceSpy.remove.and.returnValue(of(cat))

      component.remove(cat)
      dialogRef.close(true)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(serviceSpy.remove).toHaveBeenCalledOnceWith(cat.id)
    })

    it("should not call dialog open if category isn't removable", () => {
      const category = { ...testCategories[0], removable: false }
      component.remove(category)
      expect(dialogOpen).not.toHaveBeenCalled()
    })

    it("should refresh categories on success", async () => {
      const category = { ...testCategories[0], removable: true }
      serviceSpy.remove.and.returnValue(of(category))

      fixture.detectChanges()
      const getAll = spyOn(component, "getAll")

      component.remove(category)
      dialogRef.close(true)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(getAll).toHaveBeenCalled()
    })

    it("should not refresh categories on cancel", async () => {
      const category = { ...testCategories[0], removable: true }
      fixture.detectChanges()
      const getAll = spyOn(component, "getAll")

      component.remove(category)
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
        expect(updateImage).toHaveBeenCalledWith(i + 1, file)
      })
    })

    it("should call service's updateImage", () => {
      serviceSpy.updateImage.and.returnValue(of("123"))
      component.updateImage(5, image)
      expect(serviceSpy.updateImage).toHaveBeenCalledWith(5, image)
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
    return nativeEl.querySelector("[data-test='add-category-btn']") as HTMLButtonElement
  }
})

@Component({
  template: "",
})
class TestDialogComponent {}
