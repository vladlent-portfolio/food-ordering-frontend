import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NgLetModule } from "@ngrx-utils/store"
import { ReactiveFormsModule } from "@angular/forms"

const MODULES = [NgLetModule, ReactiveFormsModule]

@NgModule({
  imports: [CommonModule, ...MODULES],
  declarations: [],
  exports: [...MODULES],
})
export class SharedModule {}
