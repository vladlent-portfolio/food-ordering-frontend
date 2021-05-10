import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from "@angular/core/testing"

import { ImageUploadComponent } from "./image-upload.component"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { Component } from "@angular/core"

describe("ImageUploadComponent", () => {
  let fixture: ComponentFixture<TestHostComponent>
  let component: TestHostComponent
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule],
      declarations: [TestHostComponent, ImageUploadComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should change title", () => {
    component.title = "Title"
    fixture.detectChanges()
    expect(queryTitle()?.textContent?.trim()).toBe("Title")
    component.title = "New Title"
    fixture.detectChanges()
    expect(queryTitle()?.textContent?.trim()).toBe("New Title")
  })

  it("should add 'has-image' class to img container if imageSrc isn't empty", () => {
    expect(queryImgContainer()?.classList.contains("has-image")).toBeFalse()
    component.imageSrc = "/image1.png"
    fixture.detectChanges()
    expect(queryImgContainer()?.classList.contains("has-image")).toBeTrue()
  })

  it("should toggle img and mat-icon depending on imageSrc", () => {
    fixture.detectChanges()
    expect(queryIcon()).not.toBeNull()
    expect(queryImg()).toBeNull()
    component.imageSrc = "/image1.png"
    fixture.detectChanges()
    expect(queryIcon()).toBeNull()
    expect(queryImg()).not.toBeNull()
  })

  it("should trigger click event on file input, when clicked on upload button", () => {
    const btn = queryUploadBtn()
    const input = queryFileInput()
    expect(btn).not.toBeNull()
    expect(input).not.toBeNull()

    const spy = spyOn(input, "click")
    btn.click()
    expect(spy).toHaveBeenCalled()
  })

  it(
    "should update img's src and emit uploaded file on upload",
    waitForAsync(() => {
      const input = queryFileInput()
      expect(input).not.toBeNull()

      const blob = new Blob(["123"])
      const file = new File([blob], "fakeimage.png", { type: "image/png" })
      const fileList = new DataTransfer()
      fileList.items.add(file)

      input.files = fileList.files
      input.dispatchEvent(new Event("change"))
      fixture.detectChanges()

      // Waiting for FileReader to finish loading our file
      setTimeout(() => {
        expect(queryImg()).not.toBeNull()
        expect(queryImg()?.src).toContain("data:image/png;base64")

        expect(component.uploadedFile).toEqual(file)
      }, 0)
    }),
  )

  it('file input should have a non-empty "accept" field', () => {
    fixture.detectChanges()
    expect(queryFileInput()?.accept.trim()).not.toBe("")
  })

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }

  function queryImgContainer() {
    return nativeEl.querySelector(".img-container")
  }

  function queryImg() {
    return nativeEl.querySelector("img")
  }

  function queryIcon() {
    return nativeEl.querySelector("mat-icon")
  }

  function queryUploadBtn() {
    return nativeEl.querySelector(".upload-btn") as HTMLButtonElement
  }

  function queryFileInput() {
    return nativeEl.querySelector(".upload-input") as HTMLInputElement
  }
})

@Component({
  template: `<app-image-upload
    [title]="title"
    [imageSrc]="imageSrc"
    (upload)="uploadedFile = $event"
  ></app-image-upload>`,
})
class TestHostComponent {
  title = ""
  imageSrc = ""
  uploadedFile: File | undefined
}
