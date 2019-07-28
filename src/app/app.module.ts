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
      {path: 'profile', component: TutorProfileComponent}
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
    LecturerCourseComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: false}),
    HttpClientModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatTabsModule
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
    AdminCreateLecturerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
