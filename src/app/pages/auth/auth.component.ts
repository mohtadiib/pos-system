import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{
  validateForm!: UntypedFormGroup;
  loading:boolean = false
  constructor(
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
        this.loading = false
        if (value.msg == "success"){
          this.authService.setToken(value.session)
          this.authService.sidePushing(value.session)
          this.router.navigate(['/']);
        }else {
          this.createMessage("error","خطأ في تسجيل الدخول")
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
}
