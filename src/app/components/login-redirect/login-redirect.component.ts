import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css']
})
export class LoginRedirectComponent implements OnInit {

  loading: number = 1;

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit() {
    setInterval(this.increment.bind(this), 800);

    this.authSrv.getCurrentUser().subscribe(
      response => {
        if (response) {
          switch(response.type){
            case "admin":
              this.router.navigate(['/midna']);
              break;
            case "lecturer":
                this.router.navigate(['/crelture']);
                break;
            case "tutor":
                this.router.navigate(['/trout']);
                break;
          }
        }
      }
    );
  }

  increment() {
    this.loading++;
    if (this.loading > 3) this.loading = 1;
  }

}
