import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixListContainerComponent } from './matrix-list-container.component';

describe('MatrixListContainerComponent', () => {
  let component: MatrixListContainerComponent;
  let fixture: ComponentFixture<MatrixListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
