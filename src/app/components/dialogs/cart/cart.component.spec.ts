import { ComponentFixture, TestBed } from "@angular/core/testing"
import { CartDialogComponent } from "./cart.component"
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { Cart, CartItem } from "../../../store/reducers"
import { MatButtonModule } from "@angular/material/button"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { NgLetModule } from "@ngrx-utils/store"
import { clearCart, removeDishFromCart } from "../../../store/actions"
import { OrderService } from "../../../services/order.service"
import { of } from "rxjs"
import { MatIconModule } from "@angular/material/icon"
import { LoginDialogComponent } from "../login/login.component"
import { Component } from "@angular/core"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { MatTableModule } from "@angular/material/table"

describe("CartDialogComponent", () => {
  let component: CartDialogComponent
  let fixture: ComponentFixture<CartDialogComponent>
  let nativeEl: HTMLElement
  let store: MockStore
  let orderServiceSpy: jasmine.SpyObj<OrderService>
  let dialog: MatDialog
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CartDialogComponent>>
  let dummyDialogRef: MatDialogRef<DummyDialogComponent>
  let dialogOpen: jasmine.Spy<MatDialog["open"]>
  let cart: Cart

  beforeEach(() => {
    orderServiceSpy = jasmine.createSpyObj("OrderService", ["create"])
    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])

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
      imports: [
        MatDialogModule,
        MatButtonModule,
        NgLetModule,
        MatIconModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
      declarations: [CartDialogComponent, DummyDialogComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        provideMockStore({ initialState: { cart: {} } }),
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    store = TestBed.inject(MockStore)

    dialog = TestBed.inject(MatDialog)
    dummyDialogRef = dialog.open(DummyDialogComponent, { hasBackdrop: false })
    dialogOpen = spyOn(dialog, "open").and.returnValue(dummyDialogRef)
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
      let items: CartItem[]

      beforeEach(() => {
        items = Object.values(cart)
        store.setState({ cart })
        fixture.detectChanges()
      })

      it("should have a row for each order", () => {
        const rows = queryTableRows()
        expect(rows.length).toBe(items.length)

        rows.forEach((row, i) => {
          const { dish, quantity } = items[i]

          const img = row.querySelector("img")
          expect(img).not.toBeNull("expected row to have image of a dish")
          expect(img?.src).toContain(dish.image)
          expect(img?.alt).toContain(dish.title)

          expect(row.textContent).toContain(dish.title)
          expect(row.textContent).toContain("$" + (dish.price * quantity).toFixed(2))
          expect(row.textContent).toContain(quantity)

          expect(queryRemoveItemBtn(row)).not.toBeNull(
            `expected row #${i + 1} to have 'Remove item from cart' button`,
          )
        })
      })

      it("should have a footer row with total price of the order", () => {
        const tfoot = nativeEl.querySelector("[data-test='cart-table-footer']")
        expect(tfoot).not.toBeNull()

        const total = items.reduce(
          (acc, { quantity, dish }) => acc + quantity * dish.price,
          0,
        )

        expect(tfoot?.textContent).toContain("Total")
        expect(tfoot?.textContent).toContain("$" + total.toFixed(2))
      })

      describe("'Remove item from cart' button", () => {
        it("should remove item from orders on click", () => {
          const dispatch = spyOn(store, "dispatch")

          queryTableRows().forEach((row, i) => {
            const item = items[i]
            queryRemoveItemBtn(row).click()
            expect(dispatch).toHaveBeenCalledWith(
              removeDishFromCart({ dish: item.dish, amount: item.quantity }),
            )
          })
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

      it("should call component's checkout method with cart items", () => {
        const checkout = spyOn(component, "checkout")
        queryCheckoutBtn().click()
        expect(checkout).toHaveBeenCalledWith(Object.values(cart))
      })
    })
  })

  describe("checkout()", () => {
    let items: CartItem[]

    beforeEach(() => {
      orderServiceSpy.create.and.returnValue(of({} as any))
      items = Object.values(cart)
    })

    it("should not create order if cart is empty", () => {
      component.checkout([])
      expect(orderServiceSpy.create).not.toHaveBeenCalled()
    })

    describe("user authorized", () => {
      beforeEach(() => {
        store.setState({ user: {} })
      })

      it("should create order with provided items", () => {
        component.checkout(items)
        expect(orderServiceSpy.create).toHaveBeenCalledWith(
          items.map(({ dish, quantity }) => ({ id: dish.id, quantity: quantity })),
        )
      })

      it("should not open login dialog", () => {
        component.checkout(items)
        expect(dialogOpen).not.toHaveBeenCalled()
      })

      describe("on success", () => {
        it("should close dialog", () => {
          component.checkout(items)
          expect(dialogRefSpy.close).toHaveBeenCalledTimes(1)
        })

        it("should clear cart", () => {
          const dispatch = spyOn(store, "dispatch")
          component.checkout(items)
          expect(dialogRefSpy.close).toHaveBeenCalledBefore(dispatch)
          expect(dispatch).toHaveBeenCalledWith(clearCart())
        })
      })
    })

    describe("user unauthorized", () => {
      it("should open login dialog", () => {
        component.checkout(items)
        expect(dialogOpen).toHaveBeenCalledWith(LoginDialogComponent)
        expect(orderServiceSpy.create).not.toHaveBeenCalled()
      })

      it("should continue checkout if user successfully authorizes", async () => {
        component.checkout(items)
        dummyDialogRef.close(true)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(orderServiceSpy.create).toHaveBeenCalledWith(
          items.map(({ dish, quantity }) => ({ id: dish.id, quantity: quantity })),
        )
      })

      it("should not continue checkout if user closes login dialog", async () => {
        component.checkout(items)
        dummyDialogRef.close(false)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(orderServiceSpy.create).not.toHaveBeenCalled()
        expect(dialogRefSpy.close).not.toHaveBeenCalled()
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

  function queryRemoveItemBtn(row: HTMLElement) {
    return row.querySelector("[data-test='cart-dialog-remove-item-btn']") as HTMLElement
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

@Component({
  template: "",
})
class DummyDialogComponent {}
