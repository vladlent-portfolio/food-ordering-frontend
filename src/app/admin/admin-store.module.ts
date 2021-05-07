import { NgModule } from "@angular/core"
import { StoreModule } from "@ngrx/store"

export const adminFeatureKey = "admin"

@NgModule({
  imports: [StoreModule.forFeature(adminFeatureKey, {})],
  exports: [StoreModule],
})
export class AdminStoreModule {}
