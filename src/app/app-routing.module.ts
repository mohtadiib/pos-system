import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagesComponent} from "./pages/pages/pages.component";
import DataSources from "./common/data_sources/data-sources";
import {AuthComponent} from "./pages/auth/auth.component";
import {AuthGuard} from "./services/auth.guard";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: `${new DataSources().pagesDataTable[0].router}` /*'/courses/0'*/ },
  { path: 'login', component: AuthComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
  sideBarList: any[] = new DataSources().pagesDataTable;
  constructor() {
    this.getRoute()
  }
  getRoute(com:any = PagesComponent){
    this.sideBarList.forEach(value => {
      if (value.component){
        routes.push({path:value.path,component:value.component, canActivate: [AuthGuard]})
      }else {
        routes.push({path:value.path,component:com, canActivate: [AuthGuard]})
      }
    })
  }
}
