import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AdminRoutingModule, PAGES_COMPONENTS } from "./admin-routing.module"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { AdminCardComponent } from "./components/card/card.component"
import { AdminNavComponent } from "./components/nav/nav.component"
import { AdminPageComponent } from "./admin.component"
import { MatCardModule } from "@angular/material/card"
import { SharedModule } from "../shared/shared.module"
import { AdminStoreModule } from "./admin-store.module"
import { CategoryDialogComponent } from "./components/dialogs/category-dialog/category-dialog.component"
import { ImageUploadComponent } from "./components/image-upload/image-upload.component"
import { DishDialogComponent } from "./components/dialogs/dish-dialog/dish-dialog.component"
import { MatMenuModule } from "@angular/material/menu"

const MATERIAL_MODULES = [MatSidenavModule, MatListModule, MatCardModule, MatMenuModule]

@NgModule({
  declarations: [
    AdminPageComponent,
    AdminCardComponent,
    AdminNavComponent,
    ...PAGES_COMPONENTS,
    CategoryDialogComponent,
    ImageUploadComponent,
    DishDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    AdminStoreModule,
    ...MATERIAL_MODULES,
  ],
  exports: [...MATERIAL_MODULES],
})
export class AdminModule {}
