import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
