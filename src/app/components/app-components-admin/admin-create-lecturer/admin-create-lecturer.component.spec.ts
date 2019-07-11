import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateLecturerComponent } from './admin-create-lecturer.component';

describe('AdminCreateLecturerComponent', () => {
  let component: AdminCreateLecturerComponent;
  let fixture: ComponentFixture<AdminCreateLecturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateLecturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateLecturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
