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
    let btn = nativeEl.querySelector<HTMLButtonElement>(".card__remove")

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

  function queryUploadComponent() {
    return fixture.debugElement.query(By.directive(ImageUploadComponent))
      .componentInstance as ImageUploadComponent
  }
})

@Component({
  template: `<app-admin-card
    [imageSrc]="imageSrc"
    [title]="title"
    [subtitle]="subtitle"
    [removable]="removable"
    (upload)="uploadedImage = $event"
  ></app-admin-card>`,
})
class TestHostComponent {
  imageSrc: AdminCardComponent["imageSrc"]
  title: AdminCardComponent["title"]
  subtitle: AdminCardComponent["subtitle"]
  removable = false
  uploadedImage: File | undefined
}
