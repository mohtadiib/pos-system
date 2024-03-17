import {Component, OnInit} from '@angular/core';
import { NzMarks } from 'ng-zorro-antd/slider';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {GlobalVariable} from "../../../common/consts";
import {TableDataService} from "../table-data.service";
import {ImagesGridService} from "./images-grid.service";

@Component({
  selector: 'app-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.css']
})
export class ImagesGridComponent implements OnInit{
  hGutter = 16;
  vGutter = 16;
  constructor(public imagesGridService: ImagesGridService) {
  }
  ngOnInit(): void {
    this.imagesGridService.getImages()
  }

}
