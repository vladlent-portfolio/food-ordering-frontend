import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from "@angular/core"
import { ImageUploadComponent } from "../image-upload/image-upload.component"

@Component({
  selector: "app-admin-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCardComponent implements OnInit {
  @Input() title: string | undefined
  @Input() subtitle: string | undefined
  @Input() imageSrc: string | undefined
  @Input() acceptedImageTypes: ImageUploadComponent["acceptedTypes"] = null
  @Input() removable = false
  @Input() subtitleTemplate: TemplateRef<any> | undefined

  @Output() upload = new EventEmitter<File>()
  @Output() edit = new EventEmitter<void>()
  @Output() remove = new EventEmitter<void>()

  constructor() {}

  ngOnInit(): void {}
}
