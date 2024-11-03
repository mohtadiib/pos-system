import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PagesComponent} from "./pages/pages/pages.component";
import DataSources from "./common/data_sources/data-sources";
import {AuthComponent} from "./pages/auth/auth.component";
import {AuthGuard} from "./services/auth.guard";
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { SaleDetailsComponent } from './pages/sale-details/sale-details.component';
import { ProductsComponent } from './pages/products/products.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: `${new DataSources().pagesDataTable[0].router}` /*'/courses/0'*/ },
  { path: 'login', component: AuthComponent },
  { path: 'user_details/:id/:name', component: UserDetailsComponent },
  { path: 'sale_details/:id', component: SaleDetailsComponent },
  { path: 'category_products/:id/:name', component: ProductsComponent },
  { path: 'pos/invoice/:id', component: InvoiceComponent },
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
      this.setRouteInRoutesList(value)
    })
    // console.log(routes)
  }

  setRouteInRoutesList(value:any,comp:any = PagesComponent){
    let children:any[] = value.children? value.children : []
    let component = value.component? value.component:comp
    let childrenList:any[] = []
    children.forEach(child => {
      //Second Children
      let secondChildren:any[] = child.children? child.children : []
      let secondChildrenList:any[] = []
      secondChildren.forEach(secondChild => {
        let secondComp = secondChild.component? secondChild.component:comp
        secondChildrenList.push({ path: secondChild.path, component: secondComp, canActivate: [AuthGuard]})
      })
      //End Second Children
      childrenList.push({ path: child.path, component: comp, canActivate: [AuthGuard], children: secondChildrenList})
    })
    this.pushToRoutesList(value,component,childrenList)
  }
  pushToRoutesList(value:any,component:any,childrenList:any[]){
    routes.push({ path: value.path, component: component, canActivate: [AuthGuard], children: childrenList})
  }
  // constructor() {
  //   this.getRoute()
  // }
  // getRoute(com:any = PagesComponent){
  //   this.sideBarList.forEach(value => {
  //     if (value.component){
  //       routes.push({path:value.path,component:value.component, canActivate: [AuthGuard]})
  //     }else {
  //       routes.push({path:value.path,component:com, canActivate: [AuthGuard]})
  //     }
  //   })
  // }
}
