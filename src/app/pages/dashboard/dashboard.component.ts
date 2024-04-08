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
  pageTitleBackup = {report:"المبيعات",daily:"آخر خمسة عمليات"}
  pageTitle = this.pageTitleBackup.daily
  currentDate: Date = new Date()
  body:any = {
    dashboard:[
      {table:"sales", sumField:"total", where:" incoming = 0 ", type: "all_sales", title: "اجمالي المبيعات", icon:"file-text" },
      // {table:"sales", sumField:"total", where:" incoming = 0 and pay_type = 2 ", type: "debts_sales", title: "مبيعات بالدين", icon:"file-done" },
      // {table:"sales", sumField:"total", where:" incoming = 1 ", type: "all_incoming", title: "الوارد", icon:"file-done" },
      {table:"products", type: "all_products", title: "عدد الاصناف", icon:"pic-center" },
      // {table:"products", where: " minimum_qty > quantity", type: "products_minimum_quantity", title: "اصناف قاربت على الانتهاء", icon:"pic-center" },
      // {table:"outputs", sumField:"moneyValue", where:" status != 2 ", type: "all_outputs", title: "المنصرفات", icon:"pic-center" },
      // {table:"debts", sumField:"money_value", where:"", type: "all_debts", title: "الديون", icon:"pic-center" },
      // {table:"final_money", type: "all_transactions", title: "المبلغ المتوفر", icon:"pic-center" },
    ]
  }
  dashboardListBackup:any = this.body.dashboard
  tables:any = {}
  reportPage:boolean = this.router.url === '/report'
  date :any[] = [];
  constructor(private fb: NonNullableFormBuilder,private dataService:TableDataService,
              private router: Router) {}
  getData(){
    this.tables.values = []
    // console.log(this.body.dashboard)
    this.dataService.getData(this.body).subscribe((value:any) => {
      // console.log(value)
      this.tables.values = value.tables
    })
  }
  ngOnInit(): void {
    this.pageTitle = this.pageTitleBackup.daily
    if (this.reportPage){
      this.pageTitle = this.pageTitleBackup.report
    }
    this.setReportModal()
    if (!this.reportPage)
    this.setDatesOnDashboard([this.currentDate,this.currentDate])
    this.getData()
  }
  setReportModal(modelListFilter:string = "sales",where:any = null){
    if (modelListFilter == "final_money"){
      modelListFilter = "transactions"
    }
    this.reportObject = this.sideBarList.find(value => value.path == modelListFilter).tableData
    this.reportObject.customCrud = []
    this.reportObject.customApiBody.where = where
  }
   setFilter(filter:string,where:any = null,index:number = 0){
     this.mainReports = false
     this.pageTitle = this.body.dashboard[index].title
     this.body.dashboard = this.body.dashboard.filter((value:any) => value.table == filter)
     this.getData()
     this.setReportModal(this.body.dashboard[0].table,where)
   }
  back() {
    this.mainReports = true
    this.body.dashboard = this.dashboardListBackup
    this.setReportModal()
    this.getData()
  }

  onChangeDateRange(result: Date[]): void {
    this.resetDashboardList()
    if (!this.reportObject.customApiBody.backUpWhere){
      this.reportObject.customApiBody.where = this.reportObject.customApiBody?.backUpWhere
    }
    if (result.length){
      this.setDatesOnDashboard(result)
    }else {
      this.reportObject.customApiBody.where = this.reportObject.customApiBody.backUpWhere
      this.getData()
      this.tableDataComponent?.getData()
    }
  }

  setDatesOnDashboard(result:Date[]){
    this.body.dashboard.forEach((value:any) => {
      if (value?.where){
        value.backUpWhere = value.where
        value.where += this.setDateFilter(this.getListFilterDates(result),value.where)
      }else {
        value.where = this.setDateFilter(this.getListFilterDates(result),value.where)
      }
    })
    this.reportObject.customApiBody.backUpWhere = this.reportObject.customApiBody?.where
    this.reportObject.customApiBody.where =  this.setDateFilter(this.getListFilterDates(result),this.reportObject.customApiBody.where)
    this.reportObject.customApiBody.limit = 5
    this.tableDataComponent?.getData()
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
    if (where){
      return ` and date(created_at) between ${datesObject.firstDate} and ${datesObject.lastDate} `
    }else {
      return ` date(created_at) between ${datesObject.firstDate} and ${datesObject.lastDate} `
    }
  }

  resetDashboardList(){
    this.body.dashboard.forEach((value:any) => {
      value.where = value?.backUpWhere
    })
  }
  priceFormat = (price:number) => priceFormat(price);

}
