import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LoginPageComponent } from "./pages/login/login.component"

export const PAGES = [LoginPageComponent]

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule),
  },
  { path: "login", component: LoginPageComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
