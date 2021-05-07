import { Component, OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import { selectIsLoading } from "./store/selectors"
import { AppState } from "./store/reducers"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isLoading$ = this.store.select(selectIsLoading)
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
