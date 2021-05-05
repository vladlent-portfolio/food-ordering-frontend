import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatToolbarModule } from '@angular/material/toolbar'
import { AdminComponent } from './admin.component'
import { AdminRoutingModule } from './admin-routing.module'

const MATERIAL_MODULES = [MatToolbarModule]

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, ...MATERIAL_MODULES, AdminRoutingModule],
  exports: [...MATERIAL_MODULES],
})
export class AdminModule {}
