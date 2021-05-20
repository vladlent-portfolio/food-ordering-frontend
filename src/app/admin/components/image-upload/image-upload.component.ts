import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core"

export enum ImageUploadError {
  Size = "Size",
  Type = "Type",
}

@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  private _error: ImageUploadError | string | undefined
  @Input() title: string | undefined
  @Input() imageSrc: string | undefined

  /** Maximum allowed size of the file in bytes. */
  @Input() maxFileSize = 100 * 1024

  /** An array of accepted filetypes.
   * If this value is falsy - all types will be accepted */
  @Input() acceptedTypes: string[] | null = ["image/png", "image/jpeg"]

  /** Time in milliseconds for error message to be visible.
   * Zero or less equals forever. */
  @Input() errorTimeout = 1500
  @Input()
  set error(err: ImageUploadError | string | undefined) {
    this.setError(err)
  }
  get error() {
    return this._error
  }

  @Output() upload = new EventEmitter<File>()

  readonly errorType = ImageUploadError

  constructor(private cdRef: ChangeDetectorRef) {}

  handleUpload(files: FileList | null) {
    if (!files) {
      return
    }

    const file = files[0]

    if (file.size > this.maxFileSize) {
      this.error = ImageUploadError.Size
      return
    }

    if (this.acceptedTypes && !this.acceptedTypes.includes(file.type)) {
      this.error = ImageUploadError.Type
      return
    }

    this.upload.emit(file)
    this.generatePreview(file)
  }

  generatePreview(file: File) {
    const reader = new FileReader()

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        this.imageSrc = reader.result
        this.cdRef.detectChanges()
      }
    })

    reader.readAsDataURL(file)
  }

  private setError(err: ImageUploadComponent["error"]) {
    this._error = err

    if (err && this.errorTimeout > 0) {
      setTimeout(() => {
        this._error = undefined
        this.cdRef.detectChanges()
      }, this.errorTimeout)
    }
  }
}
