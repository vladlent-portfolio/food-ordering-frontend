import { ComponentFixture, TestBed } from "@angular/core/testing"

import { LoginPageComponent } from "./login.component"
import { MatTab, MatTabsModule } from "@angular/material/tabs"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { UserService } from "../../services/user.service"
import SpyObj = jasmine.SpyObj
import { of } from "rxjs"

describe("LoginComponent", () => {
  const serviceSpy: SpyObj<UserService> = jasmine.createSpyObj("UserService", [
    "signIn",
    "signOut",
  ])
  let component: LoginPageComponent
  let fixture: ComponentFixture<LoginPageComponent>
  let nativeEl: HTMLElement
  let email: FormControl
  let password: FormControl

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatTabsModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      declarations: [LoginPageComponent],
      providers: [{ provide: UserService, useValue: serviceSpy }],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent)
    component = fixture.componentInstance
    nativeEl = fixture.nativeElement

    email = component.formGroup.get("email") as FormControl
    password = component.formGroup.get("password") as FormControl
  })

  it("should reset form group on tab change", async () => {
    email.setValue("example@mail.com")
    password.setValue("password2354")
    fixture.detectChanges()

    queryTabs()[1].click()
    fixture.detectChanges()
    await fixture.whenStable()

    expect(email.value).toBeNull()
    expect(password.value).toBeNull()

    email.setValue("example@mail.com")
    password.setValue("password2354")
    fixture.detectChanges()

    queryTabs()[0].click()
    fixture.detectChanges()
    await fixture.whenStable()
  })

  it("should show error msg if email is incorrect", () => {
    email.setValue("123")
    email.markAsTouched()
    fixture.detectChanges()

    expect(email.invalid).toBeTrue()
    expect(queryEmail().value).toBe("123")
    expect(queryEmailFormField().querySelector("mat-error")?.textContent).toContain(
      "Invalid e-mail",
    )
  })

  it("should show error msg if password is incorrect", () => {
    password.setValue("123")
    password.markAsTouched()
    fixture.detectChanges()

    expect(password.invalid).toBeTrue()
    expect(queryPassword().value).toBe("123")
    expect(queryPasswordFormField().querySelector("mat-error")?.textContent).toContain(
      "Password should be at least 8 characters long",
    )
  })

  it("should disabled 'Sign In' and 'Sign Out' buttons if form is invalid", async () => {
    email.setValue("123")
    password.setValue("pass")
    fixture.detectChanges()

    expect(querySignInBtn().disabled).toBeTrue()

    queryTabs()[1].click()
    fixture.detectChanges()
    await fixture.whenStable()
    expect(querySignUpBtn().disabled).toBeTrue()
  })

  describe("sign in", () => {
    it("should call signIn with email and password", () => {
      serviceSpy.signIn.and.returnValue(of())
      const testEmail = "example@mail.com"
      const testPassword = "secretPass312"
      email.setValue(testEmail)
      password.setValue(testPassword)
      fixture.detectChanges()

      querySignInBtn().click()

      expect(serviceSpy.signIn).toHaveBeenCalledWith(testEmail, testPassword)
    })

    it("should not call signIn if form is invalid", () => {
      email.setValue("123")
      password.setValue("pass")
      fixture.detectChanges()
      component.signIn()
      expect(serviceSpy.signIn).not.toHaveBeenCalled()
    })
  })

  describe("email FormControl", () => {
    it("should be required", () => runRequiredTest(email))

    it("should have email validation", () => {
      email.setValue("   ")
      expect(email.hasError("email")).toBeTrue()
      email.setValue("hello")
      expect(email.hasError("email")).toBeTrue()
      email.setValue("hello@123.")
      expect(email.hasError("email")).toBeTrue()
      email.setValue("hello@123.com")
      expect(email.hasError("email")).toBeFalse()
    })
  })

  describe("password FormControl", () => {
    it("should be required", () => runRequiredTest(password))
    it("should be at least 8 chars long", () => {
      for (let i = 1; i < 7; i++) {
        const str = new Array(i).fill("a").join("")
        password.setValue(str)
        expect(password.hasError("minlength")).toBeTrue()
      }

      password.setValue("longpass")
      expect(password.hasError("minlength")).toBeFalse()
      password.setValue("longpass1")
      expect(password.hasError("minlength")).toBeFalse()
    })
  })

  function queryTabs(): HTMLElement[] {
    return Array.from(nativeEl.querySelectorAll(".mat-tab-label"))
  }

  function queryEmailFormField(): HTMLElement {
    return nativeEl.querySelector("[data-test='email-form-field']") as HTMLElement
  }

  function queryPasswordFormField(): HTMLElement {
    return nativeEl.querySelector("[data-test='password-form-field']") as HTMLElement
  }

  function queryEmail(): HTMLInputElement {
    return nativeEl.querySelector("#email") as HTMLInputElement
  }

  function queryPassword(): HTMLInputElement {
    return nativeEl.querySelector("#password") as HTMLInputElement
  }

  function querySignInBtn(): HTMLButtonElement {
    return nativeEl.querySelector(".sign-in-btn") as HTMLButtonElement
  }

  function querySignUpBtn(): HTMLButtonElement {
    return nativeEl.querySelector(".sign-up-btn") as HTMLButtonElement
  }
})

function runRequiredTest(c: FormControl) {
  c.setValue("")
  expect(c.hasError("required")).toBeTrue()
  c.setValue("123")
  expect(c.hasError("required")).toBeFalse()
}
