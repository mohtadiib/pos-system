import { Component } from '@angular/core';
import {SideModel} from "./common/data_sources/side-model";
import DataSources from "./common/data_sources/data-sources";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router,public authService:AuthService,private activatedRoute:ActivatedRoute) {
    console.log(this.router.url)
  }
  isCollapsed = false;
  title!: "Sales System";
  // sideBarList: any[] = new DataSources().pagesDataTable;
  getRoute = () => this.router.url
  logged = () => this.router.url == '/login'
  isSetting = () => this.getRoute() == '/settings'
  isNotPos = () => this.getRoute() != '/pos' && this.getRoute() != '/incoming'
  checkRoute(){
    console.log(this.router.url)
    switch (this.router.url) {
      case "/pos":
        this.isCollapsed = true;
        break;
      case "/incoming":
        this.isCollapsed = true;
        break;
      default:
        this.isCollapsed = false;
        break;
    }
  }
      // @ts-ignore
  public isStockRoute = () =>  this.activatedRoute.snapshot.firstChild?.url == "settings"
        // @ts-ignore
  public isOutputsRoute = () =>  this.activatedRoute.snapshot.firstChild?.url == "expenses"

}
