import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerCourseAssignComponent } from './lecturer-course-assign.component';

describe('LecturerCourseAssignComponent', () => {
  let component: LecturerCourseAssignComponent;
  let fixture: ComponentFixture<LecturerCourseAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturerCourseAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerCourseAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
