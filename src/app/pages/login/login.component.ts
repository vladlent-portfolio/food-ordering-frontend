import { Component, OnInit } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  signIn() {}

  signUp() {}
}
