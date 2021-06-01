import { ComponentFixture, TestBed } from "@angular/core/testing"
import { OrdersPageComponent } from "./orders.component"
import { OrderService } from "../../../services/order.service"
import { Order } from "../../../models/models"
import testOrders from "./test-orders.json"
import { of } from "rxjs"
import { Component, Input } from "@angular/core"
import { MatTableModule } from "@angular/material/table"
import { formatDate } from "@angular/common"
import { By } from "@angular/platform-browser"

describe("OrdersComponent", () => {
  let component: OrdersPageComponent
  let fixture: ComponentFixture<OrdersPageComponent>
  let nativeEl: HTMLElement
  let orderServiceSpy: jasmine.SpyObj<OrderService>
  let orders: Order[]

  beforeEach(() => {
    orders = testOrders

    orderServiceSpy = jasmine.createSpyObj("OrderService", ["getAll"])
    orderServiceSpy.getAll.and.returnValue(of(orders))

    TestBed.configureTestingModule({
      declarations: [OrdersPageComponent, OrderStatusFixtureComponent],
      imports: [MatTableModule],
      providers: [{ provide: OrderService, useValue: orderServiceSpy }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should call getAll on init", () => {
    const getAll = spyOn(component, "getAll")
    component.ngOnInit()
    expect(getAll).toHaveBeenCalledTimes(1)
  })

  describe("orders table", () => {
    it("should exist", () => {
      detectChanges()
      expect(queryTable()).not.toBeNull()
    })

    it("should have a header", () => {
      detectChanges()
      const { id, createdAt, updatedAt, email, amount, status } = queryTableHeadCells()

      expect(id.textContent).toContain("Order ID")
      expect(createdAt.textContent).toContain("Created At")
      expect(updatedAt.textContent).toContain("Last Update")
      expect(email.textContent).toContain("Customer's E-mail")
      expect(amount.textContent).toContain("Amount")
      expect(status.textContent).toContain("Order's Status")
    })

    it("should render a row for each order", () => {
      detectChanges()
      const rows = queryTableRows()
      expect(rows.length).toBe(orders.length)

      rows.forEach((row, i) => {
        const order = orders[i]
        const statusComponents = queryStatusComponents()
        const { id, createdAt, updatedAt, email, amount } = queryRowCells(row)

        expect(id.textContent?.trim()).toBe(order.id.toString())
        expect(createdAt.textContent?.trim()).toBe(
          formatDate(order.created_at, "medium", "en"),
        )
        expect(updatedAt.textContent?.trim()).toBe(
          formatDate(order.updated_at, "medium", "en"),
        )
        expect(email.textContent?.trim()).toBe(order.user.email)
        expect(amount.textContent?.trim()).toBe("$" + order.total.toString())
        expect(statusComponents[i].status).toBe(order.status)
      })
    })
  })

  describe("getAll()", () => {
    it("should fetch all orders and updated component's state", () => {
      component.getAll()
      expect(component.orders).toEqual(orders)
    })
  })

  function detectChanges() {
    fixture.detectChanges()
    component.cdRef.detectChanges()
  }

  function queryTable() {
    return nativeEl.querySelector("[data-test='orders-table']") as HTMLElement
  }

  function queryTableHeadCells() {
    const queryCell = (name: string) =>
      nativeEl.querySelector(`[data-test='orders-table-head-${name}']`) as HTMLElement

    return {
      id: queryCell("id"),
      createdAt: queryCell("created-at"),
      updatedAt: queryCell("updated-at"),
      email: queryCell("email"),
      amount: queryCell("amount"),
      status: queryCell("status"),
    }
  }

  function queryTableRows(): NodeListOf<HTMLElement> {
    return nativeEl.querySelectorAll("[data-test='orders-table-row']")
  }

  function queryRowCells(row: HTMLElement) {
    const queryCell = (name: string) =>
      row.querySelector(`[data-test='orders-table-${name}']`) as HTMLElement
    return {
      id: queryCell("id"),
      createdAt: queryCell("created-at"),
      updatedAt: queryCell("updated-at"),
      email: queryCell("email"),
      amount: queryCell("amount"),
      status: queryCell("status"),
    }
  }

  function queryStatusComponents(): OrderStatusFixtureComponent[] {
    return fixture.debugElement
      .queryAll(By.css("app-order-status"))
      .map(de => de.componentInstance)
  }
})

@Component({
  selector: "app-order-status",
  template: "",
})
class OrderStatusFixtureComponent {
  @Input() status: any
}
