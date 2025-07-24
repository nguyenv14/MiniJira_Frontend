export enum Roles {
  ADMIN = 1,
  LEADER = 2,
  MEMBER = 3,
}

export function getRoleDescription(role: Roles): string {
  switch (role) {
    case Roles.ADMIN:
      return 'Admin';
    case Roles.LEADER:
      return 'Leader';
    case Roles.MEMBER:
      return 'Member';
    default:
      return 'Default';
  }
}