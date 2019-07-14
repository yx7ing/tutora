import { Upload } from './upload';
import { TutorExperience } from './tutorExperience';

export interface UserTutor {
    email: string;
    name: string;
    dob: string;
    mobile: string;
    address: string;
    degree: string;
    yoc: string;
    uoc: string;
    wam: string;
    cv: Upload;
    tutorExperience: TutorExperience[];
}