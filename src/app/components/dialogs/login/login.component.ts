import { Component, OnInit } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { UserService } from "../../../services/user.service"
import { MatDialogRef } from "@angular/material/dialog"
import { HttpErrorResponse } from "@angular/common/http"

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginDialogComponent implements OnInit {
  formGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  })
  isLoading = false
  signInError: string | undefined

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
  ) {}

  ngOnInit(): void {}

  signIn() {
    if (this.formGroup.invalid) return

    this.isLoading = true
    this.signInError = undefined

    const { email, password } = this.formGroup.value
    this.userService.signIn(email, password).subscribe(
      () => {
        this.dialogRef.close()
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false
        this.handleSignInError(err)
      },
    )
  }

  signUp() {}

  handleSignInError(err: HttpErrorResponse) {
    if (err.status === 404) {
      this.signInError = "User with provided credentials doesn't exist"
    }
  }
}
