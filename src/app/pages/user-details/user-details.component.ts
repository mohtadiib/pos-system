import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import DataSources from 'src/app/common/data_sources/data-sources';
import { TableData } from 'src/app/common/data_sources/side-model';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  // @ViewChild(PaymentComponent) paymentComponent: PaymentComponent | undefined
  // @ViewChild(TableDataComponent) tableDataComponent: TableDataComponent | undefined

  userId: string = ''
  id: string = ''
  name: string = ''
  type: string = ''
  // loading: boolean = false
  // user: any = {}
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
      this.name = this.activatedRoute.snapshot.paramMap.get('name')!
      this.type = this.activatedRoute.snapshot.paramMap.get('type')!
  }
  ngOnInit(): void {
    this.setTablesData()
  }


  setTablesData(){
    this.tableData = [
      {
        router: { main: '/debts' },
        customCrud: ['return','add'],
        customApiBody: {
          table: 'debts',
          // foreignFields: [
          //   { field: 'user_id', table: 'users' },
          //   { field: 'client_id', table: 'users' },
          // ],
          foreignField: { client_id: this.id },
          limitRange: { start: 1, limitTo: 5 },
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          {
            name: 'دائن / مدين',
            type: 'icons_list',
            values: [
              { name: 'مدين', value: '0', color: '#ff0000', icon: 'arrow-up' },
              {
                name: 'دائن',
                value: '1',
                color: '#27a100',
                icon: 'arrow-down',
              },
            ],
            disabled: true,
          },
          {
            name: 'المبلغ',
            type: '',
            completeModel: {
              title: 'دفع الدين',
              placeholder: 'ادخل المبلغ المدفوع',
              keyOfLinkedField: 'payed',
            },
          },
          { name: 'المدفوع', type: '', disabled: true },
          { name: 'رقم العملية', type: '', disabled: true },
          // {
          //   name: 'الموظف',
          //   type: 'online_list',
          //   innerTableName: 'users',
          //   disabled: true,
          // },
          // {
          //   name: 'العميل / المورد',
          //   type: 'online_list',
          //   innerTableName: 'users',
          // },
          {
            name: 'الحالة',
            type: 'tags_list',
            values: [
              { name: 'غير مسدد', value: '0', color: '#a9a9a9' },
              { name: 'مسدد', value: '1', color: '#27a100' },
              { name: 'ملغي', value: '2', color: '#ff0000' },
            ],
          },
          { name: 'الانشاء', type: '', disabled: true },
          { name: 'التعديل', type: '', disabled: true },
        ],
        searchable: { keyFilter: 'client_id' },
        model: {
          doc_id: '',
          income: '0',
          money_value: '',
          payed: '',
          sale_id: '',
          // user_id: '',
          // client_id: '',
          debt_status: '',
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      },
      {
        router: { main: '/sales' },
        customApiBody: {
          table: 'sales',
          foreignFields: [
            { field: 'client_id', table: 'users' },
            { field: 'user_id', table: 'users' },
          ],
          // foreignField: {client_id: this.id },
          inner_tables: {
            foreignField: 'sale_id',
            tables: ['sales_items'],
            get_length: true,
          },
          where: ` incoming = 3 and client_id = ${this.id} `,
          withAdmin: true,
          limitRange: { start: 1, limitTo: 5 },
        },
        customCrud: ['return'],
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'العميل', type: 'online_list' },
          // { name: 'الموظف', type: 'online_list' },
          { name: 'الاجمالي', type: '' },
          { name: 'التخفيض', type: '' },
          {
            name: 'الدفع',
            type: 'tags_list',
            values: [
              { name: 'كاش', value: '0', color: '#71b649' },
              { name: 'بنكك', value: '1', color: '#deae47' },
              { name: 'دين', value: '2', color: '#888888' },
            ],
          },
          {
            name: 'حالة الاستلام',
            type: 'tags_list',
            values: [
              { name: 'لم يتم', value: '0', color: '#737373' },
              { name: 'تم', value: '1', color: '#45ce00' },
              { name: 'ملغي', value: '2', color: '#ff0000' },
            ],
          },
          { name: 'التاريخ', type: '', hidden: true },
          { name: "التفاصيل", type: "details", router:["/sale_details"], disabled: true}
        ],
        model: {
          doc_id: '',
          client_id: '',
          // user_id: '',
          total: '',
          discount: '',
          pay_type: '0',
          status: '0',
          created_at: '0',
          sales_items: undefined,
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

  getUserTitle = () => this.type == "customer"? "العميل":"المورد"
}
