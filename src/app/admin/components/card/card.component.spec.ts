import { ComponentFixture, TestBed } from "@angular/core/testing"

import { AdminCardComponent } from "./card.component"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { Component } from "@angular/core"

describe("CardComponent", () => {
  let component: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>
  let nativeEl: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule],
      declarations: [AdminCardComponent, TestHostComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement
    fixture.detectChanges()
  })

  it("should have title and subtitle in card content", () => {
    const title = "Card Title"
    const subtitle = "Card subtitle"
    component.title = title
    component.subtitle = subtitle
    fixture.detectChanges()

    const contentEl = nativeEl.querySelector(".card__content")

    if (expect(contentEl).not.toBeNull("expected card content to exist") && contentEl) {
      const titleEl = contentEl.querySelector(".card__title")
      const subtitleEl = contentEl.querySelector(".card__subtitle")

      expect(titleEl?.textContent).toContain(title)
      expect(subtitleEl?.textContent).toContain(subtitle)
    }
  })

  it("should toggle image visibility depending on Input prop", () => {
    const imageSrc = "/image/image1.png"
    component.imageSrc = imageSrc
    fixture.detectChanges()

    let imageEl = nativeEl.querySelector("img")

    if (expect(imageEl).not.toBeNull("expected card img to be in the DOM") && imageEl) {
      expect(imageEl.src).toBe(imageSrc, "expected card img to have provided src")
    }

    component.imageSrc = undefined
    fixture.detectChanges()

    imageEl = nativeEl.querySelector("img")
    expect(imageEl).toBeNull("expected img element to be removed from DOM")
  })

  it("should toggle Remove btn disable state based on removable prop", () => {
    component.removable = false
    fixture.detectChanges()
    let btn = nativeEl.querySelector<HTMLButtonElement>(".card__remove")

    if (expect(btn).not.toBeNull("expected Remove btn to be in the DOM") && btn) {
      expect(btn.disabled).toBeFalse()

      component.removable = true
      fixture.detectChanges()

      expect(btn.disabled).toBeTrue()
    }
  })
})

@Component({
  template: `<app-admin-card
    [imageSrc]="imageSrc"
    [title]="title"
    [subtitle]="subtitle"
    [removable]="removable"
  ></app-admin-card>`,
})
class TestHostComponent {
  imageSrc: string | undefined
  title: string | undefined
  subtitle: string | undefined
  removable = false
}
