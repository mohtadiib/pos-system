import { NgModule } from '@angular/core';
import {TableDataComponent} from "./table-data.component";
import {CommonModule} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTableModule} from "ng-zorro-antd/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzTagModule} from "ng-zorro-antd/tag";
import {DataShowTypeComponent} from "./data-show-type/data-show-type.component";
import {DataEditTypeComponent} from "./data-edit-type/data-edit-type.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzModalModule} from "ng-zorro-antd/modal";
// import {ViewTeacherComponent} from "../../pages/teachers/view-teacher/view-teacher.component";
import {UserInfoComponent} from "../user-info/user-info.component";
// import {ProfileComponent} from "../../pages/teachers/view-teacher/profile/profile.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {PagesComponent} from "../../pages/pages/pages.component";
import {RouterLink} from "@angular/router";
import {NzFormModule} from "ng-zorro-antd/form";
import {ImagesGridComponent} from "./images-grid/images-grid.component";
import {UploadComponent} from "./images-grid/upload/upload.component";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { UserDetailsComponent } from 'src/app/pages/user-details/user-details.component';
import { SaleDetailsComponent } from 'src/app/pages/sale-details/sale-details.component';
import { InvoiceComponent } from '../invoice/invoice.component';
import { SaleDeliverdComponent } from 'src/app/pages/sale-details/sale-deliverd/sale-deliverd.component';
import { ProductsComponent } from 'src/app/pages/products/products.component';
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { HeaderComponent } from '../invoice/header/header.component';
import { InfoComponent } from '../invoice/info/info.component';
import { ItemsTableComponent } from '../invoice/items-table/items-table.component';
import { DownloadBtnComponent } from '../invoice/download-btn/download-btn.component';
import { PdfReportsComponent } from './pdf-reports/pdf-reports.component';
import { BackBtnComponent } from '../back-btn/back-btn.component';
import { DashboardDetailsComponent } from 'src/app/pages/dashboard/dashboard-details/dashboard-details.component';
import { ReportTableDataComponent } from 'src/app/pages/dashboard/dashboard-details/report-table-data/report-table-data.component';
import { PaymentComponent } from 'src/app/pages/sale-details/payment/payment.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { OperationTransactionsComponent } from 'src/app/pages/operation-transactions/operation-transactions.component';
import { UserWalletComponent } from 'src/app/pages/user-details/user-wallet/user-wallet.component';

@NgModule({
    imports: [
        CommonModule,
        NzButtonModule,
        NzTableModule,
        FormsModule,
        NzPopconfirmModule,
        NzInputModule,
        NzIconModule,
        NzDividerModule,
        NzTagModule,
        NzSelectModule,
        NzModalModule,
        ReactiveFormsModule,
        NzTabsModule,
        NzCardModule,
        NzSkeletonModule,
        NzAvatarModule,
        RouterLink,
        NzFormModule,
        NzPaginationModule,
        NzInputNumberModule,
        NzSwitchModule,
        NzResultModule
    ],
  declarations: [
    TableDataComponent,
    DataShowTypeComponent,
    DataEditTypeComponent,
    // ViewTeacherComponent,
    UserInfoComponent,
    // ProfileComponent,
    PagesComponent,
    ImagesGridComponent,
    UploadComponent,
    UserDetailsComponent,
    SaleDetailsComponent,
    InvoiceComponent,
    SaleDeliverdComponent,
    ProductsComponent,
    HeaderComponent,
    InfoComponent,
    ItemsTableComponent,
    DownloadBtnComponent,
    PdfReportsComponent,
    BackBtnComponent,
    DashboardDetailsComponent,
    ReportTableDataComponent,
    PaymentComponent,
    OperationTransactionsComponent,
    UserWalletComponent
  ],
  exports: [
    TableDataComponent,
    DataShowTypeComponent,
    DataEditTypeComponent,
    // ViewTeacherComponent,
    UserInfoComponent,
    // ProfileComponent,
    PagesComponent
  ]
})
export class TableDataModule { }
