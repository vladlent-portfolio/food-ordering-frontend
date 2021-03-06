import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { Observable } from "rxjs"
import { Pagination, User } from "../models/models"
import { HttpClient, HttpParams } from "@angular/common/http"
import { finalize, tap } from "rxjs/operators"
import { AppState } from "../store/reducers"
import { Store } from "@ngrx/store"
import { deleteUserInfo, setUserInfo } from "../store/actions"
import { WithPagination } from "../models/dtos"

@Injectable({
  providedIn: "root",
})
export class UserService {
  readonly baseURL = `${environment.apiURL}/users`

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getAll(pagination?: Pagination): Observable<WithPagination<{ users: User[] }>> {
    let params = new HttpParams()

    if (pagination) {
      for (const [key, value] of Object.entries(pagination)) {
        if (value) params = params.set(key, value)
      }
    }

    return this.http.get<WithPagination<{ users: User[] }>>(this.baseURL, {
      withCredentials: true,
      params,
    })
  }

  me(): Observable<User> {
    return this.http
      .get<User>(`${this.baseURL}/me`, { withCredentials: true })
      .pipe(tap(user => this.store.dispatch(setUserInfo({ user }))))
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${this.baseURL}/signin`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(tap(user => this.store.dispatch(setUserInfo({ user }))))
  }

  signUp(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${this.baseURL}/signup`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(tap(user => this.store.dispatch(setUserInfo({ user }))))
  }

  signOut(): Observable<void> {
    return this.http
      .get<void>(`${this.baseURL}/logout`, { withCredentials: true })
      .pipe(
        finalize(() => {
          this.store.dispatch(deleteUserInfo())
        }),
      )
  }
}
