import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Dish } from "../models/models"
import { DishCreateDTO } from "../models/dtos"

@Injectable({
  providedIn: "root",
})
export class DishService {
  readonly baseURL = `${environment.apiURL}/dishes`

  constructor(private http: HttpClient) {}

  getAll(categoryID?: number): Observable<Dish[]> {
    let params: { [k: string]: string } = {}

    if (categoryID) {
      params.cid = categoryID.toString()
    }

    return this.http.get<Dish[]>(this.baseURL, { params })
  }

  create(dto: DishCreateDTO): Observable<Dish> {
    return this.http.post<Dish>(
      this.baseURL,
      { ...dto, removable: true },
      { withCredentials: true },
    )
  }

  update(dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(`${this.baseURL}/${dish.id}`, dish, {
      withCredentials: true,
    })
  }

  updateImage(id: number, img: File) {
    const formData = new FormData()
    formData.set("image", img)

    return this.http.patch(`${this.baseURL}/${id}/upload`, formData, {
      responseType: "text",
      withCredentials: true,
    })
  }

  remove(id: number): Observable<Dish> {
    return this.http.delete<Dish>(`${this.baseURL}/${id}`, { withCredentials: true })
  }
}
