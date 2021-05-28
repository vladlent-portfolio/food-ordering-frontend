import { Component, OnInit } from "@angular/core"
import { AppState, CartItem } from "../../../store/reducers"
import { Store } from "@ngrx/store"
import { selectCart } from "../../../store/selectors"
import { map } from "rxjs/operators"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartDialogComponent implements OnInit {
  cartItems$ = this.store.select(selectCart).pipe(map(cart => Object.values(cart)))

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  isCartEmpty(items: CartItem[]) {
    return !items || items.length === 0
  }
}
