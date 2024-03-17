import { Component } from '@angular/core';
import {GlobalVariable} from "../../../../common/consts";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  URL= GlobalVariable.BASE_API_URL+"upload/index.php";
  myFiles:string [] = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required])
  });
  constructor(private http: HttpClient) { }
  get f(){
    return this.myForm.controls;
  }
  onFileChange(event:any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
  }
  submit(){
    const formData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      formData.append("file[]", this.myFiles[i]);
    }
    this.http.post(this.URL, formData)
      .subscribe(res => {
        console.log(res);
      })
  }
}
