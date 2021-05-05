import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatToolbarModule } from "@angular/material/toolbar"
import { AdminRoutingModule, PAGES_COMPONENTS } from "./admin-routing.module"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { AdminCardComponent } from "./components/card/card.component"
import { AdminNavComponent } from "./components/nav/nav.component"
import { AdminComponent } from "./admin.component"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
]

@NgModule({
  declarations: [
    AdminComponent,
    AdminCardComponent,
    AdminNavComponent,
    ...PAGES_COMPONENTS,
  ],
  imports: [CommonModule, ...MATERIAL_MODULES, AdminRoutingModule],
  exports: [...MATERIAL_MODULES],
})
export class AdminModule {}
