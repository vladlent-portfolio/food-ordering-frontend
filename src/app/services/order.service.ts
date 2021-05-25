import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { Order } from "../models/models"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class OrderService {
  readonly baseURL = `${environment.apiURL}/orders`
  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseURL, { withCredentials: true })
  }

  create(dishes: { id: number; quantity: number }[]): Observable<Order> {
    return this.http.post<Order>(this.baseURL, { items: dishes }, { withCredentials: true })
  }

  cancel(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseURL}/${id}/cancel`, null, { withCredentials: true })
  }
}
