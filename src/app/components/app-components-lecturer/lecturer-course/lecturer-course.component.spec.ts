import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerCourseComponent } from './lecturer-course.component';

describe('LecturerCourseComponent', () => {
  let component: LecturerCourseComponent;
  let fixture: ComponentFixture<LecturerCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturerCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
