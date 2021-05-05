import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"
import { pages } from "../../admin-routing.module"

// Main purpose of this component is to resolve circular dependency between
// AdminComponent and AdminRoutingModule
@Component({
  selector: "app-admin-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavComponent implements OnInit {
  links = pages

  constructor() {}

  ngOnInit(): void {}
}
