import {Component, OnInit} from '@angular/core';
import DataSources from "../../common/data_sources/data-sources";
import {ActivatedRoute, Router} from "@angular/router";
import {TableData} from "../../common/data_sources/side-model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})

export class PagesComponent implements OnInit{
  // @Input() index!:number
  sideBarList: any[] = new DataSources().pagesDataTable;
  tableData: TableData = {}
  constructor(private activatedRoute:ActivatedRoute,private router:Router, private authService:AuthService) {}
  
  ngOnInit(): void {
    let page:any = this.getCurrentPage()
    this.tableData = page.tableData
    this.tableData.title = page.title
    let permissionType = this.authService.sessionUser.permissionType
    if (!page.permissions?.includes(permissionType) && page?.permissions?.length){
      this.router.navigate(['/'])
    }
  }

  getCurrentPage(router:string = this.router.url){
    let page
    this.sideBarList.forEach(value => {
      if (value.children){
        // @ts-ignore
        let route = this.activatedRoute.url["_value"][0].path
        console.log(route)
        value?.children.forEach((sub:any)=> {
          if (sub.router == route){
            page = sub
          }
        })
      }else{
        if (value.router == router){
          page = value
        }
      }
    })
    return page
  }
}
