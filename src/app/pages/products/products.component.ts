import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import DataSources from 'src/app/common/data_sources/data-sources';
import { TableData } from 'src/app/common/data_sources/side-model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  sideBarItem: any = new DataSources().settingsList.find(value => value.path == "products");
  tableData: TableData = {}
  category: any = ""
  pageTitle: string = "المنتجات/ ";
  constructor(private activatedRoute:ActivatedRoute) {
    let id = activatedRoute.snapshot.paramMap.get('id')!
    let name = activatedRoute.snapshot.paramMap.get('name')!
    this.category = { id: id, name: name }
    this.pageTitle += this.category.name
  }
  ngOnInit(): void {
    console.log("category: ",this.category.id)
    this.tableData = this.sideBarItem.tableData
    this.tableData.customApiBody.foreignField = {category_id: this.category.id}
    console.log("customApiBody: ", this.tableData.customApiBody)
    // this.tableData.customApiBody.where = ` category_id = ${this.categoryId}`
  }

}
