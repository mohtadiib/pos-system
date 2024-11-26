import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { priceFormat } from 'src/app/common/math';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  @Input() saleId: string = ""
  @Input() userDebit: boolean = false
  operation: any = {}
  loading: boolean = false
  paymentForm: FormGroup<{
    amount: FormControl<string>;
    pay_type: FormControl<string>;
  }> = this.fb.group({
    amount: ['', [ Validators.required, Validators.min(1) ]],
    pay_type: ['1', [ Validators.required ]],
  });

  constructor(
    private router:Router,
    private fb: NonNullableFormBuilder,
     public activatedRoute: ActivatedRoute,
     private tableApiService:TableDataService,
     public authService :AuthService,
     public tableDataService:TableDataService
    ){}
  
  ngOnInit(): void {
    this.getSaleDetails()
    // console.log(this.paymentForm.controls["amount"])
  }
  getSaleDetails(){
    this.loading = true
    let path = `customs/sales/sale_details/?id=${this.saleId}`
    if(this.userDebit){
      path = `customs/users/get_debits/?id=${this.saleId}`
    }
    this.tableDataService.getDataWithGet(path).subscribe(res => {
      console.log(JSON.stringify(res))
      this.loading = false
      this.operation = res
      this.paymentForm.controls["amount"].setValidators([ Validators.required, Validators.min(1), Validators.max(this.getDue())])
    })
  }

  submitForm(): void {
    if (this.paymentForm.valid) {
      this.saveItem(()=> {
        this.paymentForm.reset()
        this.getSaleDetails()
      })
    } else {
      Object.values(this.paymentForm.controls).forEach((control:any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveItem(call:Function){
    
    let transactionsOpertionOrClient = "operation_id"
    let transactionsType = 0

    if(this.userDebit){
      // transactionsOpertionOrClient = "client_id"
      transactionsType = 4
    }
  

    this.loading = true
    let data = {
      amount: this.operation?.total,
      type: transactionsType,
      [transactionsOpertionOrClient]: this.saleId,
      ...this.paymentForm.value
    }
    this.tableApiService.saveData(
      "transactions",
      true,
      data,
      false
    ).subscribe((res:any)=> {
      console.log(res)
      this.loading = false
      if (res.msg == true){
        this.getSaleDetails()
        this.tableApiService.createMessage('success',`تمت العملية بنجاح`)
        this.tableApiService.focusField = false
        call()
      }else {
        if (res.msg == "Session Error"){
          this.tableApiService.createMessage('error',"خطا في الجلسة اعد تسجيل الدخول")
        }else {
          this.tableApiService.createMessage('error',res?.msg)
        }
      }
    })
  }

  goToTransactions() {
    let title = "فاتورة"
    if(this.userDebit)
      title = "ديون"

    let type = "operation"
    if(this.userDebit)
      type = "debit"

    this.router.navigate(["operation_transactions",this.saleId,title,type])
  }  

  getTotal = () => priceFormat(this.operation?.total)
  getPayed = () => priceFormat(this.operation?.payed)
  getDue = () => +this.operation?.total - this.operation?.payed
  getDueAmount = () => priceFormat(this.getDue())

  getDebitTitle = () => this.operation?.role == "2"?"( دائن )":"( مدين )"

}
