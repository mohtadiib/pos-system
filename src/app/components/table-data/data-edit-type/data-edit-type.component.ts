import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup, ControlContainer, FormGroupDirective, FormControl} from '@angular/forms';
import {TableDataService} from "../table-data.service";

@Component({
  selector: 'app-data-edit-type',
  templateUrl: './data-edit-type.component.html',
  styleUrls: ['./data-edit-type.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class DataEditTypeComponent implements OnInit, AfterViewInit{
  @ViewChild('input') inputElement!: ElementRef;
  @Input() keyItem!: any;
  @Input() value!: any;
  @Input() header!: any;
  form!: FormGroup;
  choicesList: any[] = []
  isVisibleModel = false;
  constructor(private parent: FormGroupDirective, public tableDataService:TableDataService) {}
  ngOnInit() {
    this.form = this.parent.form;
    if (this.form.get(this.keyItem)){
      if (this.header?.type == 'online_list') {
        this.form.controls[this.keyItem].setValue(`${this.value.doc_id}`);
      }else{
        this.form.controls[this.keyItem].setValue(this.value);
      }
    }else {
      if (this.value == undefined || this.header?.type == 'list' ||
        this.header?.disabled) {
        this.form.addControl(this.keyItem, new FormControl({value: this.value, disabled: true}));
      }if (this.header?.type == 'online_list') {
        this.form.addControl(this.keyItem, new FormControl(`${this.value.doc_id}`));
      }else {
        this.form.addControl(this.keyItem, new FormControl(this.value));
      }
    }
    this.getInnerTableData()
  }
  getInnerTableData(){
    if (this.header?.type == 'online_list'){
      let body = {table:this.header.innerTableName}
      this.tableDataService.getData(body).subscribe(res=>{
        this.choicesList = res;
      })
    }
  }
  getChoicesList(){
    if (this.header?.type == "online_list"){
      return this.choicesList
    }
    return this.header.values
  }
  checkType(value:string){
    return this.header?.type == value
  }
  getTypeof =(value:any)=>typeof value
  ngAfterViewInit() {
    if (this.inputElement && !this.tableDataService.focusField){
      this.tableDataService.focusField = true
      this.inputElement.nativeElement.focus();
    }
  }
  showModal(): void {
    this.isVisibleModel = true;
  }
  handleCancel(): void {
    this.isVisibleModel = false;
  }
}
