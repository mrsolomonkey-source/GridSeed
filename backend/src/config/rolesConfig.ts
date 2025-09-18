// rolesConfig.ts
export const roleCapabilities = {
  admin: ['manage_users', 'edit_content', 'view_reports'],
  editor: ['edit_content'],
  viewer: ['view_content'],
  moderator: ['ban_users', 'view_content']
} as const;

export type Capability = typeof roleCapabilities[keyof typeof roleCapabilities][number];
