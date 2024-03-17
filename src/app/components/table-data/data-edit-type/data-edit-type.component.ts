import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, ControlContainer, FormGroupDirective, FormControl} from '@angular/forms';
import {TableDataService} from "../table-data.service";
import {ImagesGridService} from "../images-grid/images-grid.service";

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
  @Output() setSizeField = new EventEmitter<any>()
  form!: FormGroup;
  choicesList: any[] = []
  constructor(private parent: FormGroupDirective, public tableDataService:TableDataService, public imagesGridService: ImagesGridService) {}
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
      }else if (this.header?.type == 'image_view') {
        this.form.addControl(this.keyItem, new FormControl(`${this.tableDataService.selectedImage.image}`));
      }else {
        this.form.addControl(this.keyItem, new FormControl(this.value));
      }
    }
    this.getInnerTableData()
  }
  getInnerTableData(){
    if (this.header?.type == 'online_list'){
      let body = {table:this.header.innerTableName}
      this.tableDataService.getData(body).subscribe(res=> {
        console.log(res)
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

  setChangeSize() {
    if (this.header.categoryPrice){
      this.setSizeField.emit()
    }
  }

  setPrice(event:any) {
    console.log(this.header.categoryPrice)
    if (!event && this.header?.type == "online_list" && this.header.categoryPrice){
      let price = this.choicesList.find(value => value.doc_id == this.form.get(this.header.categoryPrice.keyItem)?.value).price
      this.setSizeField.emit(price)
    }
  }

  protected readonly event = event;
}
