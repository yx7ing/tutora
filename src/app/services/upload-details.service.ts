import { Injectable } from '@angular/core';
import { Upload } from '../models/upload';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDetailsService {

  cvUploadDetails: Upload;
  myExpUploadDetails: Upload[] = [];

  constructor() { }

  addMyExpUpload(upload: Upload) {
    while (this.myExpUploadDetails.length < upload.id) {
      this.myExpUploadDetails.push(null);
    }
    this.myExpUploadDetails[upload.id] = upload;
  }
  removeMyExpUpload(i: number) {
    if (i < this.myExpUploadDetails.length) {
      this.myExpUploadDetails.splice(i, 1);
    }
  }
  getMyExpUploads() {
    return this.myExpUploadDetails;
  }

  addCVUpload(upload: Upload) {
    this.cvUploadDetails = upload;
    console.log(this.cvUploadDetails);
  }
  getCvUpload() {
    return this.cvUploadDetails;
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
