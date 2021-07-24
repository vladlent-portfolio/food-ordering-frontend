import { Component, OnInit, TrackByFunction } from "@angular/core"
import { AppState, CartItem } from "../../../store/reducers"
import { Store } from "@ngrx/store"
import { selectCart, selectIsLoggedIn } from "../../../store/selectors"
import { filter, map, switchMap, take } from "rxjs/operators"
import { clearCart, setDishQuantity } from "../../../store/actions"
import { OrderService } from "../../../services/order.service"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { of } from "rxjs"
import { LoginDialogComponent } from "../login/login.component"
import { OrderPlacedComponent } from "../order-placed/order-placed.component"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartDialogComponent implements OnInit {
  columns = ["img", "items", "quantity", "price", "btn"]
  cartItems$ = this.store
    .select(selectCart)
    .pipe(map(cart => (cart ? Object.values(cart) : [])))
  isUserLoggedIn$ = this.store.select(selectIsLoggedIn)

  constructor(
    private dialogRef: MatDialogRef<CartDialogComponent>,
    private store: Store<AppState>,
    private orderService: OrderService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  isCartEmpty(items: CartItem[]) {
    return !items || items.length === 0
  }

  setDishQuantity(item: CartItem, quantity: number) {
    this.store.dispatch(setDishQuantity({ id: item.dish.id, quantity }))
  }

  checkout(items: CartItem[]) {
    if (this.isCartEmpty(items)) return

    this.isUserLoggedIn$
      .pipe(
        take(1),
        switchMap(isLoggedIn =>
          isLoggedIn ? of(true) : this.dialog.open(LoginDialogComponent).afterClosed(),
        ),
        filter(Boolean),
        switchMap(() =>
          this.orderService.create(
            items.map(({ dish, quantity }) => ({ id: dish.id, quantity })),
          ),
        ),
      )
      .subscribe(order => {
        this.dialogRef.close()
        this.dialog.open(OrderPlacedComponent, { data: order })
        this.store.dispatch(clearCart())
      })
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((acc, { dish, quantity }) => acc + dish.price * quantity, 0)
  }

  trackBy: TrackByFunction<CartItem> = (_, item) => item.dish.id
}
