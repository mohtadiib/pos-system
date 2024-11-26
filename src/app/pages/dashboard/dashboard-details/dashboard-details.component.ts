import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import DataSources from 'src/app/common/data_sources/data-sources';
import { TableData } from 'src/app/common/data_sources/side-model';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.css']
})
export class DashboardDetailsComponent implements OnInit {

  tableData: TableData = {} as TableData; // ضبط نوع `tableData` كـ `TableData`
  
  pageKey: string = "";
  pageTitle: string = "";

  isWallet = () => this.pageKey == "transactions"

  constructor(private activatedRoute: ActivatedRoute) {
    this.pageKey = this.activatedRoute.snapshot.paramMap.get('key') || "";
    this.pageTitle = this.activatedRoute.snapshot.paramMap.get('page_title') || "";
  }
  
  ngOnInit(): void {
    const pagesDataTable = new DataSources().pagesDataTable.find(value => value.path === this.pageKey);
    const settingsList = new DataSources().settingsList.find(value => value.path === this.pageKey);
    const outputsList = new DataSources().outputsList.find(value => value.path === this.pageKey);

    if (pagesDataTable) {
      this.tableData = pagesDataTable.tableData;
    } else if (settingsList) {
      this.tableData = settingsList.tableData;
    } else if (outputsList) {
      this.tableData = outputsList.tableData;
    } else{
      console.warn("No data found for the provided pageKey");
    }
    console.log(this.tableData)

  }

}
