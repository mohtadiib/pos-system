import {Component, OnInit} from '@angular/core';
import {NzMarks} from "ng-zorro-antd/slider";
import {TableDataService} from "../../components/table-data/table-data.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  body:any = {
    dashboard:[
      {table:"operations",department:true},
      {table:"operations",foreignKey:{operation_status:"4"},department: true},
      {table:"products"},
    ]
  }
  tables:any = {
    values:[],
    titles:["عدد الايصالات","الايصالات المكتملة","عدد الاصناف في المخزن"],
    icons:["file-text","file-done","pic-center"]
  }
  reportPage:boolean = this.router.url === '/report/8'
  constructor(private dataService:TableDataService,
              private modal: NzModalService,
              public authService:AuthService,
              private router: Router) {}
  getData(){
    this.dataService.getData(this.body).subscribe((value:any) => {
      console.log(value)
      this.tables.values = value.tables
    })
  }
  getRole = (value:string) => value === '1'
  // reportPage = () => this.router.url == '/report/8'
  ngOnInit(): void {
    this.getData()
  }

}
