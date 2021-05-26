import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AdminGuard } from "./guards/admin.guard"
import { MainPageComponent } from "./pages/main/main.component"

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: MainPageComponent,
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
