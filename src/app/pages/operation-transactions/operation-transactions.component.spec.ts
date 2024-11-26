import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTransactionsComponent } from './operation-transactions.component';

describe('OperationTransactionsComponent', () => {
  let component: OperationTransactionsComponent;
  let fixture: ComponentFixture<OperationTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
