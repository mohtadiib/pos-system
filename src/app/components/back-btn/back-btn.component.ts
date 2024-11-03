import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-btn',
  templateUrl: './back-btn.component.html',
  styleUrls: ['./back-btn.component.css'],
})
export class BackBtnComponent {
  constructor(private location: Location) {}
  // Method to navigate back
  goBack(): void {
    this.location.back();
  }
}
