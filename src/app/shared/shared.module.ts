import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NgLetModule } from "@ngrx-utils/store"

const MODULES = [NgLetModule]

@NgModule({
  imports: [CommonModule, ...MODULES],
  declarations: [],
  exports: [...MODULES],
})
export class SharedModule {}
