import { NgModule } from "@angular/core"
import { StoreModule } from "@ngrx/store"
import { StoreDevtoolsModule } from "@ngrx/store-devtools"
import { environment } from "../../environments/environment"
import { loadingReducer } from "./reducers"

@NgModule({
  imports: [
    StoreModule.forRoot({ isLoading: loadingReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  exports: [StoreModule, StoreDevtoolsModule],
})
export class AppStoreModule {}
