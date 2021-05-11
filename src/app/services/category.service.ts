import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Category } from "../models/models"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  readonly baseURL = `${environment.apiURL}/categories`

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseURL)
  }

  create(title: string): Observable<Category> {
    return this.http.post<Category>(this.baseURL, {
      title,
      removable: true,
    })
  }

  updateImage(id: number, img: File): Observable<string> {
    const formData = new FormData()
    formData.set("image", img)

    return this.http.patch<string>(`${this.baseURL}/${id}`, formData, {
      headers: { "Content-Type": "application/form-data" },
    })
  }
}
