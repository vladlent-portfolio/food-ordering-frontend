import { Component, HostListener, OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import {
  selectCart,
  selectIsAdmin,
  selectIsLoading,
  selectIsLoggedIn,
} from "./store/selectors"
import { AppState } from "./store/reducers"
import { delay, filter, map, take } from "rxjs/operators"
import { MatDialog } from "@angular/material/dialog"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"
import { UserService } from "./services/user.service"
import { NavigationEnd, Router } from "@angular/router"
import { CartDialogComponent } from "./components/dialogs/cart/cart.component"
import { replaceCart } from "./store/actions"
import { asapScheduler } from "rxjs"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Food Ordering App"
  adminTitle = "Food Ordering App Admin"

  // 'delay' is needed to prevent ExpressionChangedAfterItHasBeenCheckedError from Angular.
  isLoading$ = this.store.select(selectIsLoading).pipe(delay(0, asapScheduler))
  isLoggedIn$ = this.store.select(selectIsLoggedIn)
  isAdmin$ = this.store.select(selectIsAdmin)
  isAdminRoute$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e: NavigationEnd) => e.url.includes("/admin")),
  )
  totalCartQuantity$ = this.store
    .select(selectCart)
    .pipe(map(cart => Object.values(cart).reduce((acc, d) => acc + d.quantity, 0)))

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.checkAuth()
    this.restoreCart()
  }

  @HostListener("window:beforeunload")
  saveCart() {
    this.store
      .select(selectCart)
      .pipe(take(1))
      .subscribe(cart => {
        localStorage.setItem("cart", JSON.stringify(cart))
      })
  }

  checkAuth() {
    this.userService.me().subscribe()
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent)
  }

  openCartDialog() {
    this.dialog.open(CartDialogComponent)
  }

  restoreCart() {
    const cart = localStorage.getItem("cart")

    if (cart) {
      this.store.dispatch(replaceCart({ cart: JSON.parse(cart) }))
    }
  }

  signOut() {
    this.userService.signOut().subscribe({
      complete: () => {
        if (this.router.url.includes("/admin")) {
          this.router.navigateByUrl("/")
        }
      },
    })
  }
}
