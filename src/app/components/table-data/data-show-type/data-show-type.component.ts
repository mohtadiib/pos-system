import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  constructor(public imagesGridService: ImagesGridService, private tableDataService:TableDataService, public authService:AuthService) {}
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
    this.isVisibleCompleteModal = true;
  }
  handleCancelCompleteModal(): void {
    this.isVisibleCompleteModal = false;
  }
  onOk() {
    let status = 0
    if (this.payed == this.value)
      status = 1
    let payedData = {doc_id: this.record.doc_id,payed: this.payed, debt_status: status}
    this.messageEvent.emit(payedData)
  }
  changePayed() {
    if (+this.payed > +this.value){
       this.payed = this.value
      this.tableDataService.createMessage("warning","لا يمكن ادخال مبلغ اكبر من المستحق")
    }
  }
}
