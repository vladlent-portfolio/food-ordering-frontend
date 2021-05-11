import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NgLetModule } from "@ngrx-utils/store"
import { ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"

const MODULES = [NgLetModule, ReactiveFormsModule, MatInputModule, MatButtonModule]

@NgModule({
  imports: [CommonModule, ...MODULES],
  declarations: [],
  exports: [...MODULES],
})
export class SharedModule {}
