import {Component, OnInit} from '@angular/core';
import DataSources from "../../common/data_sources/data-sources";
import {Router} from "@angular/router";
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
  constructor(private router:Router, private authService:AuthService) {}
  ngOnInit(): void {
    let page = this.sideBarList.find(value => value.router === this.router.url)
    this.tableData = page.tableData
    let permissionType = this.authService.department.permissionType
    if (!page.permissions?.includes(permissionType) && page?.permissions){
      this.router.navigate(['/'])
    }
  }
}
