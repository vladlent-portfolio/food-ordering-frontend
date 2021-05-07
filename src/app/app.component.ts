import { Component, OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import { selectIsLoading } from "./store/selectors"
import { AppState } from "./store/reducers"
import { observeOn } from "rxjs/operators"
import { asyncScheduler } from "rxjs"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // Async scheduler is needed to prevent ExpressionChangedAfterItHasBeenCheckedError from Angular.
  isLoading$ = this.store.select(selectIsLoading).pipe(observeOn(asyncScheduler))
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
