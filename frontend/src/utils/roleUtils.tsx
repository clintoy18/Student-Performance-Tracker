import Profile from '../components/dashboard/Profile';
import Overview from '../components/dashboard/student/Overview';
import AdminOverView from '../components/dashboard/admin/AdminOverview';
import Subjects from '../components/dashboard/admin/Subjects';
import UserTable from '../components/dashboard/user-management/Table';
import { Grade } from '../components/dashboard/student/Grade';
import { ManageStudents } from '../components/dashboard/teacher/ManageStudents';
import { StudentCourse } from "../components/dashboard/student/StudentCourse";

export type Role = 'Student' | 'Teacher' | 'Admin';


export const studentTabs = [
    { label: "Overview", content: <Overview /> },
    { label: "Subjects", content: <StudentCourse /> },
    { label: "My Grades", content: <Grade /> },
    { label: "Profile", content: <Profile /> },
];

export const teacherTabs = [
    { label: "My Subjects", content: <p>Manage the subjects you handle.</p> },
    { label: "Manage Students", content: <ManageStudents />},
    { label: "Profile", content: <Profile /> },
];

export const adminTabs = [
    { label: "Overview", content: <AdminOverView /> },
    { label: "Users", content: <UserTable /> },
    { label: "Subjects", content: <Subjects /> },
    { label: "Profile", content: <Profile /> },
];


export function getRoleConfig(role: Role) {
    switch(role) {
        case "Admin":
            return {
                tabs: adminTabs,
                description: "Manage users, oversee reports, and configure settings.",
            };
        case "Teacher": 
            return {
                tabs: teacherTabs,
                description: "Manage your subjects, grade students, and track their progress.",
            };
        case "Student":
            return {
                tabs: studentTabs,
                description: "View your subjects, grades, and progress tracking.",
            };
    };
};