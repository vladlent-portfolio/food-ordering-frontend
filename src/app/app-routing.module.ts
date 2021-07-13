import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AdminGuard } from "./guards/admin.guard"
import { MainPageComponent } from "./pages/main/main.component"
import { AboutPageComponent } from "./pages/about/about.component"

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: MainPageComponent,
  },
  {
    path: "about",
    component: AboutPageComponent,
  },
  {
    path: "admin",
    canLoad: [AdminGuard],
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule),
  },
  {
    path: "**",
    redirectTo: "/",
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
