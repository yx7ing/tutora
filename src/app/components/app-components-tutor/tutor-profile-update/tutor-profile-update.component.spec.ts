import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorProfileUpdateComponent } from './tutor-profile-update.component';

describe('TutorProfileUpdateComponent', () => {
  let component: TutorProfileUpdateComponent;
  let fixture: ComponentFixture<TutorProfileUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorProfileUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
