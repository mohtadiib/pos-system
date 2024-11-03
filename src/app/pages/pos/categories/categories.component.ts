import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TableDataService } from '../../../components/table-data/table-data.service';
import { ImagesGridService } from '../../../components/table-data/images-grid/images-grid.service';
import { GlobalVariable } from 'src/app/common/consts';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  categories: any[] = [];
  imageUrl: string = GlobalVariable.BASE_API_URL_IMAGES;
  getImage = (cat: any) =>
    cat.category_image
      ? this.imageUrl + cat.category_image
      : './assets/img/logo_grey.png';
  constructor(
    private dataService: TableDataService,
    public imagesGridService: ImagesGridService
  ) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.getData();
  }
  public getData() {
    let body = { table: 'categories' };
    this.dataService.getData(body).subscribe((res) => {
      this.categories = res;
    });
  }

  select(index: any,clear:boolean = false) {
    if (clear) {
      this.categories.forEach((cat:any)=>{
        cat.select = false
      })
      this.messageEvent.emit("");
    } else {
      this.categories.forEach((value) => {
        value.select = false;
      });
      this.categories[index].select = true;
      this.messageEvent.emit(this.categories[index].doc_id)
    }
  }
}
