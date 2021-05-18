import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core"

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
  @Input() removable = false

  @Output() upload = new EventEmitter<File>()

  constructor() {}

  ngOnInit(): void {}
}
