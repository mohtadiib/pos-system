import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableData } from 'src/app/common/data_sources/side-model';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentComponent } from './payment/payment.component';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.css']
})
export class SaleDetailsComponent {
  @ViewChild(PaymentComponent) paymentComponent: PaymentComponent | undefined
  id: string = ''
  loading: boolean = false
  tableData: TableData = {}
  isVisible: boolean = false
  patientTests: any[] = [];
  totalCostOfAnalyses: number = 0
  constructor(
     public activatedRoute: ActivatedRoute,
     public authService:AuthService,
    ) {
      this.id = this.activatedRoute.snapshot.paramMap.get('id')!
  }
  ngOnInit(): void {
    this.setTablesData()
  }


  setTablesData(){
    this.tableData = {
      title: 'الاصناف',
      router: { main: '/sales_items' },
      customApiBody: {
        table: 'sales_items',
        foreignField: { sale_id: this.id },
        foreignFields: [{ field: 'product_id', table: 'products' }],
        inner_tables: {
          foreignField: 'sale_item_id',
          tables: ['sale_delivery'],
          get_length: true,
        },
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
        {
          name: 'الكمية',
          type: '',
          deliverdModel: {
                      title: 'تسليم كمية',
                      placeholder: 'ادخل الكمية التي تم تسليمها',
                      keyOfLinkedField: 'delivered_qty',
                    },
        },
        { name: 'الكمية المستلمة', type: '' },
        // Last Deliverd Operations
        {
          name: 'عمليات التسليم',
          type: 'list',
          innerModel: {
            title: 'عمليات التسليم',
            router: { main: '/sale_delivery' },
            customApiBody: {
              table: 'sale_delivery',
              foreignField: { sale_item_id: '' },
            },
            customCrud: ["delete"],
            headers: [
              { name: 'الرقم', type: '', hidden: true },
              { name: 'المستلم', type: '' },
              { name: 'الكمية', type: '' },
              { name: 'ملاحظات', type: '' },
              { name: 'التاريخ', type: '' },
            ],
            model: {
              doc_id: '',
              recipient_name: '',
              delivered_qty: '',
              remark: '',
              created_at: '',
            },
          },
        },
      ],
      model: {
        doc_id: '',
        product_id: '',
        quantity: '',
        delivered_qty: '',
        sale_delivery: undefined,
      },
    }
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

  isNotPayed = () => this.paymentComponent?.getDue()! > 0 && !this.paymentComponent?.loading

}