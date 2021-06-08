import { ComponentFixture, TestBed } from "@angular/core/testing"
import { OrdersPageComponent } from "./orders.component"
import { OrderService } from "../../../services/order.service"
import { Order, OrderStatus, OrderStatuses } from "../../../models/models"
import testOrders from "../../../testing/data/test-orders.json"
import { of, throwError } from "rxjs"
import { Component, Input } from "@angular/core"
import { MatTableModule } from "@angular/material/table"
import { formatDate } from "@angular/common"
import { By } from "@angular/platform-browser"
import { MatIconModule } from "@angular/material/icon"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { MatMenuModule } from "@angular/material/menu"
import { MatDialog } from "@angular/material/dialog"
import { OrderDetailsDialogComponent } from "../../components/dialogs/order-details/order-details.component"

describe("OrdersComponent", () => {
  let component: OrdersPageComponent
  let fixture: ComponentFixture<OrdersPageComponent>
  let nativeEl: HTMLElement
  let orderServiceSpy: jasmine.SpyObj<OrderService>
  let orders: Order[]
  let dialogSpy: jasmine.SpyObj<MatDialog>

  beforeEach(() => {
    orders = testOrders

    dialogSpy = jasmine.createSpyObj("MatDialog", ["open"])
    orderServiceSpy = jasmine.createSpyObj("OrderService", ["getAll", "changeStatus"])
    orderServiceSpy.getAll.and.returnValue(of({ orders, pagination: {} as any }))

    TestBed.configureTestingModule({
      declarations: [OrdersPageComponent, OrderStatusFixtureComponent],
      imports: [MatTableModule, MatMenuModule, MatIconModule, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
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
    beforeEach(() => {
      detectChanges()
    })

    it("should exist", () => {
      expect(queryTable()).not.toBeNull()
    })

    it("should have a header", () => {
      const { id, createdAt, updatedAt, email, amount, status } = queryTableHeadCells()

      expect(id.textContent).toContain("Order ID")
      expect(createdAt.textContent).toContain("Created At")
      expect(updatedAt.textContent).toContain("Last Update")
      expect(email.textContent).toContain("Customer's E-mail")
      expect(amount.textContent).toContain("Amount")
      expect(status.textContent).toContain("Order's Status")
    })

    it("should render a row for each order", () => {
      const rows = queryTableRows()
      expect(rows.length).toBe(orders.length)

      rows.forEach((row, i) => {
        const order = orders[i]
        const statusComponents = queryStatusComponents()
        const { id, createdAt, updatedAt, email, amount } = queryRowCells(row)
        expect(row.classList.contains("orders-table__row")).toBeTrue()

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

    it("should call openDetails() with order on click", () => {
      const openDetails = spyOn(component, "openDetails")
      const rows = queryTableRows()

      rows.forEach((row, i) => {
        row.click()
        expect(openDetails).toHaveBeenCalledWith(orders[i])
      })
    })

    describe("action column", () => {
      it("should have a menu with actions for the column", async () => {
        const expectedOptions = [
          {
            text: "Accept Order",
            class: "in-progress",
            icon: "thumb_up",
          },
          {
            text: "Reject Order",
            class: "canceled",
            icon: "cancel",
          },
          {
            text: "Complete Order",
            class: "done",
            icon: "check_circle",
          },
        ]
        const rows = queryTableRows()

        for (const row of rows) {
          const items = await queryActionMenuItems(row)
          expect(items.length).toBe(expectedOptions.length)

          items.forEach((item, i) => {
            const expected = expectedOptions[i]
            expect(item.textContent).toContain(expected.text)

            const icon = item.querySelector("mat-icon")
            expect(icon).not.toBeNull(
              `expected '${expected.text}' menu item to have an icon`,
            )
            expect(icon?.classList.contains(expected.class)).toBe(
              true,
              `expected icon to have '${expected.class}' class`,
            )
            expect(icon?.textContent?.trim()).toBe(expected.icon)
          })
        }
      })

      it("should change order's status with respective action", async () => {
        const changeStatus = spyOn(component, "changeStatus")
        const expectedStatuses = [
          OrderStatus.InProgress,
          OrderStatus.Canceled,
          OrderStatus.Done,
        ]
        const rows = queryTableRows()

        for (const [index, row] of rows.entries()) {
          const order = orders[index]
          const items = await queryActionMenuItems(row)

          items.forEach((item, i) => {
            item.click()
            expect(changeStatus).toHaveBeenCalledWith(order.id, expectedStatuses[i])
          })
        }
      })
    })
  })

  describe("getAll()", () => {
    it("should fetch all orders and updated component's state", () => {
      component.getAll()
      expect(component.orders).toEqual(orders)
    })
  })

  describe("changeStatus()", () => {
    beforeEach(() => {
      orderServiceSpy.changeStatus.and.returnValue(of(undefined))
    })

    it("should call changeStatus from OrderService", () => {
      for (const [i, status] of OrderStatuses.entries()) {
        component.changeStatus(i, status)
        expect(orderServiceSpy.changeStatus).toHaveBeenCalledWith(i, status)
      }
    })

    it("should update order status on success without calling getAll()", async () => {
      component.ngOnInit()
      const getAll = spyOn(component, "getAll")
      const detectChanges = spyOn(component.cdRef, "detectChanges")

      for (const order of orders) {
        for (const status of OrderStatuses) {
          component.changeStatus(order.id, status)
          expect(order.status).toBe(status)
        }
      }

      expect(detectChanges).toHaveBeenCalledTimes(orders.length * OrderStatuses.length)
      expect(getAll).not.toHaveBeenCalled()
    })

    it("should not update order status on error", () => {
      orderServiceSpy.changeStatus.and.returnValue(throwError({ status: 404 }))
      const getAll = spyOn(component, "getAll")

      for (const order of orders) {
        for (const status of OrderStatuses) {
          const prevStatus = order.status

          component.changeStatus(order.id, status)
          expect(order.status).toBe(prevStatus)
        }
      }
      expect(getAll).not.toHaveBeenCalled()
    })
  })

  describe("orderDetails()", () => {
    it("should open order-detail dialog with provided order", () => {
      for (const order of orders) {
        component.openDetails(order)
        expect(dialogSpy.open).toHaveBeenCalledWith(OrderDetailsDialogComponent, {
          data: order,
        })
      }
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

  function queryActionsMenuTrigger(row: HTMLElement) {
    return row.querySelector("[data-test='orders-table-actions-trigger']") as HTMLElement
  }

  async function queryActionMenuItems(
    row: HTMLElement,
  ): Promise<NodeListOf<HTMLElement>> {
    await openActionsMenu(row)
    return document.querySelectorAll("[data-test='orders-table-actions-item']")
  }

  async function openActionsMenu(row: HTMLElement) {
    detectChanges()
    await closeAllPopups()
    const trigger = queryActionsMenuTrigger(row)
    trigger.click()
    detectChanges()
  }

  async function closeAllPopups() {
    const backdrops = document.querySelectorAll(
      ".cdk-overlay-backdrop",
    ) as NodeListOf<HTMLElement>

    for (const backdrop of backdrops) {
      backdrop.click()
      await fixture.whenStable()
      detectChanges()
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
