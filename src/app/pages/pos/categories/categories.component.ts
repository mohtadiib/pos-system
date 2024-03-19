import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TableDataService} from "../../../components/table-data/table-data.service";
import {ImagesGridService} from "../../../components/table-data/images-grid/images-grid.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{
  @Output() messageEvent = new EventEmitter<string>();
  categories:any[] = []
  constructor(private dataService:TableDataService, public imagesGridService:ImagesGridService) {
    this.categories = [
      {title:"وجبة", select:true},
      {title:"ساندويتش", select:false},
      {title:"عصائر", select:false},
    ]
  }

  ngOnInit(): void {
    this.getData()
  }
  public getData(){
    let body = {table:"categories"}
    this.dataService.getData(body).subscribe(res=>{
      this.categories = res;
    })
  }

  select(index: any) {
    this.categories.forEach((value)=>{
      value.select = false
    })
    this.categories[index].select = true;
    this.messageEvent.emit(this.categories[index].doc_id)
  }

}
