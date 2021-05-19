import { APP_INITIALIZER, NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { SharedModule } from "./shared/shared.module"
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"
import { AppStoreModule } from "./store/app-store.module"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { LoadingInterceptor } from "./interceptors/loading.interceptor"
import { MatTabsModule } from "@angular/material/tabs"
import { MatToolbarModule } from "@angular/material/toolbar"
import { LoginDialogComponent } from "./components/dialogs/login/login.component"
import { UserService } from "./services/user.service"

const MATERIAL_MODULES = [MatToolbarModule, MatProgressSpinnerModule, MatTabsModule]

@NgModule({
  declarations: [AppComponent, LoginDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppStoreModule,
    ...MATERIAL_MODULES,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (s: UserService) => () => s.me().toPromise(),
      deps: [UserService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
