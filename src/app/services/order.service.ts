import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { Order, OrderStatus, Pagination } from "../models/models"
import { Observable } from "rxjs"
import { WithPagination } from "../models/dtos"

@Injectable({
  providedIn: "root",
})
export class OrderService {
  readonly baseURL = `${environment.apiURL}/orders`
  constructor(private http: HttpClient) {}

  getAll(pagination?: Pagination): Observable<WithPagination<{ orders: Order[] }>> {
    let params = new HttpParams()

    if (pagination) {
      for (const [key, value] of Object.entries(pagination)) {
        if (value) params = params.set(key, value)
      }
    }

    return this.http.get<WithPagination<{ orders: Order[] }>>(this.baseURL, {
      withCredentials: true,
      params,
    })
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
