import { Component, Input } from '@angular/core';
import { getCurrentDate } from 'src/app/common/math';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  @Input() sale: any = {}
  currentDate: string = getCurrentDate()
  resultDocId:string = ""
  loading:boolean = false
  operation: any = {}
}
