import { ComponentFixture, TestBed } from "@angular/core/testing"

import { OrderDetailsDialogComponent } from "./order-details.component"
import { Order } from "../../../../models/models"
import testOrders from "../../../../testing/data/test-orders.json"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatTableModule } from "@angular/material/table"

describe("OrderDetailsComponent", () => {
  let component: OrderDetailsDialogComponent
  let fixture: ComponentFixture<OrderDetailsDialogComponent>
  let nativeEl: HTMLElement
  let orders: Order[]
  let data: Order

  beforeEach(() => {
    orders = testOrders
    data = orders[0]

    TestBed.configureTestingModule({
      declarations: [OrderDetailsDialogComponent],
      imports: [MatTableModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsDialogComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement

    console.log("component >>>>", component)
  })

  it("should have a title with order id", () => {
    for (const order of orders) {
      updateDialogData(order)
      expect(queryTitle().textContent).toContain(order.id)
    }
  })

  describe("order details table", () => {
    it("should have a row for each order item", () => {
      for (const order of orders) {
        updateDialogData(order)
        expect(queryTableRows().length).toBe(order.items.length)
      }
    })
  })

  function updateDialogData(order: Order) {
    Object.assign(data, order)
    fixture.detectChanges()
  }

  function queryTitle() {
    return nativeEl.querySelector("[data-test='order-details-title']") as HTMLElement
  }

  function queryTableRows(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='order-details-table-row']")
  }
})
