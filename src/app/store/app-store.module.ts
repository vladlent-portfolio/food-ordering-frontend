import { NgModule } from "@angular/core"
import { StoreModule } from "@ngrx/store"
import { StoreDevtoolsModule } from "@ngrx/store-devtools"
import { environment } from "../../environments/environment"
import { AppState } from "./reducers"

@NgModule({
  imports: [
    StoreModule.forRoot(AppState),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  exports: [StoreModule, StoreDevtoolsModule],
})
export class AppStoreModule {}
