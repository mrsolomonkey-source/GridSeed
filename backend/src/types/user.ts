export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}