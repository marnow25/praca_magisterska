import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinesContainerComponent } from './timelines-container.component';

describe('TimelinesContainerComponent', () => {
  let component: TimelinesContainerComponent;
  let fixture: ComponentFixture<TimelinesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
