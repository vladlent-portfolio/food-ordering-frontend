import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"

@Component({
  selector: "app-dishes",
  templateUrl: "./dishes.component.html",
  styleUrls: ["./dishes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishesPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
