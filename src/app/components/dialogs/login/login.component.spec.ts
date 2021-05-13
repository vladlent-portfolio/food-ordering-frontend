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
  let emailControl: FormControl
  let passwordControl: FormControl

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj("UserService", ["signIn", "signUp"])
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

    emailControl = component.formGroup.get("email") as FormControl
    passwordControl = component.formGroup.get("password") as FormControl
  })

  it("should reset form group on tab change", async () => {
    populateForm()
    fixture.detectChanges()

    queryTabs()[1].click()
    fixture.detectChanges()
    await fixture.whenStable()

    expect(emailControl.value).toBeNull()
    expect(passwordControl.value).toBeNull()

    populateForm()
    fixture.detectChanges()

    queryTabs()[0].click()
    fixture.detectChanges()
    await fixture.whenStable()

    expect(emailControl.value).toBeNull()
    expect(passwordControl.value).toBeNull()
  })

  it("should disable 'Sign In' and 'Sign Out' buttons if form is invalid", async () => {
    populateForm("123", "pass")
    fixture.detectChanges()

    expect(querySignInBtn().disabled).toBeTrue()

    queryTabs()[1].click()
    fixture.detectChanges()
    await fixture.whenStable()
    expect(querySignUpBtn().disabled).toBeTrue()
  })

  it("should hide error element if error is falsy", () => {
    component.errorMsg = undefined
    fixture.detectChanges()
    expect(queryError()).toBeNull()

    component.errorMsg = ""
    fixture.detectChanges()
    expect(queryError()).toBeNull()
  })

  it("should show error element if error is truthy", () => {
    component.errorMsg = "error msg"
    fixture.detectChanges()
    expect(queryError()).not.toBeNull()
  })

  it("should clear error on tab change", async () => {
    fixture.detectChanges()
    queryTabs()[1].click()

    for await (const tab of queryTabs()) {
      component.errorMsg = "error msg"
      fixture.detectChanges()
      tab.click()
      await fixture.whenStable()
      fixture.detectChanges()
      expect(component.errorMsg).toBeFalsy()
      expect(queryError()).toBeNull()
    }
  })

  describe("sign in", () => {
    it("should call signIn with email and password", () => {
      serviceSpy.signIn.and.returnValue(of({} as User))
      const { email, password } = populateForm()
      fixture.detectChanges()
      querySignInBtn().click()
      expect(serviceSpy.signIn).toHaveBeenCalledWith(email, password)
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
      populateForm()
      component.signIn()
      checkButtonsState(3, true)
    })

    it("should enable all buttons if request returns an error", () => {
      serviceSpy.signIn.and.returnValue(
        throwError({ status: 404, statusText: "Not Found" }),
      )
      populateForm()
      component.signIn()
      checkButtonsState(3, false)
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
      component.errorMsg = "error msg"
      fixture.detectChanges()
      component.signIn()
      fixture.detectChanges()
      expect(queryError()).toBeNull()
    })

    it("should error handler on error", () => {
      serviceSpy.signIn.and.returnValue(
        throwError({ status: 404, statusText: "Not Found" }),
      )
      const spy = spyOn(component, "handleSignInError")
      populateForm()
      component.signIn()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe("sign up", () => {
    beforeEach(async () => {
      fixture.detectChanges()
      queryTabs()[1].click()
      fixture.detectChanges()
      await fixture.whenRenderingDone()
    })

    it("should call signUp with email and password", () => {
      serviceSpy.signUp.and.returnValue(of({} as User))
      const { email, password } = populateForm()
      fixture.detectChanges()
      querySignUpBtn().click()
      expect(serviceSpy.signUp).toHaveBeenCalledWith(email, password)
    })

    it("should not call signUp if form is invalid", () => {
      populateForm("123", "654")
      fixture.detectChanges()
      querySignUpBtn().click()
      expect(serviceSpy.signUp).not.toHaveBeenCalled()
    })

    it("should close dialog on successful sign up", () => {
      serviceSpy.signUp.and.returnValue(of({} as User))
      populateForm()
      component.signUp()
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1)
    })

    it("should disable all buttons and tabs when request is initiated", () => {
      serviceSpy.signUp.and.returnValue(of({} as User))
      populateForm()
      component.signUp()
      checkButtonsState(1, true)
    })

    it("should enable all buttons if request returns an error", () => {
      serviceSpy.signUp.and.returnValue(
        throwError({ status: 404, statusText: "Not Found" }),
      )
      populateForm()
      component.signUp()
      checkButtonsState(1, false)
    })

    it("should clear error message before sending a request", () => {
      serviceSpy.signUp.and.returnValue(of({} as User))
      populateForm()
      component.errorMsg = "error msg"
      fixture.detectChanges()
      component.signUp()
      fixture.detectChanges()
      expect(queryError()).toBeNull()
    })

    it("should error handler on error", () => {
      serviceSpy.signUp.and.returnValue(
        throwError({ status: 409, statusText: "Conflict" }),
      )
      const spy = spyOn(component, "handleSignUpError")
      populateForm()
      component.signUp()
      expect(spy).toHaveBeenCalled()
    })

    it("should error message on 409", () => {
      serviceSpy.signUp.and.returnValue(
        throwError({ status: 409, statusText: "Conflict" }),
      )
      populateForm()
      component.signUp()
      fixture.detectChanges()

      const err = queryError()
      expect(err).not.toBeNull()
      expect(err.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  describe("email FormControl", () => {
    it("should be required", () => runRequiredTest(emailControl))

    it("should have email validation", () => {
      emailControl.setValue("   ")
      expect(emailControl.hasError("email")).toBeTrue()
      emailControl.setValue("hello")
      expect(emailControl.hasError("email")).toBeTrue()
      emailControl.setValue("hello@123.")
      expect(emailControl.hasError("email")).toBeTrue()
      emailControl.setValue("hello@123.com")
      expect(emailControl.hasError("email")).toBeFalse()
    })

    it("should show error msg if email is incorrect", () => {
      emailControl.setValue("123")
      emailControl.markAsTouched()
      fixture.detectChanges()

      expect(emailControl.invalid).toBeTrue()
      expect(queryEmail().value).toBe("123")
      expect(queryEmailFormField().querySelector("mat-error")?.textContent).toContain(
        "Invalid e-mail",
      )
    })
  })

  describe("password FormControl", () => {
    it("should be required", () => runRequiredTest(passwordControl))

    it("should be at least 8 chars long", () => {
      for (let i = 1; i < 7; i++) {
        const str = new Array(i).fill("a").join("")
        passwordControl.setValue(str)
        expect(passwordControl.hasError("minlength")).toBeTrue()
      }

      passwordControl.setValue("longpass")
      expect(passwordControl.hasError("minlength")).toBeFalse()
      passwordControl.setValue("longpass1")
      expect(passwordControl.hasError("minlength")).toBeFalse()
    })

    it("should show error msg if password is incorrect", () => {
      passwordControl.setValue("123")
      passwordControl.markAsTouched()
      fixture.detectChanges()

      expect(passwordControl.invalid).toBeTrue()
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

  function populateForm(email = "mail@example.com", password = "superpass123") {
    emailControl.setValue(email)
    passwordControl.setValue(password)
    component.formGroup.markAsTouched()
    return { email, password }
  }
  function checkButtonsState(amount: number, disabled: boolean) {
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
