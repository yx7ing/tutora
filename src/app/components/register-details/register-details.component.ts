import { Component, OnInit } from '@angular/core';
import { UploadDetailsService } from 'src/app/services/upload-details.service';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css']
})
export class RegisterDetailsComponent implements OnInit {

  detailsStep = 1;
  activeUploads = 0;
  tutExp = [];

  constructor(private udSrv: UploadDetailsService) { }

  ngOnInit() {
    this.udSrv.getActiveUploads().subscribe(
      results => this.activeUploads = results
    )
  }

}
