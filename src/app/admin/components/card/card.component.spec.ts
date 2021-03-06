import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AdminCardComponent } from "./card.component"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { Component, TemplateRef, ViewChild } from "@angular/core"
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
      const titleEl = queryTitle()
      const subtitleEl = querySubtitle()

      expect(titleEl?.textContent).toContain(title)
      expect(subtitleEl?.textContent).toContain(subtitle)
    }
  })

  it("should show image-upload component", () => {
    fixture.detectChanges()
    expect(nativeEl.querySelector("app-image-upload")).not.toBeNull()
  })

  it("should pass acceptedImageTypes to image-upload component", () => {
    const tests: any[] = [
      ["image/png"],
      ["image/png", "image/webp"],
      null,
      ["image/png", "image/webp", "image/jpg"],
    ]
    const imageUpload = queryUploadComponent()

    for (const test of tests) {
      component.acceptedImageTypes = test
      fixture.detectChanges()
      expect(imageUpload.acceptedTypes).toEqual(test)
    }
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

  describe("subtitle template", () => {
    it("should use default template if it isn't provided by the user", () => {
      fixture.detectChanges()
      component.subtitleTemplate = undefined
      fixture.detectChanges()
      expect(queryUserSubtitle()).toBeNull()
      expect(querySubtitle()).not.toBeNull()
    })

    it("should use user's version if it is provided", () => {
      fixture.detectChanges()
      component.subtitleTemplate = component.mySubtitle
      fixture.detectChanges()
      expect(queryUserSubtitle()).not.toBeNull()
      expect(querySubtitle()).toBeNull()
    })
  })

  function queryTitle() {
    return nativeEl.querySelector("[data-test='card-title']") as HTMLElement
  }

  function querySubtitle() {
    return nativeEl.querySelector("[data-test='card-subtitle']") as HTMLElement
  }

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

  function queryUserSubtitle() {
    return nativeEl.querySelector(".user-subtitle") as HTMLElement
  }
})

@Component({
  template: `<app-admin-card
    [imageSrc]="imageSrc"
    [acceptedImageTypes]="acceptedImageTypes"
    [title]="title"
    [subtitle]="subtitle"
    [removable]="removable"
    [subtitleTemplate]="subtitleTemplate"
    (upload)="uploadedImage = $event"
    (edit)="edit()"
    (remove)="remove()"
  >
    <ng-template #mySubtitle>
      <div class="user-subtitle">
        <p>My subtitle</p>
      </div>
    </ng-template>
  </app-admin-card>`,
})
class TestHostComponent {
  @ViewChild("mySubtitle") mySubtitle: TemplateRef<any> | undefined

  subtitleTemplate: TemplateRef<any> | undefined
  imageSrc: AdminCardComponent["imageSrc"]
  acceptedImageTypes: AdminCardComponent["acceptedImageTypes"] = null
  title: AdminCardComponent["title"]
  subtitle: AdminCardComponent["subtitle"]
  removable = false
  uploadedImage: File | undefined

  edit() {}

  remove() {}
}
