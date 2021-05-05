import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
