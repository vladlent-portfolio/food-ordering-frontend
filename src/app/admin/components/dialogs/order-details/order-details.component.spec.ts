import { ComponentFixture, TestBed } from "@angular/core/testing"
import { OrderDetailsDialogComponent } from "./order-details.component"
import { Order } from "../../../../models/models"
import testOrders from "../../../../testing/data/test-orders.json"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatTableModule } from "@angular/material/table"

describe("OrderDetailsComponent", () => {
  // let component: OrderDetailsDialogComponent
  let fixture: ComponentFixture<OrderDetailsDialogComponent>
  let nativeEl: HTMLElement
  let orders: Order[]
  let data: Order

  beforeEach(() => {
    orders = testOrders
    data = { ...orders[0] }

    TestBed.configureTestingModule({
      declarations: [OrderDetailsDialogComponent],
      imports: [MatTableModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsDialogComponent)
    // component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should have a title with order id", () => {
    for (const order of orders) {
      updateDialogData(order)

      const title = queryTitle()
      expect(title.classList.contains("title")).toBeTrue()
      expect(title.textContent).toContain(order.id)
    }
  })

  describe("order details table", () => {
    it("should have a row for each order item", () => {
      for (const order of orders) {
        updateDialogData(order)

        const rows = queryTableRows()
        expect(rows.length).toBe(order.items.length)

        for (const [i, row] of rows.entries()) {
          const item = order.items[i]

          const img = queryImgCell(row).querySelector("img")
          expect(img?.classList.contains("table__img")).toBeTrue()
          expect(img?.src).toContain(item.dish.image)
          expect(img?.alt).toContain(item.dish.title)

          const dishCell = queryDishCell(row)
          expect(dishCell.classList.contains("table__dish")).toBeTrue()
          expect(dishCell.textContent).toContain(`${item.quantity} x ${item.dish.title}`)

          const priceCell = queryPriceCell(row)
          expect(priceCell.classList.contains("table__price")).toBeTrue()
          expect(priceCell.textContent).toContain("$" + item.quantity * item.dish.price)
        }
      }
    })

    it("should have a footer row with order's total", () => {
      for (const order of orders) {
        updateDialogData(order)

        const footer = queryFooterRow()
        expect(footer).not.toBeNull()

        expect(footer.classList.contains("table__footer")).toBeTrue()
        expect(footer.textContent).toContain("Total")
        expect(footer.textContent).toContain("$" + order.total)
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

  function queryImgCell(row: HTMLElement) {
    return row.querySelector("[data-test='order-details-table-img-cell']") as HTMLElement
  }

  function queryDishCell(row: HTMLElement) {
    return row.querySelector("[data-test='order-details-table-dish-cell']") as HTMLElement
  }

  function queryPriceCell(row: HTMLElement) {
    return row.querySelector(
      "[data-test='order-details-table-price-cell']",
    ) as HTMLElement
  }

  function queryFooterRow() {
    return nativeEl.querySelector(
      "[data-test='order-details-table-footer-row']",
    ) as HTMLElement
  }
})
