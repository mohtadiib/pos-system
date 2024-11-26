import {Component, OnInit, ViewChild} from '@angular/core';
import {TableDataService} from "../../components/table-data/table-data.service";
import {Router} from "@angular/router";
import DataSources from "../../common/data_sources/data-sources";
import {TableDataComponent} from "../../components/table-data/table-data.component";
import { NonNullableFormBuilder } from "@angular/forms";
import { priceFormat } from 'src/app/common/math';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  @ViewChild(TableDataComponent) tableDataComponent: TableDataComponent | undefined
  sideBarList: any[] = new DataSources().pagesDataTable;
  reportObject: any = {}
  mainReports:boolean = true
  pageTitleBackup = {report:"العمليات على المحفظة",daily:"آخر خمسة عمليات على المحفظة"}
  pageTitle = this.pageTitleBackup.daily
  currentDate: Date = new Date()
  // dashboardListBackup:any = this.body.dashboard
  tables:any = {}
  reportPage:boolean = this.router.url === '/report'
  date :any[] = [];
  constructor(private fb: NonNullableFormBuilder,private dataService:TableDataService,
              private router: Router) {}
  getData(){
    this.tables.values = []
    const url = "customs/dashboard/"
    this.dataService.getDataWithGet(url).subscribe((value:any) => {
      // console.log(value)
      this.tables.values = value.tables
    })
  }
  ngOnInit(): void {
    this.getData()
    this.setReportModal()
  }

  setReportModal(modelListFilter:string = "transactions",where:any = null){
    if (modelListFilter == "final_money"){
      modelListFilter = "transactions"
    }
    let object = this.sideBarList.find(value => value.path == modelListFilter)
    this.reportObject = object.tableData
    this.reportObject.customCrud = []
    this.reportObject.customApiBody.limitRange = { start: 1, limitTo: 5 },
    this.reportObject.customApiBody.where = where
  }

  back() {
    this.mainReports = true
  }

  getListFilterDates(result: Date[]){
    let datesObject = {firstDate:"",lastDate:""}
    let field = "firstDate"
    result.map((value,index) => {
      if (index == 0){
        datesObject.firstDate = `'${value.getUTCFullYear()}-${value.getMonth()+1}-${value.getDate()}'`
      }else {
        datesObject.lastDate = `'${value.getUTCFullYear()}-${value.getMonth()+1}-${value.getDate()}'`
      }
    })
    return  datesObject
  }

  setDateFilter(datesObject:any,where:string = ""){
    if(where){
      return ` and date(created_at) between ${datesObject.firstDate} and ${datesObject.lastDate} `
    }else{
      return ` date(created_at) between ${datesObject.firstDate} and ${datesObject.lastDate} `
    }
  }

  priceFormat = (price:number) => priceFormat(price);

  onChangeDateRange(event:any){

  }

  selectCard(item:any){
    this.router.navigate([`dashboard_details/${item.table}/${item.title}`])
  }

}
