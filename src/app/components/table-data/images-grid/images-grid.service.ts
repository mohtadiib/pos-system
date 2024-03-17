import { Injectable } from '@angular/core';
import {TableDataService} from "../table-data.service";
import {GlobalVariable} from "../../../common/consts";

@Injectable({
  providedIn: 'root'
})
export class ImagesGridService {
  images: any[] = []
  imageUrl: string = GlobalVariable.BASE_API_URL_IMAGES
  constructor(private tableDataService: TableDataService) { }
  getImages(){
    const body = {"table":"images"}
    this.tableDataService.getData(body).subscribe(value => {
      // console.log(value)
      this.images = value
    })
  }
  setSelected(image:any){
    this.images.forEach(value => {
      if (image.selected != 1){
         value.selected = 0
      }
    })
    image.selected++
    if (image.selected == 2){
      this.tableDataService.isVisibleModel = false
      this.tableDataService.selectedImage = image
    }
  }
}
