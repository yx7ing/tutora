import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorApplyApplicationComponent } from './tutor-apply-application.component';

describe('TutorApplyApplicationComponent', () => {
  let component: TutorApplyApplicationComponent;
  let fixture: ComponentFixture<TutorApplyApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorApplyApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorApplyApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
