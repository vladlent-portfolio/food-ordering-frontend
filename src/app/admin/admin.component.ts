import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"
import { Store } from "@ngrx/store"
import { AppState } from "../store/reducers"
import { selectIsSmallScreen } from "../store/selectors"

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent implements OnInit {
  isSmallScreen$ = this.store.select(selectIsSmallScreen)

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
