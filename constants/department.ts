export enum Departments {
  PMO = 1,
  Developer = 2,
  Test = 3,
}

export function getDepartmentDescription(department: Departments): string {
  switch (department) {
    case Departments.Developer:
      return 'Develop';
    case Departments.Test:
      return 'Test';
    case Departments.PMO:
      return 'Project Manager Office';
    default:
      return 'Default';
  }
}