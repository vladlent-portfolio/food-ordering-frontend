import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AdminGuard } from "./guards/admin.guard"

const routes: Routes = [
  {
    path: "admin",
    canLoad: [AdminGuard],
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
