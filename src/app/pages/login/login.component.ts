import { Component, OnInit } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { UserService } from "../../services/user.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginPageComponent implements OnInit {
  formGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  })

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {}

  signIn() {
    if (this.formGroup.invalid) return

    const { email, password } = this.formGroup.value
    this.userService.signIn(email, password).subscribe()
  }

  signUp() {}
}
