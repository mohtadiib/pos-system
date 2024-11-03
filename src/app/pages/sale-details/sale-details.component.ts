import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableData } from 'src/app/common/data_sources/side-model';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.css']
})
export class SaleDetailsComponent {
  
  // userId: string = ''
  id: string = ''
  loading: boolean = false
  user: any = {}
  // categoriesList: TableData[] = new DataSources().categoriesList
  tableData: TableData[] = []
  isVisible: boolean = false
  patientTests: any[] = [];
  totalCostOfAnalyses: number = 0
  constructor(
    //  public resultService: ResultService,
     public activatedRoute: ActivatedRoute,
     public authService:AuthService,
     public tableDataService:TableDataService,
    ) {
      this.id = this.activatedRoute.snapshot.paramMap.get('id')!
  }
  ngOnInit(): void {
    this.setTablesData()
    this.getSaleDetails()
  }
  getSaleDetails(){
    this.loading = true
    const path = `customs/sales/sale_details/?id=${this.id}`
    this.tableDataService.getDataWithGet(path).subscribe(res => {
      console.log(JSON.stringify(res))
      this.loading = false
      this.user = res[0]
    })
  }


  setTablesData(){
    this.tableData = [
      {
        title: 'الاصناف',
        router: { main: '/sales_items' },
        customApiBody: {
          table: 'sales_items',
          foreignField: { sale_id: this.id },
          foreignFields: [{ field: 'product_id', table: 'products' }],
          withAdmin: true,
        },
        customCrud: [],
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          {
            name: 'اسم المنتج',
            type: 'online_list',
            innerTableName: 'products',
          },
          { name: 'الكمية', type: '' },
        ],
        model: {
          doc_id: '',
          product_id: '',
          quantity: '',
        },
      }
    ]
  }
  // Modal for add new Analyse
  addNewAnalyse() {
    this.isVisible = true
  }
  handleCancel() {
    this.isVisible = false
  }
  routerCallBack(analysesData: any) {
    this.patientTests = analysesData.listOfPatientSelectedTest
    this.totalCostOfAnalyses = analysesData.total
  }
}






  // getUser(){
  //   console.log(this.userId)
  //   this.loading = true
  //   let body = { table:"users", where: " doc_id = "+this.userId }
  //   this.tableDataService.getData(body).subscribe(res => {
  //     // console.log(res)
  //     this.loading = false
  //     this.user = res[0]
  //   })
  // }