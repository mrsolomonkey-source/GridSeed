// src/types/user.ts

import { Capability } from '../config/rolesConfig';

/**
 * Enum of supported user roles.
 * Roles are high-level labels that map to sets of capabilities.
 */
export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
  Moderator = 'moderator' // ✅ Example: extended role
}

/**
 * IUser interface defines the shape of a user object.
 * - `role` is the assigned role (Admin, Editor, Viewer, etc.)
 * - `capabilities` are derived at runtime from roleCapabilities
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  capabilities?: Capability[]; // derived from roleCapabilities
}
