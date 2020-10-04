import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterMatrixComponent } from './filter-matrix.component';

describe('FilterMatrixComponent', () => {
  let component: FilterMatrixComponent;
  let fixture: ComponentFixture<FilterMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
