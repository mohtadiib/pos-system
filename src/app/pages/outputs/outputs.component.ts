import { Component } from '@angular/core';
import { Router } from '@angular/router';
import DataSources from 'src/app/common/data_sources/data-sources';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.css']
})
export class OutputsComponent {
  constructor(private router:Router){
    router.navigate(["/expenses/outputs"])
  }
}
