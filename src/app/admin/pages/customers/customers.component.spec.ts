import { ComponentFixture, TestBed } from "@angular/core/testing"

import { CustomersPageComponent } from "./customers.component"

describe("CustomersComponent", () => {
  let component: CustomersPageComponent
  let fixture: ComponentFixture<CustomersPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersPageComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
