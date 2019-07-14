import { CourseLink } from './courseLink';

export interface UserLecturer {
    email: string;
    name: string;
    admin: string;
    courseLinks: CourseLink[];
}