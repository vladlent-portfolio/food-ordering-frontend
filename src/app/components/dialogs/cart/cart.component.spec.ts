import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CartDialogComponent } from "./cart.component"
import { MatDialogModule } from "@angular/material/dialog"
import { Cart } from "../../../store/reducers"
import { MatButtonModule } from "@angular/material/button"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { NgLetModule } from "@ngrx-utils/store"

describe("CartDialogComponent", () => {
  // @ts-ignore
  let component: CartDialogComponent
  let fixture: ComponentFixture<CartDialogComponent>
  let nativeEl: HTMLElement
  let store: MockStore
  let cart: Cart

  beforeEach(() => {
    cart = {
      3: {
        dish: {
          id: 3,
          title: "Crunchy Cashew Salad",
          price: 3.22,
          image: "/dishes/2.png",
          removable: true,
          category_id: 1,
          category: {
            id: 1,
            title: "Salads",
            removable: false,
            image: "/categories/1.png",
          },
        },
        quantity: 8,
      },
      7: {
        dish: {
          id: 7,
          title: "Margherita",
          price: 4.2,
          image: "/dishes/1.png",
          removable: false,
          category_id: 3,
          category: {
            id: 3,
            title: "Pizza",
            removable: true,
            image: "/categories/3.jpg",
          },
        },
        quantity: 23,
      },
    }

    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatButtonModule, NgLetModule],
      declarations: [CartDialogComponent],
      providers: [provideMockStore({ initialState: { cart: {} } })],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    store = TestBed.inject(MockStore)
  })

  it("should have title", () => {
    fixture.detectChanges()
    const title = queryTitle()
    expect(title).not.toBeNull()
    expect(title.textContent).toContain("Shopping Cart")
  })

  describe("dialog content", () => {
    it("should show 'empty cart' if provided cart is empty or falsy", () => {
      fixture.detectChanges()
      expect(queryTable()).toBeNull()

      const emptyCart = queryEmptyCart()
      expect(emptyCart).not.toBeNull()
      expect(emptyCart.textContent).toContain("Cart is empty")

      const img = emptyCart.querySelector("img")
      expect(img).not.toBeNull("expected empty cart block to have an image")
      expect(img?.src.trim()).not.toBe(
        "",
        "expected empty cart image to have a non empty src",
      )
      expect(img?.alt.trim()).not.toBe(
        "",
        "expected empty cart image to have a non empty alt",
      )
    })

    it("should show orders table if cart isn't empty", () => {
      store.setState({ cart })
      fixture.detectChanges()
      expect(queryEmptyCart()).toBeNull()
      expect(queryTable()).not.toBeNull()
    })

    describe("orders table", () => {
      beforeEach(() => {
        store.setState({ cart })
        fixture.detectChanges()
      })

      it("should have a row for each order", () => {
        const items = Object.values(cart)
        const rows = queryTableRows()
        expect(rows.length).toBe(items.length)

        rows.forEach((row, i) => {
          const { dish, quantity } = items[i]

          const img = row.querySelector("img")
          expect(img).not.toBeNull()
          expect(img?.src).toContain(dish.image)
          expect(img?.alt).toContain(dish.title)

          expect(row.textContent).toContain(dish.title)
          expect(row.textContent).toContain("$" + (dish.price * quantity).toFixed(2))
          expect(row.textContent).toContain(quantity)
        })
      })
    })
  })

  describe("dialog actions", () => {
    beforeEach(() => {
      store.setState({ cart })
      fixture.detectChanges()
    })

    it("should be visible if cart isn't empty", () => {
      expect(queryActions()).not.toBeNull()

      store.setState({ cart: {} })
      fixture.detectChanges()
      expect(queryActions()).toBeNull()
    })

    it("should have checkout button", () => {
      expect(queryCheckoutBtn()).not.toBeNull()
    })

    describe("checkout button", () => {
      it("should have label", () => {
        expect(queryCheckoutBtn().textContent).toContain("Checkout")
      })
    })
  })

  function queryTitle() {
    return nativeEl.querySelector("[data-test='cart-dialog-title']") as HTMLElement
  }

  function queryTable() {
    return nativeEl.querySelector("[data-test='cart-dialog-orders']") as HTMLElement
  }

  function queryTableRows(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='cart-dialog-row']")
  }

  function queryEmptyCart() {
    return nativeEl.querySelector("[data-test='cart-dialog-empty']") as HTMLElement
  }

  function queryActions() {
    return nativeEl.querySelector("[data-test='cart-dialog-actions']") as HTMLElement
  }

  function queryCheckoutBtn() {
    return nativeEl.querySelector("[data-test='cart-dialog-checkout-btn']") as HTMLElement
  }
})
