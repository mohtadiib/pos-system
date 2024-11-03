import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImagesGridService} from "../images-grid/images-grid.service";
import {TableDataService} from "../table-data.service";
import {AuthService} from "../../../services/auth.service";
@Component({
  selector: 'app-data-show-type',
  templateUrl: './data-show-type.component.html',
  styleUrls: ['./data-show-type.component.css']
})
export class DataShowTypeComponent{
  @Input() header!: any;
  @Input() value!: any;
  @Input() record!: any;
  @Output() messageEvent = new EventEmitter<any>()
  payed: string = ""
  valueOfLinkedField: number = 0
  dueAmount: number = 0
  constructor(public imagesGridService: ImagesGridService, private tableDataService:TableDataService, public authService:AuthService) {
  }
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
    this.valueOfLinkedField = +this.record[this.header?.completeModel?.keyOfLinkedField]
    this.dueAmount = +this.value - this.valueOfLinkedField
    this.isVisibleCompleteModal = true;
  }
  handleCancelCompleteModal(): void {
    this.isVisibleCompleteModal = false;
  }
  onOk() {
    let status = 0
    if (+this.payed == this.dueAmount)
      status = 1
    let realPay = this.payed
    this.payed = (+this.payed + this.valueOfLinkedField).toString()
    let payedData = { doc_id: this.record.doc_id, payed: this.payed, debt_status: status, realPay: realPay }
    this.messageEvent.emit(payedData)
  }
  changePayed() {
    if (+this.payed > this.dueAmount){
       this.payed = this.dueAmount.toString()
      this.tableDataService.createMessage("warning","لا يمكن ادخال مبلغ اكبر من المستحق")
    }
  }
  
  getRoutes(){
    let routes = []
    if(this.header?.type == 'details'){
      routes.push(this.header?.router[0])
      routes.push(this.record.doc_id)
      if(this.header.setName){
        routes.push(this.record.name)
      }
      this.header?.router.filter((val:any,index:number)=> index != 0).forEach((route:any)=>{
        routes.push(route)
      })
    }
    // console.log(routes)
   return routes
  }
}
