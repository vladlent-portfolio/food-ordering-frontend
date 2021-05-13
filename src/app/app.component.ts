import { Component, OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import { selectIsLoading, selectIsLoggedIn } from "./store/selectors"
import { AppState } from "./store/reducers"
import { delay } from "rxjs/operators"
import { MatDialog } from "@angular/material/dialog"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"
import { UserService } from "./services/user.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // Scheduler is needed to prevent ExpressionChangedAfterItHasBeenCheckedError from Angular.
  isLoading$ = this.store.select(selectIsLoading).pipe(delay(0))
  isLoggedIn$ = this.store.select(selectIsLoggedIn)

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {}

  openDialog() {
    this.dialog.open(LoginDialogComponent)
  }

  signOut() {
    this.userService.signOut().subscribe()
  }
}
