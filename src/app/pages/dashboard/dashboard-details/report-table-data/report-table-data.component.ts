import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableData } from 'src/app/common/data_sources/side-model';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report-table-data',
  templateUrl: './report-table-data.component.html',
  styleUrls: ['./report-table-data.component.css'],
})
export class ReportTableDataComponent implements OnInit, OnChanges {
  @Input() inputTableData!: TableData;
  @Input() tableName: string = 'outputs';
  @Input() pageTitle: string = '';

  tableData!: TableData;
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  listOfData: any[] = [];
  listOfData2: any[] = [];
  keysEditModel: any[] = [];
  editingObject: { recordId: string; adding: boolean } = {
    recordId: '',
    adding: false,
  };
  tableLoading: boolean = false;
  itemFromEditComponent: any = { price: 0 };

  searchValue: string = '';

  //Pagination
  pagination: any = {
    perPage: 10,
    rowsCount: 1,
    paginationIndex: 1,
    startAt: 0,
  };

  constructor(
    public tableApiService: TableDataService,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tableData = this.inputTableData;
    this.keysEditModel = Object.keys(this.tableData.model);
    this.deleteImageIfIsProducts(); // قم باستدعاء الحذف هنا  
    this.deleteImageIfIsProducts(); // قم باستدعاء الحذف هنا  
    this.getData()
  }
  ngOnChanges(): void {
    // this.getData();
  }

  //DB Seach
  searchItem(limitRange: any = {}) {
    if (this.searchValue) {
      let table = this.tableData.table || this.tableData.customApiBody?.table;
      let body = {
        table: table,
        field: 'name',
        value: this.searchValue,
        limitRange: { start: 1, limitTo: 10 },
      };
      if (limitRange.start) {
        body.limitRange = limitRange;
      }
      this.tableApiService.getData(body, 'search/').subscribe((res: any) => {
        console.log(res);
        if (res?.data) {
          this.listOfData = res.data;
          this.pagination.rowsCount = res.rowsCount;
        } else {
          this.listOfData = res;
        }
        this.tableLoading = false;
      });
    } else {
      this.listOfData = this.listOfData2;
    }
  }

  public getData() {
    this.tableLoading = true;
    this.listOfData = [];
    this.listOfData2 = [];
    const start = this.tableData.customApiBody.limitRange.start;
    const limitTo = this.tableData.customApiBody.limitRange.limitTo;
    const url = `customs/${this.tableName}/?start=${start}&limitTo=${limitTo}`;

    this.tableApiService.getDataWithGet(url).subscribe((res: any) => {
      console.log(res);
      this.listOfData = res.data;
      this.listOfData2 = res.data;
      this.pagination.rowsCount = res.rowsCount;
      this.tableLoading = false;
    });
  }

  deleteImageIfIsProducts() {
    this.tableData.headers?.forEach((value,index) => {
      if (value.notShowingInReport) {
        this.tableData.headers?.splice(index,1)
        this.keysEditModel.splice(index,1)
      }
    });
  }

  checkCustomApi() {
    let body = { table: this.tableData.table };
    if (this.tableData.customApiBody) {
      body = this.tableData.customApiBody;
    }
    return body;
  }

  changePaginationIndex(index: any) {
    // console.log(index)
    this.tableData.customApiBody.limitRange = { start: index, limitTo: 10 };
    if (this.searchValue) {
      this.searchItem(this.tableData.customApiBody.limitRange);
    } else {
      this.getData();
    }
  }

  receiveMessage($event: any) {}
}
