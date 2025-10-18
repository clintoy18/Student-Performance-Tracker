import Profile from '../components/dashboard/Profile';
import Overview from '../components/dashboard/student/Overview';
import AdminOverView from '../components/dashboard/admin/AdminOverview';
import Subjects from '../components/dashboard/admin/Subjects';
import UserTable from '../components/dashboard/user-management/Table';
import { Grade } from '../components/dashboard/student/Grade';
import { ManageStudents } from '../components/dashboard/teacher/ManageStudents';
import { StudentSubjects } from '../components/dashboard/student/StudentSubjects';

export type Role = 'Student' | 'Teacher' | 'Admin';

// Map backend numeric roles to Role strings
const NUMERIC_ROLE_MAP: Record<number, Role | undefined> = {
    0: 'Student',
    1: 'Teacher',
    2: 'Admin',
};

export const ROLE_TO_NUMBER: Record<Role, number> = {
    Student: 0,
    Teacher: 1,
    Admin: 2,
};

export const studentTabs = [
    { label: "Overview", content: <Overview /> },
    { label: "Subjects", content: <StudentSubjects /> },
    { label: "My Grades", content: <Grade /> },
    { label: "Profile", content: <Profile /> },
];

export const teacherTabs = [
    { label: "My Subjects", content: <p>Manage the subjects you handle.</p> },
    { label: "Manage Students", content: <ManageStudents /> },
    { label: "Profile", content: <Profile /> },
];

export const adminTabs = [
    { label: "Overview", content: <AdminOverView /> },
    { label: "Users", content: <UserTable /> },
    { label: "Courses", content: <Subjects /> },
    { label: "Profile", content: <Profile /> },
];


export function getRoleConfig(role: Role) {
    switch (role) {
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

export const isValidRole = (role: string): role is Role => {
    return ['Student', 'Teacher', 'Admin'].includes(role as Role);
};

export function parseRole(maybeRole: string): Role | null {
    if (isValidRole(maybeRole)) {
        return maybeRole; // TypeScript now knows this is a valid Role
    }
    return null; // or throw an error, depending on your needs
}

// Convert a numeric role (from API) to Role type
export function parseNumericRole(roleNum: unknown): Role | null {
    // Ensure it's a number
    if (typeof roleNum !== 'number' || !Number.isInteger(roleNum)) {
        return null;
    }

    const role = NUMERIC_ROLE_MAP[roleNum];
    return role ?? null;
}