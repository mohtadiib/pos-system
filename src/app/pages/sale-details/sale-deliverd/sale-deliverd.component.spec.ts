import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDeliverdComponent } from './sale-deliverd.component';

describe('SaleDeliverdComponent', () => {
  let component: SaleDeliverdComponent;
  let fixture: ComponentFixture<SaleDeliverdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleDeliverdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDeliverdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
