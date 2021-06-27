import { ComponentFixture, TestBed } from "@angular/core/testing"

import { DishAddedComponent } from "./dish-added.component"
import { Dish } from "../../../models/models"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"

describe("DishAddedComponent", () => {
  // let component: DishAddedComponent
  let fixture: ComponentFixture<DishAddedComponent>
  let nativeEl: HTMLElement
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>
  let dish: Dish = {
    id: 2,
    title: "Crunchy Cashew Salad",
    price: 3.22,
    image: "/dishes/2.png",
    removable: true,
    category_id: 1,
    category: { id: 1, title: "Salads", removable: false, image: "/categories/1.png" },
  }

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj("MatDialog", ["close"])

    TestBed.configureTestingModule({
      declarations: [DishAddedComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dish },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DishAddedComponent)
    // component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should have an image of a dish", () => {
    fixture.detectChanges()
    const image = queryImage()
    expect(image).not.toBeNull("expected dish image to exist")
    expect(image.src).toContain(dish.image!, "expected dish image to have a valid src")
    expect(image.alt.toLowerCase()).toContain(`image of ${dish.title}`.toLowerCase())
  })

  it("should have a message with dish title", () => {
    fixture.detectChanges()
    const msg = queryMsg()
    expect(msg).not.toBeNull("expected txt message to exist")
    expect(msg.textContent).toContain(`${dish.title} was added to the Cart`)
  })

  it("should have a close button", () => {
    fixture.detectChanges()
    const btn = queryCloseBtn()
    expect(btn).not.toBeNull("expected close button to exist")
    btn.click()
    expect(dialogRefSpy.close).toHaveBeenCalled()
  })

  function queryImage() {
    return nativeEl.querySelector("[data-test='dish-added-image']") as HTMLImageElement
  }

  function queryMsg() {
    return nativeEl.querySelector("[data-test='dish-added-msg']") as HTMLElement
  }

  function queryCloseBtn() {
    return nativeEl.querySelector("[data-test='dish-added-close-btn']") as HTMLElement
  }
})
