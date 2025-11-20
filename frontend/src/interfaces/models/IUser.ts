import type { Role } from "utils/roleUtils";

export interface IUser {
    UserId: string;
    FirstName: string
    MiddleName: string
    LastName: string 
    Program?: string;
    CreatedTime: string
    Role: Role
}