import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
