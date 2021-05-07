import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { SharedModule } from "./shared/shared.module"
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"
import { AppStoreModule } from "./store/app-store.module"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { LoadingInterceptor } from "./interceptors/loading.interceptor"

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppStoreModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
