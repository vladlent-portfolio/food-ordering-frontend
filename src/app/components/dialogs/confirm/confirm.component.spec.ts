import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ConfirmDialogComponent, ConfirmDialogData } from "./confirm.component"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"

describe("ConfirmComponent", () => {
  let component: ConfirmDialogComponent
  let fixture: ComponentFixture<ConfirmDialogComponent>
  let nativeEl: HTMLElement
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>
  let initData: ConfirmDialogData

  beforeEach(() => {
    initData = {}
    dialogRef = jasmine.createSpyObj("MatDialogRef", ["close"])

    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: initData },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should have default values", () => {
    Object.entries(component.data).forEach(([key, value]) => {
      expect(value).toBeDefined(`expected ${key} to be defined`)
    })
  })

  it("should toggle title", () => {
    fixture.detectChanges()
    expect(queryTitle().textContent).toContain(component.data.title)

    component.data.title = null
    fixture.detectChanges()
    expect(queryTitle()).toBeNull()
  })

  it("should toggle content", () => {
    fixture.detectChanges()
    expect(queryContent().textContent).toContain(component.data.content)

    component.data.content = null
    fixture.detectChanges()
    expect(queryContent()).toBeNull()
  })

  it("should merge options on init", () => {
    Object.assign(initData, {
      type: "confirm",
      title: "New title",
      content: "Important content",
      confirmBtnText: "YES!",
      cancelBtnText: "no",
    })

    component.ngOnInit()
    expect(component.data).toEqual(initData as any)
  })

  describe("Confirm button", () => {
    it("should close dialog with 'true'", () => {
      fixture.detectChanges()
      queryConfirmBtn().click()
      expect(dialogRef.close).toHaveBeenCalledWith(true)
    })
  })

  describe("Cancel button", () => {
    it("should close dialog with 'false'", () => {
      fixture.detectChanges()
      queryCancelBtn().click()
      expect(dialogRef.close).toHaveBeenCalledWith(false)
    })
  })

  function queryTitle() {
    return nativeEl.querySelector("[data-test='confirm-dialog-title']") as HTMLElement
  }

  function queryContent() {
    return nativeEl.querySelector("[data-test='confirm-dialog-content']") as HTMLElement
  }

  function queryCancelBtn() {
    return nativeEl.querySelector(
      "[data-test='confirm-dialog-cancel']",
    ) as HTMLButtonElement
  }

  function queryConfirmBtn() {
    return nativeEl.querySelector("[data-test='confirm-dialog-ok']") as HTMLButtonElement
  }
})
