import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{
  validateForm!: UntypedFormGroup;
  loading:boolean = false
  confirmModal?: NzModalRef; // For testing by now

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
    public authService:AuthService,
    private router: Router
  ) {}
  //message
  createMessage(type: string,message:string = "تمت العملية بنجاح"): void {
    this.message.create(type, message);
  }

  submitForm(): void {
    console.log(this.validateForm.value)
    if (this.validateForm.valid) {
      this.loading = true
      this.authService.login(this.validateForm.value).subscribe((value:any) => {
        console.log(value)
        this.loading = false
        if(value.rightDevice){
          if (value.msg == "success"){
            this.authService.setToken(value.session)
            this.authService.sidePushing(value.session)
            this.router.navigate(['/']);
          }else {
            this.createMessage("error","خطأ في تسجيل الدخول")
          }
        }else{
          this.showConfirm()
        }
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'خطا في تسجيل الجهاز',
      nzContent: 'يبدو انك قمت بنقل النظام لجهاز اخر، وهو عمل غير اخلاقي بالمرة، يجب عليك الرجوع للشركة لتثبيت النظام على اجهزة جديدة',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 50);
        }).catch(() => console.log('Oops errors!')),
      nzOkText: "اسف على ذلك"
    });
  }
}
