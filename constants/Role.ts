export enum Roles {
  ADMIN = 1,
  LEADER = 2,
  MEMBER = 3,
}

export function getRoleDescription(role: Roles): string {
  switch (role) {
    case Roles.ADMIN:
      return 'Quản trị viên';
    case Roles.LEADER:
      return 'Trưởng nhóm';
    case Roles.MEMBER:
      return 'Thành viên';
    default:
      return 'Không xác định';
  }
}