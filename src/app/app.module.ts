import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule, PAGES } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { SharedModule } from "./shared/shared.module"
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"
import { AppStoreModule } from "./store/app-store.module"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { LoadingInterceptor } from "./interceptors/loading.interceptor"
import { MatTabsModule } from "@angular/material/tabs"

@NgModule({
  declarations: [AppComponent, ...PAGES],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppStoreModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
