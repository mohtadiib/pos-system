import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {GlobalVariable} from "../common/consts";
import {HttpClient} from "@angular/common/http";
import DataSources from "../common/data_sources/data-sources";
import { Session } from './session-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  sessionUser: Session = {};
  appConfig = {price:""}
  isAdmin:boolean = false
  sideBarList: any[] = [];
  settingsList: any[] = [];
  outputsList: any[] = [];
  constructor(
    private http:HttpClient,
    private router: Router
  ) {
    this.getSessionStatus()
  //   if(!this.isUserHasRole()){
  //     router.navigate(['/']);
  // }
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
    console.log(JSON.stringify(body))
    return  this.http.post<any[]>(GlobalVariable.BASE_API_URL+"auth/sessions/",body)
      .subscribe((value:any) => {
        this.appConfig = value.appConfig
        // console.log(this.appConfig);
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

  sidePushing(session:Session){
    // console.log("side push")
    this.isAdmin = session.isAdmin!
    this.sessionUser = session
    this.sideBarList = []
    this.outputsList = []
    this.settingsList = []
    // console.log("session: ",session)
    // if (session.isAdmin){
    //   console.log("is Admin side push")
    //   this.sideBarList =  new DataSources().pagesDataTable
    //   this.settingsList =  new DataSources().settingsList.filter(item=> !item?.hidAsBarButton)
    //   this.outputsList =  new DataSources().outputsList.filter(item=> !item?.hidAsBarButton)
    // }else {
    //   new DataSources().pagesDataTable.forEach(value => {
    //     let perList: number[] = value.permissionsUserRole ?? [];
    //     if (perList.includes(+session.permissionType!) || !perList.length && !value?.hidAsBarButton){
    //       this.sideBarList.push(value)
    //       }
    //   })
    //   new DataSources().settingsList.forEach(value => {
    //     let perList: number[] = value.permissions ?? [];
    //       if (perList.includes(+session.permissionType!) || !perList.length && !value?.hidAsBarButton){
    //         this.settingsList.push(value)
    //       }
    //   })
    //   new DataSources().outputsList.forEach(value => {
    //     let perList: number[] = value.permissions ?? [];
    //       if (perList.includes(+session.permissionType!) || !perList.length && !value?.hidAsBarButton){
    //         this.outputsList.push(value)
    //       }
    //   })
    // }
    new DataSources().pagesDataTable.forEach(value => {
      let perList: number[] = value.permissionsUserRole ?? [];
      if (perList.includes(+session.permissionType!) || !perList.length && !value?.hidAsBarButton){
        this.sideBarList.push(value)
        }
    })
    new DataSources().settingsList.forEach(value => {
      let perList: number[] = value.permissions ?? [];
        if (perList.includes(+session.permissionType!) || !perList.length && !value?.hidAsBarButton){
          this.settingsList.push(value)
        }
    })
    new DataSources().outputsList.forEach(value => {
      let perList: number[] = value.permissions ?? [];
        if (perList.includes(+session.permissionType!) || !perList.length && !value?.hidAsBarButton){
          this.outputsList.push(value)
        }
    })
  }


  isUserHasRole(requestedRoute:string){
    // let page = this.sideBarList.find(value=>value.router == requestedRoute)
    // // let page = new DataSources().pagesDataTable.find(value=>value.router == requestedRoute)
    // let permissionsRoles: number[] = page?.permissionsUserRole || []
    // let userRole:number = +this.sessionUser.permissionType! || 0
    // // return page?true:false
    // // return permissionsRoles.includes(userRole) || !permissionsRoles.length
    // return tr
  }

  getDepartmentName(){
    let deparment = "المدير"

    if(this.isSales()){
      deparment = "المبيعات"
    }else if(this.isStock()){
      deparment = "المخزن"
    }
    
    return deparment
  }

  isManager = () => this.sessionUser.isAdmin
  isStock = () => this.sessionUser.permissionType == "4"
  isSales = () => this.sessionUser.permissionType == "0"
}
