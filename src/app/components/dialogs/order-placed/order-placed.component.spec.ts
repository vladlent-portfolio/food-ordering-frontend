import { ComponentFixture, TestBed } from "@angular/core/testing"

import { OrderPlacedComponent } from "./order-placed.component"
import { Category, Dish, Order, OrderItem, OrderStatus } from "../../../models/models"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"

describe("OrderPlacedComponent", () => {
  // let component: OrderPlacedComponent
  let fixture: ComponentFixture<OrderPlacedComponent>
  let nativeEl: HTMLElement
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<OrderPlacedComponent>>
  let dishes: Dish[]
  let categories: Category[]
  let orders: Order[]
  let order: Order

  beforeEach(() => {
    categories = [
      { id: 1, title: "Salads", removable: false, image: "/categories/1.png" },
      { id: 3, title: "Pizza", removable: true, image: "/categories/3.jpg" },
    ]
    dishes = [
      {
        id: 2,
        title: "Crunchy Cashew Salad",
        price: 3.22,
        image: "/dishes/2.png",
        removable: true,
        category_id: 1,
        category: categories[0],
      },
      {
        id: 1,
        title: "Margherita",
        price: 4.2,
        image: "/dishes/1.png",
        removable: false,
        category_id: 3,
        category: categories[1],
      },
    ]

    orders = [
      createOrder(1, [
        { dish: dishes[0], quantity: 3 },
        { dish: dishes[1], quantity: 5 },
      ]),
      createOrder(228, [{ dish: dishes[0], quantity: 10 }]),
      createOrder(420, [{ dish: dishes[1], quantity: 77 }]),
    ]

    order = orders[0]

    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])

    TestBed.configureTestingModule({
      declarations: [OrderPlacedComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: order },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlacedComponent)
    // component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    fixture.detectChanges()
  })

  it("should show 'order-placed' message with a hint", () => {
    expect(queryMsg()).not.toBeNull()

    for (const o of orders) {
      updateOrder(o)
      const msg = queryMsg()
      expect(msg.textContent).toContain(
        `Order №${o.id} was successfully placed`,
        "expected order message to contain order id",
      )

      const hintText = queryHint().textContent?.toLowerCase()
      expect(hintText).toContain("sign in as admin")
      expect(hintText).toContain("navigate to 'dashboard' from the top nav")
      expect(hintText).toContain("navigate to 'orders' page from the side nav")
    }
  })

  it("should have close button", () => {
    const btn = queryCloseBtn()
    expect(btn).not.toBeNull()
    expect(btn.textContent).toContain("OK")
    btn.click()
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1)
  })

  function createOrder(
    id: number,
    orderItems: { dish: Dish; quantity: number }[],
  ): Order {
    const date = new Date().toISOString()
    const items: OrderItem[] = orderItems.map(({ dish, quantity }) => ({
      id: 1,
      order_id: id,
      dish_id: dish.id,
      dish,
      quantity,
    }))

    return {
      id,
      created_at: date,
      updated_at: date,
      status: OrderStatus.Created,
      user_id: 1,
      items,
      total: items.reduce((acc, i) => acc + i.dish.price, 0),
      user: {} as any,
    }
  }

  function updateOrder(o: Order) {
    Object.assign(order, o)
    fixture.detectChanges()
  }

  function queryMsg() {
    return nativeEl.querySelector("[data-test='order-placed-msg']") as HTMLElement
  }

  function queryHint() {
    return nativeEl.querySelector("[data-test='order-placed-hint']") as HTMLElement
  }

  function queryCloseBtn() {
    return nativeEl.querySelector("[data-test='order-placed-close']") as HTMLElement
  }
})
