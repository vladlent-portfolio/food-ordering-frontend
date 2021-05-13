import { Component } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { UserService } from "../../../services/user.service"
import { MatDialogRef } from "@angular/material/dialog"
import { HttpErrorResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { User } from "../../../models/models"

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

    let action: (email: string, password: string) => Observable<User>
    let errorHandler: (err: HttpErrorResponse) => void

    // TODO: Refactor this binding
    switch (type) {
      case "SignIn":
        action = this.userService.signIn.bind(this.userService)
        errorHandler = err => this.handleSignInError(err)
        break
      case "SignUp":
        action = this.userService.signUp.bind(this.userService)
        errorHandler = err => this.handleSignUpError(err)
        break
    }

    const { email, password } = this.formGroup.value

    action(email, password).subscribe(
      () => {
        this.dialogRef.close()
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

  onTabChange() {
    this.formGroup.reset()
    this.errorMsg = undefined
  }
}
