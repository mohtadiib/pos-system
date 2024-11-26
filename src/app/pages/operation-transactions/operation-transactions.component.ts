import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableData } from 'src/app/common/data_sources/side-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-operation-transactions',
  templateUrl: './operation-transactions.component.html',
  styleUrls: ['./operation-transactions.component.css']
})
export class OperationTransactionsComponent {
  id: string = ''
  title: string = ''
  type: string = 'operation'
  tableData: TableData = {}
  constructor(
    public activatedRoute: ActivatedRoute,
    public authService:AuthService,
   ) {
     this.id = this.activatedRoute.snapshot.paramMap.get('id')!
     this.title = this.activatedRoute.snapshot.paramMap.get('name')!
     this.type = this.activatedRoute.snapshot.paramMap.get('type')!
 }

 ngOnInit(): void {
  this.setTablesData()
}

 setTablesData(){
  let transactionsType = "operation_id"

  if(this.type == "wallet"){
    transactionsType = "client_id"
  }

  this.tableData = {
    title: 'العمليات',
    router: { main: '/transactions' },
    customApiBody: {
      table: 'transactions',
      foreignField: { [transactionsType]: this.id },
      limitRange: { start: 1, limitTo: 10 },
    },
    customCrud: ['return'],
    headers: [
      { name: 'الرقم', type: '', hidden: true },
      { name: 'المبلغ', type: '' },
      {
        name: 'نوع العملية',
        type: 'tags_list',
        values: [
          { name: 'مبيعات', value: '0', color: '#77b470' },
          { name: 'منصرفات', value: '1', color: '#e05050' },
          { name: 'وارد', value: '2', color: '#c9852c' },
          { name: 'رصيد', value: '3', color: '#0029ff' },
          { name: 'سداد دين', value: '4', color: '#e05050' },
    ],
        // disabled: true,
      },
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
        name: 'دائن / مدين',
        type: 'icons_list',
        values: [
          { name: 'دائن', value: '0', color: '#ff0000', icon: 'arrow-up' },
          {
            name: 'مدين',
            value: '1',
            color: '#27a100',
            icon: 'arrow-down',
          },
        ],
        disabled: true,
      },
      { name: 'تاريخ الانشاء', type: '', hidden: true },
      // { name: "تاريخ التعديل", type: "", hidden: true },
    ],
    model: {
      doc_id: '',
      amount: '',
      type: '0',
      pay_type: '',
      income: '',
      created_at: undefined,
      // updated_at: '',
    },
  }
}
}
