import { ComponentFixture, TestBed } from "@angular/core/testing"

import { OrderStatusComponent } from "./order-status.component"
import { Component } from "@angular/core"
import { OrderStatus } from "../../../models/models"

describe("OrderStatusComponent", () => {
  let hostComponent: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderStatusComponent, TestHostComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    nativeEl = fixture.nativeElement
  })

  it("should render appropriate html based on provided order status", () => {
    const tests: { status: OrderStatus; className: string; text: string }[] = [
      { status: OrderStatus.Created, className: "created", text: "New Order" },
      { status: OrderStatus.InProgress, className: "in-progress", text: "In Progress" },
      { status: OrderStatus.Done, className: "done", text: "Delivered" },
      { status: OrderStatus.Canceled, className: "canceled", text: "Canceled" },
    ]

    for (const test of tests) {
      hostComponent.status = test.status
      fixture.detectChanges()

      const el = queryContainer()
      expect(el).not.toBeNull()

      expect(el.classList.contains(test.className)).toBeTrue()
      expect(el.textContent).toContain(test.text)
    }
  })

  function queryContainer() {
    return nativeEl.querySelector("[data-test='order-status']") as HTMLElement
  }
})

@Component({
  template: "<app-order-status [status]='status'></app-order-status>",
})
class TestHostComponent {
  status: OrderStatusComponent["status"]
}
