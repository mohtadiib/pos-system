import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableDataService } from 'src/app/components/table-data/table-data.service';
import { priceFormat } from 'src/app/common/math';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.css']
})
export class UserWalletComponent {
  @Input() userId: string = ""
  loading: boolean = false
  userWallet: any = {}
  paymentForm: FormGroup<{
    amount: FormControl<string>;
  }> = this.fb.group({
    amount: ['', [ Validators.required, Validators.min(1) ]],
  });

  constructor(
    private router:Router,
    private fb: NonNullableFormBuilder,
     public activatedRoute: ActivatedRoute,
     private tableApiService:TableDataService,
    ){}

    ngOnInit(): void {
      this.getSaleDetails()
      // console.log(this.paymentForm.controls["amount"])
    }
    getSaleDetails(){
      this.loading = true
      let path = `customs/users/wallet/?id=${this.userId}`
      this.tableApiService.getDataWithGet(path).subscribe(res => {
        console.log(JSON.stringify(res))
        this.loading = false
        this.userWallet = res
        this.paymentForm.controls["amount"].setValidators([ Validators.required, Validators.min(1), Validators.max(1000000000)])
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
  
      this.loading = true
      let data = {
        client_id: this.userId,
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
      let title = "محفظة عميل"
  
      let type = "wallet"
  
      this.router.navigate(["operation_transactions",this.userId,title,type])
    }  
  
    getTotal = () => priceFormat(this.userWallet?.total)


}
