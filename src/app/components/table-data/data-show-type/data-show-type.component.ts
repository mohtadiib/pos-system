import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImagesGridService } from '../images-grid/images-grid.service';
import { TableDataService } from '../table-data.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-data-show-type',
  templateUrl: './data-show-type.component.html',
  styleUrls: ['./data-show-type.component.css'],
})
export class DataShowTypeComponent {
  @Input() header!: any;
  @Input() value!: any;
  @Input() record!: any;
  @Output() messageEvent = new EventEmitter<any>();
  payed: string = '';
  payType: string = '0';
  valueOfLinkedField: number = 0;

  deliveredItemObject = {
    delivered_qty: "",
    recipient_name: "",
    remark: "",
  }

  dueAmount: number = 0;
  constructor(
    public imagesGridService: ImagesGridService,
    private tableDataService: TableDataService,
    public authService: AuthService
  ) {}
  //Model
  isVisible = false;
  isVisibleCompleteModal = false;
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  showModalCompleteModal(): void {
    let modelType = this.header?.completeModel
    if(this.header?.deliverdModel){
      modelType = this.header?.deliverdModel
    }
    let key = modelType?.keyOfLinkedField
    this.valueOfLinkedField =
      +this.record[key];
    this.dueAmount = +this.value - this.valueOfLinkedField;
    this.isVisibleCompleteModal = true;
  }
  handleCancelCompleteModal(): void {
    this.isVisibleCompleteModal = false;
  }
  onOk() {
    let status = 0;
    if (+this.payed == this.dueAmount) status = 1;
    let realPay = this.payed;
    this.payed = (+this.payed + this.valueOfLinkedField).toString();
    let payedData = {
      table: "sales",
      data: {
        doc_id: this.record.doc_id,
        payed: this.payed,
        status: status,
        realPay: realPay,
        pay_type: this.payType,
      },
      adding: false
    }
    this.messageEvent.emit(payedData);
  }
  onOkDelivered() {
    let payedData = {
      table: "sale_delivery",
      data: {
        sale_item_id: this.record.doc_id,
        ...this.deliveredItemObject
      },
      adding: true
    }
    this.messageEvent.emit(payedData);
  }
  changePayed() {
    if (+this.payed > this.dueAmount) {
      this.payed = this.dueAmount.toString();
      this.tableDataService.createMessage(
        'warning',
        'لا يمكن ادخال مبلغ اكبر من المستحق'
      );
    }
  }
  changeDeliveredQty() {
    if (+this.deliveredItemObject.delivered_qty > this.dueAmount) {
      this.deliveredItemObject.delivered_qty = this.dueAmount.toString();
      this.tableDataService.createMessage(
        'warning',
        'لا يمكن ادخال كمية اكبر الكمية المتبقية'
      );
    }
  }

  getRoutes() {
    let routes = [];
    if (this.header?.type == 'details') {
      routes.push(this.header?.router[0]);
      routes.push(this.record.doc_id);
      if (this.header.setName) {
        routes.push(this.record.name);
      }
      if (this.header.setTitle) {
        routes.push(this.header.setTitle);
      }
      this.header?.router
        .filter((val: any, index: number) => index != 0)
        .forEach((route: any) => {
          routes.push(route);
        });
    }
    // console.log(routes)
    return routes;
  }

  getValue(value:any){
    if(typeof +value == 'number' && +value > 0){
      let numValue: number = +value
      return Number(numValue.toFixed(2));
    }else{
      return value
    }
  }
}
