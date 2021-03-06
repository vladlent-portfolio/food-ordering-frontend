import { NgModule } from "@angular/core"
import { Route, RouterModule, Routes } from "@angular/router"
import { AdminPageComponent } from "./admin.component"
import { UsersPageComponent } from "./pages/users/users.component"
import { CategoriesPageComponent } from "./pages/categories/categories.component"
import { DishesPageComponent } from "./pages/dishes/dishes.component"
import { OrdersPageComponent } from "./pages/orders/orders.component"

export const PAGES_COMPONENTS = [
  CategoriesPageComponent,
  DishesPageComponent,
  UsersPageComponent,
  OrdersPageComponent,
]

export const pages: (Route & { data: { title: string; icon: string } })[] = [
  {
    path: "categories",
    component: CategoriesPageComponent,
    data: { title: "Categories", icon: "category" },
  },
  {
    path: "dishes",
    component: DishesPageComponent,
    data: { title: "Dishes", icon: "restaurant_menu" },
  },
  {
    path: "users",
    component: UsersPageComponent,
    data: { title: "Users", icon: "person" },
  },
  {
    path: "orders",
    component: OrdersPageComponent,
    data: { title: "Orders", icon: "shopping_cart" },
  },
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
