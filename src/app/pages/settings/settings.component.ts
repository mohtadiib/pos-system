import { Component } from '@angular/core';
import { Router } from '@angular/router';
import DataSources from 'src/app/common/data_sources/data-sources';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(private router:Router){
    router.navigate(["/settings/categories"])
  }
}
