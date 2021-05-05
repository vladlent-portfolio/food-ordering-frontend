import { ComponentFixture, TestBed } from "@angular/core/testing"

import { OrdersPageComponent } from "./orders.component"

describe("OrdersComponent", () => {
  let component: OrdersPageComponent
  let fixture: ComponentFixture<OrdersPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersPageComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
