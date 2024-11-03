import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  FormControl,
  Validators,
  NonNullableFormBuilder
} from '@angular/forms';
import {TableDataService} from "../table-data.service";
import {ImagesGridService} from "../images-grid/images-grid.service";
import { GlobalVariable } from 'src/app/common/consts';

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
  @Input() selectedListItem!: any;
  @Output() setSizeField = new EventEmitter<any>()
  imageUrl: string = GlobalVariable.BASE_API_URL_IMAGES
  form!: FormGroup;
  choicesList: any[] = []
  constructor(
    private parent: FormGroupDirective,
    public tableDataService:TableDataService,
  ) {}
  ngOnInit() {
    this.setFormControllers()
  }
  setFormControllers(){
    this.form = this.parent.form;
    if (this.form.get(this.keyItem)){
      if (this.header?.type == 'online_list') {
        this.form.controls[this.keyItem].setValue(`${this.value.doc_id}`);
      }else if (this.header?.type == 'image_view') {
        this.tableDataService.selectedImage.image = this.value
      }else {
        this.form.controls[this.keyItem].setValue(this.value);
      }
    }else {
      if (this.value == undefined || this.header?.type == 'list' ||
        this.header?.disabled) {
        this.form.addControl(this.keyItem, new FormControl({value: this.value, disabled: true}));
      }if (this.header?.type == 'online_list') {
        this.form.addControl(this.keyItem, new FormControl(`${this.value.doc_id}`));
      }else if (this.header?.type == 'image_view') {
        this.form.addControl(this.keyItem, new FormControl(`${this.tableDataService.selectedImage.image}`));
      }else {
        this.form.addControl(this.keyItem, new FormControl(this.value,this.header?.validators?.values));
      }
    }
    this.getInnerTableData()
  }
  getInnerTableData(){
    if (this.header?.type == 'online_list'){
      let body = {table: this.header.innerTableName, where: this.header.where}
      this.tableDataService.getData(body).subscribe(res=> {
        // console.log(res)
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
  getTypeof =(value:any)=> typeof value
  ngAfterViewInit() {
    if (this.inputElement && !this.tableDataService.focusField){
      this.tableDataService.focusField = true
      this.inputElement.nativeElement.focus();
    }
  }
  showModal(): void {
    this.tableDataService.isVisibleModel = true;
  }
  handleCancel(): void {
    this.tableDataService.isVisibleModel = false;
  }
  afterModalClose() {
    if (this.header?.type == 'image_view'){
      this.form.controls[this.keyItem].setValue(this.tableDataService.selectedImage.image);
    }
  }

  inputChange(event:any) {
    if (this.header.categoryPrice){
      this.setSizeField.emit()
    }
    if (this.header.setField){
      let name = this.selectedListItem.name
      let value = name + " " + event.target.value
      this.form.controls[this.header?.setField].setValue(value);
    }
  }

  setPrice(event:any) {
    if (!event && this.header?.type == "online_list" && this.header.categoryPrice){
      let item = this.choicesList.find(value => value.doc_id == this.form.get(this.keyItem)?.value)
      this.setSizeField.emit(item)
      if (this.header?.setField){
        this.form.controls[this.header?.setField].setValue(item.name);
      }
    }
  }
}
