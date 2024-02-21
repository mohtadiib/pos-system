import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ar_EG } from 'ng-zorro-antd/i18n';
import {NgOptimizedImage, registerLocaleData} from '@angular/common';
import ar from '@angular/common/locales/ar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TableDataModule} from "./components/table-data/table-data.module";
import { PosComponent } from './pages/pos/pos.component';
import { CategoriesComponent } from './pages/pos/categories/categories.component';
import { PosSideComponent } from './pages/pos/pos-side/pos-side.component';
import { AuthComponent } from './pages/auth/auth.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {NzMessageService} from "ng-zorro-antd/message";

registerLocaleData(ar);

@NgModule({
    declarations: [
        AppComponent,
        PosComponent,
        CategoriesComponent,
        PosSideComponent,
        AuthComponent,
        DashboardComponent
    ],
  imports: [
    TableDataModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzInputModule,
    NzTableModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzCheckboxModule,
    NgOptimizedImage,
  ],
    providers: [
        {provide: NZ_I18N, useValue: ar_EG},
        NzMessageService,
    ],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
