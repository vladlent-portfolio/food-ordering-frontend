import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { Order, OrderStatus } from "../models/models"
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
    return this.http.post<Order>(
      this.baseURL,
      { items: dishes },
      { withCredentials: true },
    )
  }

  changeStatus(orderID: number, status: OrderStatus): Observable<void> {
    const params = {
      status,
    }

    return this.http.patch<void>(`${this.baseURL}/${orderID}`, null, {
      params,
      withCredentials: true,
    })
  }
}
