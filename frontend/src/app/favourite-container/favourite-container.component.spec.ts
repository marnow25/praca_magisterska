import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteContainerComponent } from './favourite-container.component';

describe('FavouriteContainerComponent', () => {
  let component: FavouriteContainerComponent;
  let fixture: ComponentFixture<FavouriteContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
