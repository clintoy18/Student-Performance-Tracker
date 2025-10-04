export interface ILoginRequest {
    userId: string;
    password: string;
}

export interface IRegisterRequest {
    userId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    program: string;
}