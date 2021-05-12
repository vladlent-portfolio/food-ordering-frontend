import { ComponentFixture, TestBed } from "@angular/core/testing"
import { LoginDialogComponent } from "./login.component"
import { UserService } from "../../../services/user.service"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { MatTabsModule } from "@angular/material/tabs"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { of, throwError } from "rxjs"
import { MatDialogRef } from "@angular/material/dialog"
import { User } from "../../../models/models"

describe("LoginDialogComponent", () => {
  let component: LoginDialogComponent
  let fixture: ComponentFixture<LoginDialogComponent>
  let nativeEl: HTMLElement
  let serviceSpy: jasmine.SpyObj<UserService>
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LoginDialogComponent>>
  let email: FormControl
  let password: FormControl

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj("UserService", ["signIn", "signOut"])
    dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"])

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatTabsModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      declarations: [LoginDialogComponent],
      providers: [
        { provide: UserService, useValue: serviceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent)
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

    expect(email.value).toBeNull()
    expect(password.value).toBeNull()
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
      serviceSpy.signIn.and.returnValue(of({} as User))
      const testEmail = "example@mail.com"
      const testPassword = "secretPass312"
      email.setValue(testEmail)
      password.setValue(testPassword)
      fixture.detectChanges()

      querySignInBtn().click()

      expect(serviceSpy.signIn).toHaveBeenCalledWith(testEmail, testPassword)
    })

    it("should sign in as admin", () => {
      serviceSpy.signIn.and.returnValue(of({} as User))
      fixture.detectChanges()
      const { email, password } = component.admin
      const spy = spyOn(component, "signIn").and.callThrough()
      querySignInAdmin().click()
      expect(serviceSpy.signIn).toHaveBeenCalledWith(email, password)
      expect(spy).toHaveBeenCalled()
    })

    it("should sign in as user", () => {
      serviceSpy.signIn.and.returnValue(of({} as User))
      fixture.detectChanges()
      const { email, password } = component.user
      const spy = spyOn(component, "signIn").and.callThrough()
      querySignInUser().click()
      expect(serviceSpy.signIn).toHaveBeenCalledWith(email, password)
      expect(spy).toHaveBeenCalled()
    })

    it("should not call signIn if form is invalid", () => {
      fixture.detectChanges()
      component.signIn()
      expect(serviceSpy.signIn).not.toHaveBeenCalled()
    })

    it("should close dialog on successful sign in", () => {
      serviceSpy.signIn.and.returnValue(of({} as User))
      populateForm()
      component.signIn()
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1)
    })

    it("should disable all buttons and tabs when request is initiated", () => {
      serviceSpy.signIn.and.returnValue(of({} as User))
      checkButtonsState(3, true)
    })

    it("should enable all buttons if request returns an error", () => {
      serviceSpy.signIn.and.returnValue(
        throwError({ status: 404, statusText: "Not Found" }),
      )
      checkButtonsState(3, false)
    })

    it("should hide error element if error is falsy", () => {
      component.signInError = undefined
      fixture.detectChanges()
      expect(queryError()).toBeNull()

      component.signInError = ""
      fixture.detectChanges()
      expect(queryError()).toBeNull()
    })

    it("should show error element if error is truthy", () => {
      component.signInError = "error msg"
      fixture.detectChanges()
      expect(queryError()).not.toBeNull()
    })

    it("should show error message on 404", () => {
      serviceSpy.signIn.and.returnValue(
        throwError({ status: 404, statusText: "Not Found" }),
      )
      populateForm()
      component.signIn()
      fixture.detectChanges()

      const err = queryError()
      expect(err).not.toBeNull()
      expect(err.textContent?.trim().length).toBeGreaterThan(0)
    })

    it("should clear error message before sending a request", () => {
      serviceSpy.signIn.and.returnValue(of({} as User))
      populateForm()
      component.signInError = "error msg"
      fixture.detectChanges()
      component.signIn()
      fixture.detectChanges()
      expect(queryError()).toBeNull()
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
    return nativeEl.querySelector("[data-test='sign-in-btn']") as HTMLButtonElement
  }

  function querySignUpBtn(): HTMLButtonElement {
    return nativeEl.querySelector("[data-test='sign-up-btn']") as HTMLButtonElement
  }

  function querySignInAdmin(): HTMLButtonElement {
    return nativeEl.querySelector(
      "[data-test='sign-in-as-admin-btn']",
    ) as HTMLButtonElement
  }

  function querySignInUser(): HTMLButtonElement {
    return nativeEl.querySelector(
      "[data-test='sign-in-as-user-btn']",
    ) as HTMLButtonElement
  }

  function queryError(): HTMLElement {
    return nativeEl.querySelector(".error") as HTMLElement
  }

  function populateForm() {
    email.setValue("mail@example.com")
    password.setValue("superpass123")
    component.formGroup.markAsTouched()
  }
  function checkButtonsState(amount: number, disabled: boolean) {
    populateForm()
    component.signIn()
    fixture.detectChanges()

    const btns = Array.from(nativeEl.querySelectorAll("button"))
    expect(btns.length).toBe(amount)
    btns.forEach(btn => expect(btn.disabled).toBe(disabled))

    queryTabs().forEach(tab => {
      expect(tab.classList.contains("mat-tab-disabled")).toBe(disabled)
    })
  }
})

function runRequiredTest(c: FormControl) {
  c.setValue("")
  expect(c.hasError("required")).toBeTrue()
  c.setValue("123")
  expect(c.hasError("required")).toBeFalse()
}
