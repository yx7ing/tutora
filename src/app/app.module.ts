// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// angularfire
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

// angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';

// app files
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { FirebaseService } from './services/firebase.service';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { UserService } from './core/user.service';
import { DropZoneDirective } from './directives/drop-zone.directive';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminHomeComponent } from './components/app-components-admin/admin-home/admin-home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminComponent } from './components/app-components-admin/admin/admin.component';
import { LecturerComponent } from './components/app-components-lecturer/lecturer/lecturer.component';
import { TutorComponent } from './components/app-components-tutor/tutor/tutor.component';
import { LecturerHomeComponent } from './components/app-components-lecturer/lecturer-home/lecturer-home.component';
import { TutorHomeComponent } from './components/app-components-tutor/tutor-home/tutor-home.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';
import { AdminCreateLecturerComponent } from './components/app-components-admin/admin-create-lecturer/admin-create-lecturer.component';
import { UploadComponent } from './components/upload/upload.component';
import { RegisterDetailsComponent } from './components/register-details/register-details.component';
import { TutorProfileComponent } from './components/app-components-tutor/tutor-profile/tutor-profile.component';
import { LecturerCourseComponent } from './components/app-components-lecturer/lecturer-course/lecturer-course.component';
import { TutorApplyComponent } from './components/app-components-tutor/tutor-apply/tutor-apply.component';
import { TutorApplyApplicationComponent } from './components/app-components-tutor/tutor-apply-application/tutor-apply-application.component';
import { LecturerCourseApplicationComponent } from './components/app-components-lecturer/lecturer-course-application/lecturer-course-application.component';
import { LecturerCourseAssignComponent } from './components/app-components-lecturer/lecturer-course-assign/lecturer-course-assign.component';
import { TutorNotificationsComponent } from './components/app-components-tutor/tutor-notifications/tutor-notifications.component';

const appRoutes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'register-details', component: RegisterDetailsComponent},
  {path: '_', component: LoginRedirectComponent},
  {path: 'midna', component: AdminComponent,
   children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: AdminHomeComponent}
   ]
  },
  {path: 'crelture', component: LecturerComponent,
   children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: LecturerHomeComponent},
      {path: 'course', component: LecturerCourseComponent}
   ]
  },
  {path: 'trout', component: TutorComponent,
   children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: TutorHomeComponent},
      {path: 'profile', component: TutorProfileComponent},
      {path: 'apply', component: TutorApplyComponent},
      {path: 'notif', component: TutorNotificationsComponent}
   ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminHomeComponent,
    NavbarComponent,
    AdminComponent,
    LecturerComponent,
    TutorComponent,
    LecturerHomeComponent,
    TutorHomeComponent,
    LoginRedirectComponent,
    AdminCreateLecturerComponent,
    DropZoneDirective,
    UploadComponent,
    RegisterDetailsComponent,
    TutorProfileComponent,
    LecturerCourseComponent,
    TutorApplyComponent,
    TutorApplyApplicationComponent,
    LecturerCourseApplicationComponent,
    LecturerCourseAssignComponent,
    TutorNotificationsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: false}),
    HttpClientModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,

    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatSortModule,
    MatMenuModule
  ],
  providers: [
    AngularFirestore,
    AngularFireStorage,
    FirebaseService,
    AuthService,
    AuthGuard,
    UserService
  ],
  entryComponents: [
    AdminCreateLecturerComponent,
    TutorApplyApplicationComponent,
    LecturerCourseApplicationComponent,
    LecturerCourseAssignComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
