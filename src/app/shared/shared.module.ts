import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NgLetModule } from "@ngrx-utils/store"
import { ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatDialogModule } from "@angular/material/dialog"
import { MatIconModule } from "@angular/material/icon"
import { MatSelectModule } from "@angular/material/select"

const MODULES = [
  NgLetModule,
  ReactiveFormsModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSelectModule,
]

@NgModule({
  imports: [CommonModule, ...MODULES],
  declarations: [],
  exports: [...MODULES],
})
export class SharedModule {}
