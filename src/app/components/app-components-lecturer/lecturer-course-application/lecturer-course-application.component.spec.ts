import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerCourseApplicationComponent } from './lecturer-course-application.component';

describe('LecturerCourseApplicationComponent', () => {
  let component: LecturerCourseApplicationComponent;
  let fixture: ComponentFixture<LecturerCourseApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturerCourseApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerCourseApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
