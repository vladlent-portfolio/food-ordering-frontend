import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
