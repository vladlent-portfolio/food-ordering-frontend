import { Component, OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import { selectIsLoading } from "./store/selectors"
import { AppState } from "./store/reducers"
import { observeOn } from "rxjs/operators"
import { asapScheduler } from "rxjs"
import { MatDialog } from "@angular/material/dialog"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // Scheduler is needed to prevent ExpressionChangedAfterItHasBeenCheckedError from Angular.
  isLoading$ = this.store.select(selectIsLoading).pipe(observeOn(asapScheduler))
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit() {}

  openDialog() {
    this.dialog.open(LoginDialogComponent)
  }
}
