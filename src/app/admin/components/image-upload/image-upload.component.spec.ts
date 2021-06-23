import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing"
import { ImageUploadComponent, ImageUploadError } from "./image-upload.component"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { Component } from "@angular/core"
import { By } from "@angular/platform-browser"

describe("ImageUploadComponent", () => {
  let fixture: ComponentFixture<TestHostComponent>
  let host: TestHostComponent
  let component: ImageUploadComponent
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule],
      declarations: [TestHostComponent, ImageUploadComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    host = fixture.componentInstance
    nativeEl = fixture.nativeElement
    component = fixture.debugElement.query(By.directive(ImageUploadComponent))
      .componentInstance
  })

  it("should change title", () => {
    host.title = undefined
    expect(queryTitle()).toBeNull()
    host.title = "   "
    expect(queryTitle()).toBeNull()
    host.title = "Title"
    fixture.detectChanges()
    expect(queryTitle()?.textContent?.trim()).toBe("Title")
    host.title = "New Title"
    fixture.detectChanges()
    expect(queryTitle()?.textContent?.trim()).toBe("New Title")
  })

  it("should add 'has-image' class to img container if imageSrc isn't empty", () => {
    expect(queryImgContainer()?.classList.contains("has-image")).toBeFalse()
    host.imageSrc = "/image1.png"
    fixture.detectChanges()
    expect(queryImgContainer()?.classList.contains("has-image")).toBeTrue()
  })

  it("should toggle img and mat-icon depending on imageSrc", () => {
    fixture.detectChanges()
    expect(queryIcon()).not.toBeNull()
    expect(queryImg()).toBeNull()
    host.imageSrc = "/image1.png"
    fixture.detectChanges()
    expect(queryIcon()).toBeNull()

    const img = queryImg()
    if (expect(img).not.toBeNull()) {
      expect(queryImg().loading).toBe("lazy")
    }
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

  it("file input should have accept property that all accepted types", () => {
    const types = ["image/png", "application/json", "image/jpeg", "application/pdf"]
    host.acceptedTypes = types
    fixture.detectChanges()

    expect(queryFileInput().accept).toEqual(types.join(", "))
  })

  describe("upload", () => {
    it(
      "should update img's src and emit file on upload",
      waitForAsync(() => {
        const file = createImagePNG(30)
        addFileToInput(file)

        // Waiting for FileReader to finish loading our file
        setTimeout(() => {
          expect(queryImg()).not.toBeNull()
          expect(queryImg()?.src).toContain("data:image/png;base64")
          expect(host.uploadedFile).toEqual(file)
        }, 10)
      }),
    )

    describe("should not emit files if uploaded file isn't acceptable", () => {
      afterEach(() => {
        expect(host.uploadedFile).toBeUndefined()
      })

      it("filesize too big", () => {
        host.maxFileSize = 50
        fixture.detectChanges()
        addFileToInput(createImagePNG(100))
        expect(component.error).toEqual(ImageUploadError.Size)
      })

      it("unaccepted type", () => {
        host.acceptedTypes = ["image/png"]
        fixture.detectChanges()
        addFileToInput(createTextFile())
        expect(component.error).toEqual(ImageUploadError.Type)
      })
    })
  })

  describe("errors", () => {
    it("should toggle error messages", () => {
      fixture.detectChanges()
      expect(queryError()).toBeNull()
      expect(queryErrorPlaceholder()).not.toBeNull()
      expect(queryErrorPlaceholder().textContent?.trim()).not.toBe(
        "",
        "error placeholder should have some text",
      )

      const tests: { [Key in keyof typeof ImageUploadError]: string } = {
        Size: `max filesize is ${component.maxFileSize / 1024} kib`,
        Type: "unsupported filetype",
      }

      Object.entries(tests).forEach(([type, msg]) => {
        host.error = type as ImageUploadError
        fixture.detectChanges()
        expect(queryError().textContent?.toLowerCase()).toContain(msg)
        expect(queryErrorPlaceholder()).toBeNull()
      })
    })

    it("should show default error message if error is not in enum", () => {
      const msg = "generic error message"
      host.error = msg
      fixture.detectChanges()
      expect(queryError().textContent).toContain(msg)
    })

    it("should update error and then clear it after timeout", fakeAsync(() => {
      const timeout = 100
      host.errorTimeout = timeout
      fixture.detectChanges()
      host.error = ImageUploadError.Size
      fixture.detectChanges()
      expect(component.error).toEqual(ImageUploadError.Size)
      tick(timeout)
      expect(component.error).toBeUndefined()
      expect(queryError()).toBeNull()
    }))

    it("should not clear error if timeout is not positive", fakeAsync(() => {
      for (let i = 0; i >= -1; i--) {
        host.errorTimeout = i
        host.error = ImageUploadError.Size
        tick(Infinity)
        fixture.detectChanges()
        expect(component.error).toEqual(ImageUploadError.Size)
        host.error = undefined
        fixture.detectChanges()
      }
    }))

    it("should immediately clear error if provided falsy value", fakeAsync(() => {
      component.errorTimeout = 1000
      component.error = "error"
      fixture.detectChanges()
      component.error = undefined
      fixture.detectChanges()
      expect(component.error).toBeUndefined()
      tick(1000)
    }))
  })

  function addFileToInput(file: File) {
    const input = queryFileInput()
    expect(input).not.toBeNull()

    const fileList = new DataTransfer()
    fileList.items.add(file)

    input.files = fileList.files
    input.dispatchEvent(new Event("change"))
    fixture.detectChanges()
  }

  function createTextFile() {
    const blob = new Blob(["hello world"])
    return new File([blob], "hello.txt", { type: "text/plain" })
  }

  function createImagePNG(size: number) {
    const blob = new Blob([new ArrayBuffer(size)])
    return new File([blob], "image.png", { type: "image/png" })
  }

  function queryTitle() {
    return nativeEl.querySelector(".title")
  }

  function queryImgContainer() {
    return nativeEl.querySelector(".img-container")
  }

  function queryImg() {
    return nativeEl.querySelector("img") as HTMLImageElement
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

  function queryError() {
    return nativeEl.querySelector("[data-test='error-msg']") as HTMLElement
  }

  function queryErrorPlaceholder() {
    return nativeEl.querySelector("[data-test='error-placeholder']") as HTMLElement
  }
})

@Component({
  template: `<app-image-upload
    [title]="title"
    [imageSrc]="imageSrc"
    [error]="error"
    [maxFileSize]="maxFileSize"
    [acceptedTypes]="acceptedTypes"
    [errorTimeout]="errorTimeout"
    (upload)="uploadedFile = $event"
  ></app-image-upload>`,
})
class TestHostComponent {
  title: ImageUploadComponent["title"]
  imageSrc: ImageUploadComponent["imageSrc"]
  error: ImageUploadComponent["error"]
  maxFileSize: ImageUploadComponent["maxFileSize"] = 100
  acceptedTypes: ImageUploadComponent["acceptedTypes"] = null
  errorTimeout = 0

  uploadedFile: File | undefined
}
