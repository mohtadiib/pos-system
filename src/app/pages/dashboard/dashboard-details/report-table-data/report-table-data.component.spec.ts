import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTableDataComponent } from './report-table-data.component';

describe('ReportTableDataComponent', () => {
  let component: ReportTableDataComponent;
  let fixture: ComponentFixture<ReportTableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
