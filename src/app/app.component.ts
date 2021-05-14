import { Component, OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import { selectIsAdmin, selectIsLoading, selectIsLoggedIn } from "./store/selectors"
import { AppState } from "./store/reducers"
import { delay, filter, map } from "rxjs/operators"
import { MatDialog } from "@angular/material/dialog"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"
import { UserService } from "./services/user.service"
import { NavigationEnd, Router } from "@angular/router"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Food Ordering App"
  adminTitle = "Food Ordering App Admin"

  // 'delay' is needed to prevent ExpressionChangedAfterItHasBeenCheckedError from Angular.
  isLoading$ = this.store.select(selectIsLoading).pipe(delay(0))
  isLoggedIn$ = this.store.select(selectIsLoggedIn)
  isAdmin$ = this.store.select(selectIsAdmin)
  isAdminRoute$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e: NavigationEnd) => e.url.includes("/admin")),
  )

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.checkAuth()
  }

  checkAuth() {
    this.userService.me().subscribe()
  }

  openDialog() {
    this.dialog.open(LoginDialogComponent)
  }

  signOut() {
    this.userService.signOut().subscribe()
  }
}
