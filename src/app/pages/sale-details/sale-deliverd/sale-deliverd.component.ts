import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import DataSources from 'src/app/common/data_sources/data-sources';
import { TableData } from 'src/app/common/data_sources/side-model';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sale-deliverd',
  templateUrl: './sale-deliverd.component.html',
  styleUrls: ['./sale-deliverd.component.css']
})
export class SaleDeliverdComponent {
  @Input() saleId = ""
  userForm = new FormGroup({});
  tableData:TableData = new DataSources().workerDeliverdModel
  keysEditModel: any[] = [];
  loading:boolean = false
  itemsDelivered: boolean = false
  updateSaleDelivery: boolean = false
  saleDelivery: any = {}

  checkIsRequired = (header:any) => header?.validators?.values


  constructor(
    public activatedRoute: ActivatedRoute,
    private tableApiService:TableDataService,
    public tableDataService:TableDataService,
     public authService :AuthService){
  }

  sePatientTotForm(saleDelivery:any){
    if(saleDelivery.doc_id){
      this.itemsDelivered = true
      Object.keys(this.userForm.controls).forEach(key=> {
        if(Object.keys(saleDelivery).find(item => item == key)){
          this.userForm.get(key)?.setValue(saleDelivery[key])
          this.userForm.get(key)!.disable();
        }
      })
    }
  }

  getSaleDelivery(){
    this.loading = true
    const path = `customs/sale_delivery/?id=${this.saleId}`
    this.tableDataService.getDataWithGet(path).subscribe(res => {
      console.log(JSON.stringify(res))
      this.loading = false
      this.saleDelivery = res
      this.sePatientTotForm(res)
    })
  }
  
  ngOnInit(): void {
    this.keysEditModel = Object.keys(this.tableData.model);
    this.getSaleDelivery()
  }

  submitForm(): void {
    if (this.userForm.valid) {
      this.saveItem(()=> {
        this.lockForm()
      })
     
    } else {
      Object.values(this.userForm.controls).forEach((control:any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveItem(call:Function){
    this.loading = true
    let body = {
      doc_id: this.saleDelivery?.doc_id,
      sale_id: this.saleId,
      ...this.userForm.value
    }
    let method = "customs/sale_delivery/insert/"
    this.tableApiService.saveDataCustom(
      body,
      method
    ).subscribe((res:any)=> {
      this.loading = false
      if (res.msg == true){
        this.tableApiService.createMessage('success',`تم حفظ البيانات بنجاح`)
        this.tableApiService.focusField = false
        call()
      }else {
        if (res.msg == "Session Error"){
          this.tableApiService.createMessage('error',"حدث خطا ما")
        }else {
          this.tableApiService.createMessage('error',res?.content)
        }
      }
    })
  }

  setUpdateMode(){
    this.updateSaleDelivery = !this.updateSaleDelivery
    if(this.updateSaleDelivery){
      Object.keys(this.userForm.controls).forEach(key=> {
        if(Object.keys(this.saleDelivery).find(item => item == key)){
          this.userForm.get(key)!.enable();
        }
      }) 
    }else{
      this.lockForm()
    }
  }

  lockForm(){
    Object.keys(this.userForm.controls).forEach(key=> {
      if(Object.keys(this.saleDelivery).find(item => item == key)){
        this.userForm.get(key)!.disable();
      }
    })
    this.updateSaleDelivery = false
  }

}
