import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorApplyComponent } from './tutor-apply.component';

describe('TutorApplyComponent', () => {
  let component: TutorApplyComponent;
  let fixture: ComponentFixture<TutorApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
