import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {GlobalVariable} from "../common/consts";
import {HttpClient} from "@angular/common/http";
import DataSources from "../common/data_sources/data-sources";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  department = {
    name:"",
    user:"",
    userId:"",
    permissionType:1,
    departmentId:1
  };
  isAdmin:boolean = false
  sideBarList: any[] = [];
  constructor(
    private http:HttpClient,
    private router: Router
  ) {
    this.getSessionStatus()
  }
  getAuthStatus(){
    return this.isLoggedIn()
  }
  //
  public login(body:any) {
    return  this.http.post<any[]>(GlobalVariable.BASE_API_URL+"auth/",body);
  }
  public getSessionStatus() {
    const body = {sessionId:this.getToken()}
    // console.log(JSON.stringify(body))
    return  this.http.post<any[]>(GlobalVariable.BASE_API_URL+"auth/sessions/",body)
      .subscribe((value:any) => {
        console.log(value)
        if (value.running === true){
          this.sidePushing(value.session)
        }else{
          this.logout()
        }
    });
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }
  public setToken(session:any) {
      return localStorage.setItem(this.tokenKey,session.sessionId);
  }

  sidePushing(session:any){
    console.log("side push")
    this.isAdmin = session.isAdmin
    this.department = {
      name: session.departmentName,
      user: session.name,
      userId: session.user_id,
      permissionType: +session.permissionType,
      departmentId: +session.departmentId
    }
    this.sideBarList = []
    if (session.isAdmin){
      this.sideBarList =  new DataSources().pagesDataTable
    }else {
      new DataSources().pagesDataTable.forEach(value => {
        let perList: number[] = value.permissions ?? [];
        // console.log(JSON.stringify(perList.includes(1)))
          if (perList.includes(+session.permissionType)){
            this.sideBarList.push(value)
          }
      })
    }
  }

  isDepartment = () => this.department.permissionType == 0
  isManager = () => this.department.permissionType == 1
}
