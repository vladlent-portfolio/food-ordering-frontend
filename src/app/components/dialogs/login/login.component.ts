import { Component } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { UserService } from "../../../services/user.service"
import { MatDialogRef } from "@angular/material/dialog"
import { HttpErrorResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { User } from "../../../models/models"
import { MatTabChangeEvent } from "@angular/material/tabs"

type SubmitType = "SignIn" | "SignUp"

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginDialogComponent {
  errorMsg: string | undefined
  formGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  })
  isLoading = false
  currentTabIndex = 0

  admin = {
    email: "Marcelle.Marks@gmail.com",
    password: "eZKeEKF6avGhxur",
  }

  user = {
    email: "Genevieve56@hotmail.com",
    password: "jTOdJPRL8_npqKV",
  }

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
  ) {}

  signIn() {
    this.submit("SignIn")
  }

  signUp() {
    this.submit("SignUp")
  }

  signInAs(email: string, password: string) {
    this.formGroup.setValue({ email, password })
    this.signIn()
  }

  submit(type: SubmitType) {
    if (this.formGroup.invalid) return

    this.isLoading = true
    this.errorMsg = undefined

    const { email, password } = this.formGroup.value
    let result: Observable<User>
    let errorHandler: (err: HttpErrorResponse) => void

    switch (type) {
      case "SignIn":
        result = this.userService.signIn(email, password)
        errorHandler = err => this.handleSignInError(err)
        break
      case "SignUp":
        result = this.userService.signUp(email, password)
        errorHandler = err => this.handleSignUpError(err)
        break
    }

    result.subscribe(
      () => {
        this.dialogRef.close(true)
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false
        errorHandler(err)
      },
    )
  }

  handleSignInError(err: HttpErrorResponse) {
    if (err.status === 404) {
      this.errorMsg = "User with provided credentials doesn't exist"
    }
  }

  handleSignUpError(err: HttpErrorResponse) {
    if (err.status === 409) {
      this.errorMsg = "User with provided email already exist"
    }
  }

  onTabChange(e: MatTabChangeEvent) {
    this.currentTabIndex = e.index
    this.formGroup.reset()
    this.errorMsg = undefined
  }
}
