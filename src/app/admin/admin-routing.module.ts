import { NgModule } from "@angular/core"
import { Route, RouterModule, Routes } from "@angular/router"
import { AdminPageComponent } from "./admin.component"
import { CustomersPageComponent } from "./pages/customers/customers.component"
import { CategoriesPageComponent } from "./pages/categories/categories.component"
import { DishesPageComponent } from "./pages/dishes/dishes.component"
import { OrdersPageComponent } from "./pages/orders/orders.component"

export const PAGES_COMPONENTS = [
  CategoriesPageComponent,
  DishesPageComponent,
  CategoriesPageComponent,
  OrdersPageComponent,
]

export const pages: (Route & { data: { title: string } })[] = [
  {
    path: "categories",
    component: CategoriesPageComponent,
    data: { title: "Categories" },
  },
  { path: "dishes", component: DishesPageComponent, data: { title: "Dishes" } },
  { path: "customers", component: CustomersPageComponent, data: { title: "Customers" } },
  { path: "orders", component: OrdersPageComponent, data: { title: "Orders" } },
]

export const routes: Routes = [
  {
    path: "",
    redirectTo: pages[0].path,
  },
  {
    path: "",
    component: AdminPageComponent,
    children: [...pages],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
