import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorNotificationsComponent } from './tutor-notifications.component';

describe('TutorNotificationsComponent', () => {
  let component: TutorNotificationsComponent;
  let fixture: ComponentFixture<TutorNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
