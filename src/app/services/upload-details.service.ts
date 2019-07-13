import { Injectable } from '@angular/core';
import { Upload } from '../models/upload';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDetailsService {

  uploadDetails: Upload[] = [];

  constructor() { }

  addUpload(upload: Upload) {
    this.uploadDetails.push(upload);
    console.log(this.uploadDetails)
  }
  getUploads() {
    return this.uploadDetails;
  }

  activeUploadsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  activeUploads = 0;
  newActiveUpload() {
    this.activeUploads++;
    this.activeUploadsSubject.next(this.activeUploads);
  }
  completeActiveUpload() {
    this.activeUploads--;
    this.activeUploadsSubject.next(this.activeUploads);
  }
  getActiveUploads() {
    return this.activeUploadsSubject;
  }
}
