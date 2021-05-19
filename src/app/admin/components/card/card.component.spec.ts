import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AdminCardComponent } from "./card.component"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { Component } from "@angular/core"
import { ImageUploadComponent } from "../image-upload/image-upload.component"
import { By } from "@angular/platform-browser"

const image = new File([new Blob(["image"])], "file.jpeg", { type: "image/jpeg" })
describe("CardComponent", () => {
  let component: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule],
      declarations: [AdminCardComponent, TestHostComponent, ImageUploadComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    fixture.detectChanges()
  })

  it("should have title and subtitle in card content", () => {
    const title = "Card Title"
    const subtitle = "Card subtitle"
    component.title = title
    component.subtitle = subtitle
    fixture.detectChanges()

    const contentEl = nativeEl.querySelector(".card__content")

    if (expect(contentEl).not.toBeNull("expected card content to exist") && contentEl) {
      const titleEl = contentEl.querySelector(".card__title")
      const subtitleEl = contentEl.querySelector(".card__subtitle")

      expect(titleEl?.textContent).toContain(title)
      expect(subtitleEl?.textContent).toContain(subtitle)
    }
  })

  it("should show image upload component", () => {
    fixture.detectChanges()
    expect(nativeEl.querySelector("app-image-upload")).not.toBeNull()
  })

  it("should toggle Remove btn disable state based on removable prop", () => {
    component.removable = false
    fixture.detectChanges()
    let btn = queryEditBtn()

    if (expect(btn).not.toBeNull("expected Remove btn to be in the DOM") && btn) {
      expect(btn.disabled).toBeFalse()

      component.removable = true
      fixture.detectChanges()

      expect(btn.disabled).toBeTrue()
    }
  })

  it("should emit upload event", () => {
    queryUploadComponent().upload.emit(image)
    fixture.detectChanges()
    expect(component.uploadedImage).toEqual(image)
  })

  it("should emit edit event", () => {
    const edit = spyOn(component, "edit")
    queryEditBtn().click()
    expect(edit).toHaveBeenCalled()
  })

  it("should remove edit event", () => {
    const remove = spyOn(component, "remove")
    component.removable = true
    fixture.detectChanges()
    queryRemoveBtn().click()
    expect(remove).toHaveBeenCalled()
  })

  function queryUploadComponent() {
    return fixture.debugElement.query(By.directive(ImageUploadComponent))
      .componentInstance as ImageUploadComponent
  }

  function queryEditBtn() {
    return nativeEl.querySelector("[data-test='edit-btn']") as HTMLButtonElement
  }

  function queryRemoveBtn() {
    return nativeEl.querySelector("[data-test='remove-btn']") as HTMLButtonElement
  }
})

@Component({
  template: `<app-admin-card
    [imageSrc]="imageSrc"
    [title]="title"
    [subtitle]="subtitle"
    [removable]="removable"
    (upload)="uploadedImage = $event"
    (edit)="edit()"
    (remove)="remove()"
  ></app-admin-card>`,
})
class TestHostComponent {
  imageSrc: AdminCardComponent["imageSrc"]
  title: AdminCardComponent["title"]
  subtitle: AdminCardComponent["subtitle"]
  removable = false
  uploadedImage: File | undefined

  edit() {}

  remove() {}
}
