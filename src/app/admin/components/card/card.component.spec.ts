import { ComponentFixture, TestBed } from "@angular/core/testing"

import { AdminCardComponent } from "./card.component"

describe("CardComponent", () => {
  let component: AdminCardComponent
  let fixture: ComponentFixture<AdminCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCardComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
