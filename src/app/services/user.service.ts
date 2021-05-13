import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { Observable } from "rxjs"
import { User } from "../models/models"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { tap } from "rxjs/operators"
import { AppState } from "../store/reducers"
import { Store } from "@ngrx/store"
import { setUserInfo } from "../store/actions"

@Injectable({
  providedIn: "root",
})
export class UserService {
  readonly baseURL = `${environment.apiURL}/users`

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseURL}/me`).pipe(
      tap(user => {
        this.store.dispatch(setUserInfo({ user }))
      }),
    )
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.baseURL}/signin`, { email, password })
      .pipe(
        tap(user => {
          this.store.dispatch(setUserInfo({ user }))
        }),
      )
  }

  signUp(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseURL}/signup`, { email, password })
  }

  signOut(): Observable<void> {
    return this.http.get<void>(`${this.baseURL}/logout`)
  }
}
