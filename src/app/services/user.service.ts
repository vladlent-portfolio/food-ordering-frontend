import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { Observable } from "rxjs"
import { User } from "../models/models"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class UserService {
  readonly baseURL = `${environment.apiURL}/users`

  constructor(private http: HttpClient, private router: Router) {}

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseURL}/me`)
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseURL}/signin`, { email, password })
  }

  signOut(): Observable<void> {
    return this.http.get<void>(`${this.baseURL}/logout`)
  }
}
