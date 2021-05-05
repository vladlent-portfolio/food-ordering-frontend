import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatToolbarModule } from "@angular/material/toolbar"
import { AdminComponent } from "./admin.component"
import { AdminRoutingModule } from "./admin-routing.module"
import { OrdersPageComponent } from "./pages/orders/orders.component"
import { CustomersPageComponent } from "./pages/customers/customers.component"
import { CategoriesPageComponent } from "./pages/categories/categories.component"
import { DishesPageComponent } from "./pages/dishes/dishes.component"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { AdminNavComponent } from "./components/nav/nav.component"

const MATERIAL_MODULES = [MatToolbarModule, MatSidenavModule, MatListModule]

@NgModule({
  declarations: [
    AdminComponent,
    OrdersPageComponent,
    CustomersPageComponent,
    CategoriesPageComponent,
    DishesPageComponent,
    AdminNavComponent,
  ],
  imports: [CommonModule, ...MATERIAL_MODULES, AdminRoutingModule],
  exports: [...MATERIAL_MODULES],
})
export class AdminModule {}
