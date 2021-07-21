import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NgLetModule } from "@ngrx-utils/store"
import { ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatDialogModule } from "@angular/material/dialog"
import { MatIconModule } from "@angular/material/icon"
import { MatSelectModule } from "@angular/material/select"
import { OrderStatusComponent } from "./components/order-status/order-status.component"
import { MatTableModule } from "@angular/material/table"
import { LayoutModule } from "@angular/cdk/layout"

const MODULES = [
  NgLetModule,
  ReactiveFormsModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  LayoutModule,
]

const DECLARATIONS = [OrderStatusComponent]

@NgModule({
  imports: [CommonModule, ...MODULES],
  declarations: [...DECLARATIONS],
  exports: [...MODULES, ...DECLARATIONS],
})
export class SharedModule {}
