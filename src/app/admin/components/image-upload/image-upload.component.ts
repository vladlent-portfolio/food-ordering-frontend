import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core"

@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  @Input() title: string | undefined
  @Input() imageSrc: string | undefined

  @Output() upload = new EventEmitter<File>()

  constructor(private cdRef: ChangeDetectorRef) {}

  handleUpload(files: FileList | null) {
    if (!files) {
      return
    }

    this.upload.emit(files[0])
    this.generatePreview(files[0])
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
}
