import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatToolbarModule } from "@angular/material/toolbar"
import { AdminRoutingModule, PAGES_COMPONENTS } from "./admin-routing.module"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { AdminCardComponent } from "./components/card/card.component"
import { AdminNavComponent } from "./components/nav/nav.component"
import { AdminPageComponent } from "./admin.component"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { SharedModule } from "../shared/shared.module"
import { AdminStoreModule } from "./admin-store.module"
import { CategoryDialogComponent } from "./components/dialogs/category-dialog/category-dialog.component"
import { MatInputModule } from "@angular/material/input"
import { ImageUploadComponent } from "./components/image-upload/image-upload.component"
import { MatDialogModule } from "@angular/material/dialog"

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatDialogModule,
]

@NgModule({
  declarations: [
    AdminPageComponent,
    AdminCardComponent,
    AdminNavComponent,
    ...PAGES_COMPONENTS,
    CategoryDialogComponent,
    ImageUploadComponent,
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
